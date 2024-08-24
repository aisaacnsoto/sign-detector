import { Component, OnInit } from '@angular/core';
import { ExamService, Question } from 'src/app/services/exam.service';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.css']
})
export class ExamPageComponent {
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedOptionIndex: number | null = null;
  showNextButton = false;

  constructor(
    private _examService: ExamService,
    private _datasetService: DatasetService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.questions = this._examService.generateQuestions(this._datasetService.getWords());
    // this._examService.loadQuestions().subscribe((data) => {
    // });
  }

  selectOption(optionIndex: number): void {
    this.selectedOptionIndex = optionIndex;
    const selectedOption = this.questions[this.currentQuestionIndex].options[optionIndex];

    // Marcar puntaje si es correcto
    if (selectedOption.correct) {
      this._examService.incrementScore();
    }

    this.colorCards();
    this.showNextButton = true;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOptionIndex = null;
      this.showNextButton = false;
      this.cleanColorCards();
    } else {
      this._router.navigate(['/exam-result']);
    }
  }

  colorCards() {
    this.questions[this.currentQuestionIndex].options.forEach((option, index) => {
      let el = document.querySelector(`p-card.card-${index} div.p-card.p-component`);
      if (option.correct) {
        el.classList.add('correct');
      } else {
        el.classList.add('incorrect');
      }
    });
  }

  cleanColorCards() {
    this.questions[this.currentQuestionIndex].options.forEach((option, index) => {
      let el = document.querySelector(`p-card.card-${index} div.p-card.p-component`);
      el.classList.remove('correct');
      el.classList.remove('incorrect');
    });
  }
}
