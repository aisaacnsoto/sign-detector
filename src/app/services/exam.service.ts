import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatasetWord } from '../interfaces/dataset-word';

export interface Question {
  question: string;
  options: { image_url: string, correct: boolean }[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private questions: Question[] = [];
  private score = 0;

  constructor(private http: HttpClient) {}

  // Cargar preguntas desde el archivo JSON
  loadQuestions(): Observable<any> {
    return this.http.get('assets/words.json');
  }

  // Generar preguntas a partir de las palabras del archivo JSON
  generateQuestions(data: DatasetWord[]): Question[] {
    for (let i = 0; i < 10; i++) {
      const correctIndex = Math.floor(Math.random() * data.length);
      const correctWordLabel = data[correctIndex].word_label;
      const correctWordGifURL = data[correctIndex].word_gif;

      const question: Question = {
        question: `¿Cuál es la seña para ${correctWordLabel}?`,
        options: []
      };

      // Añadir la opción correcta
      question.options.push({ image_url: correctWordGifURL, correct: true });

      // Añadir tres opciones incorrectas
      const usedIndexes = [correctIndex];
      while (question.options.length < 4) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (!usedIndexes.includes(randomIndex)) {
          question.options.push({ image_url: data[randomIndex].word_gif, correct: false });
          usedIndexes.push(randomIndex);
        }
      }

      // Mezclar las opciones
      question.options.sort(() => Math.random() - 0.5);

      this.questions.push(question);
    }

    return this.questions;
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  getScore(): number {
    return this.score;
  }

  incrementScore(): void {
    this.score += 1;
  }
}
