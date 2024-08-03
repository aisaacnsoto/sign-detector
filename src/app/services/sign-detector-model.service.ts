import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetService } from 'src/app/services/dataset.service';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { MobilenetService } from './common/mobilenet.service';
import { TrainModelService } from './common/train-model.service';
import { PracticeModelService } from './common/practice-model.service';

@Injectable({
  providedIn: 'root'
})
export class SignDetectorModelService {

  private predictionInProcess: boolean;
  private handsDetected: boolean;

  private canvasElement: HTMLCanvasElement;
  
  private itemPrediction = new BehaviorSubject<DatasetWord>(null);

  constructor(
    private datasetService: DatasetService,
    private _mobilenetService: MobilenetService,
    private _practiceModelService: PracticeModelService
  ) { }

  setElements(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
  }

  setHandsDetected(handsDetected: boolean) {
    this.handsDetected = handsDetected;
  }

  startPrediction() {
    if (!this.predictionInProcess) {
      console.log('inciando predicción');
      this.predictionInProcess = true;
      this.predictionLoop();
    }
    return this.itemPrediction.asObservable();
  }

  private predictionLoop = () => {
    if (this.predictionInProcess) {
      if (this.handsDetected) {
        tf.tidy(() => {
          let imageFeatures = this._mobilenetService.calculateFeaturesOnCurrentFrame(this.canvasElement);
          let highestIndex = this._practiceModelService.predict(imageFeatures);
          
          let datasetItem = this.datasetService.getWord(highestIndex);
          if (!this.itemPrediction.getValue() || this.itemPrediction.getValue().word_index != highestIndex) {
            this.itemPrediction.next(datasetItem);
          }
        });
      }
      window.requestAnimationFrame(this.predictionLoop);
    }
  }

}
