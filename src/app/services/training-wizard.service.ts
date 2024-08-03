import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetService } from 'src/app/services/dataset.service';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { MobilenetService } from './common/mobilenet.service';
import { TrainModelService } from './common/train-model.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingWizardService {

  private collectingData: boolean;
  private predictionInProcess: boolean;
  private handsDetected: boolean;

  private canvasElement: HTMLCanvasElement;
  private videoElement: HTMLVideoElement;
  private word_index: number;
  
  private EPOCHS_NUMBER = 10;

  
  private trainingDataInputs = [];
  private trainingDataOutputs = [];

  private itemPrediction = new BehaviorSubject<DatasetWord>(null);

  constructor(
    private datasetService: DatasetService,
    private _mobilenetService: MobilenetService,
    private _trainModelService: TrainModelService
    ) { }

  setElements(canvasElement: HTMLCanvasElement, videoElement: HTMLVideoElement) {
    this.canvasElement = canvasElement;
    this.videoElement = videoElement;
  }

  setHandsDetected(handsDetected: boolean) {
    this.handsDetected = handsDetected;
  }

  getEpochsNumber() {
    return this.EPOCHS_NUMBER;
  }

  async train(onEpochBegin) {
    await this._trainModelService.train(
      this.trainingDataInputs,
      this.trainingDataOutputs,
      this.datasetService.getWords().length,
      this.EPOCHS_NUMBER,
      onEpochBegin
    );
  }

  startPrediction() {
    if (!this.predictionInProcess) {
      console.log('inciando predicción');
      this.predictionInProcess = true;
      this._predictionLoop();
    }
    return this.itemPrediction.asObservable();
  }

  private _predictionLoop = () => {
    if (this.predictionInProcess) {
      if (this.handsDetected) {
        tf.tidy(() => {
          let imageFeatures = this._mobilenetService.calculateFeaturesOnCurrentFrame(this.canvasElement);
          let highestIndex = this._trainModelService.predict(imageFeatures);
          
          let datasetItem = this.datasetService.getWord(highestIndex);
          if (!this.itemPrediction.getValue() || this.itemPrediction.getValue().word_index != highestIndex) {
            this.itemPrediction.next(datasetItem);
          }
        });
      }
      window.requestAnimationFrame(this._predictionLoop);
    }
  }

  private saveFrameToDataset() {
    let handDetectionImageURL = this.getHandDetectionImageURL();
    let webcamImageURL = this.getWebcamImageURL();

    this.datasetService.addWordFrames(this.word_index, handDetectionImageURL, webcamImageURL);
  }

  private getHandDetectionImageURL() {
    return this.canvasElement.toDataURL('image/jpeg');
  }

  private getWebcamImageURL() {
    let canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    let canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(this.videoElement, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    let base64Image = canvas.toDataURL('image/jpeg');
    return base64Image;
  }

  startDataCollection(index: number) {
    if (!this.collectingData) {
      this.collectingData = true;
      this.word_index = index;
      this._dataCollectionLoop();
    }
  }

  private _dataCollectionLoop = () => {
    if (this.collectingData) {
      if (this.handsDetected) {
        let imageFeatures = this._mobilenetService.calculateFeaturesOnCurrentFrame(this.canvasElement);
        this.trainingDataInputs.push(imageFeatures);
        this.trainingDataOutputs.push(this.word_index);
        this.saveFrameToDataset();
      }

      window.requestAnimationFrame(this._dataCollectionLoop);
    }
  }

  stopDataCollection() {
    this.collectingData = false;
  }

  reset() {
    this.collectingData = false;
    this.predictionInProcess = false;
    this.datasetService.clearWords();
    for (let i = 0; i < this.trainingDataInputs.length; i++) {
      this.trainingDataInputs[i].dispose();
    }
    this.trainingDataInputs.splice(0);
    this.trainingDataOutputs.splice(0);
    console.log('No data collected');

    console.log('Tensors in memory: ' + tf.memory().numTensors);
  }

  async save(url: string) {
    return await this._trainModelService.save(url);
  }

}
