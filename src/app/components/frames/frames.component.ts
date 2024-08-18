import { Component, OnInit } from '@angular/core';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { HandLandmarkerService } from 'src/app/services/common/hand-landmarker.service';
import { JsonFileService } from 'src/app/services/json-file.service';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.css']
})
export class FramesComponent implements OnInit {
  sections: DatasetSection[] = [
    { section_index: 0, section_label: 'Alfabeto', words_count: 0 },
    { section_index: 1, section_label: 'Saludos y despedidas', words_count: 0 },
    { section_index: 2, section_label: 'Presentaciones', words_count: 0 },
    { section_index: 3, section_label: 'Emociones y estados de ánimo', words_count: 0 },
    { section_index: 4, section_label: 'Días de la semana', words_count: 0 },
    { section_index: 5, section_label: 'Meses del año', words_count: 0 },
    { section_index: 6, section_label: 'Frases comunes', words_count: 0 },
    { section_index: 7, section_label: 'Tiempo y clima', words_count: 0 },
    { section_index: 8, section_label: 'Frases de emergencia', words_count: 0 },
  ];
  words: DatasetWord[] = [];
  hand_landmark_frames?: string[];
  webcam_frames?: string[];

  constructor(
    private _jsonFileService: JsonFileService,
    private _handLandmarkerService: HandLandmarkerService
  ) {}

  async ngOnInit() {
    const data = await this._jsonFileService.loadFramesFromAssets();
    // console.log(data);
    for (let i = 0; i < data.words.length; i++) {
      this.hand_landmark_frames = [];
      this.webcam_frames = [];
      let word = data.words[i];
      console.log(word.word_label);
      for (let j = 0; j < word.webcam_frames.length; j++) {
        let frame = word.webcam_frames[j];
        let result:any = await this.base64ToLandmarks(frame);

        if (result.handsDetected) {
          this.hand_landmark_frames.push(result.image);
          this.webcam_frames.push(frame);
        }
      }
      word.webcam_frames = this.webcam_frames;
      word.hand_landmark_frames = this.hand_landmark_frames;
    }
    // Convertir el arreglo a JSON
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);

    // Crear un enlace temporal y simular un clic para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datasetgenerado.json';
    document.body.appendChild(a);
    a.click();

    // Limpiar el enlace temporal
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(data);
  }

  base64ToLandmarks(base64String) {
    return new Promise((resolve, reject) => {
      // Crear un nuevo elemento <img>
      const img = new Image();

      // Configurar el src de la imagen como el string Base64
      img.src = base64String;

      // Esperar a que la imagen se cargue
      img.onload = () => {
        try {
          // Convertir la imagen en un tensor
          let canvas = document.createElement('canvas');
          const result: any = this._handLandmarkerService.detectImg(img).drawImg(canvas, img.width, img.height);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      // Manejar errores de carga de imagen
      img.onerror = (error) => reject(error);
    });
  }

}
