import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { DatasetService } from './dataset.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetWord } from '../interfaces/dataset-word';

@Injectable({
  providedIn: 'root'
})
export class SignDetectorModelService {

  private mobilenet: tf.GraphModel;
  private model: tf.LayersModel;

  private predictionInProcess: boolean;
  private handsDetected: boolean;

  private canvasElement: HTMLCanvasElement;
  
  private MOBILE_NET_INPUT_WIDTH = 224;
  private MOBILE_NET_INPUT_HEIGHT = 224;

  private itemPredictionSubject = new BehaviorSubject<DatasetWord>(null);
  private _itemPrediction: DatasetWord;
  itemPrediction: Observable<DatasetWord> = this.itemPredictionSubject.asObservable();

  constructor(private datasetService: DatasetService) { }

  setElements(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
  }

  setHandsDetected(handsDetected: boolean) {
    this.handsDetected = handsDetected;
  }

  async loadMobileNetFeatureModel() {
    const URL = `${window.location.protocol}//${window.location.host}/assets/mobilenet/model.json`;
    this.mobilenet = await tf.loadGraphModel(URL);

    tf.tidy(() => {
      let answer: any = this.mobilenet.predict(tf.zeros([1, this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH, 3]));
      console.log(answer.shape);
    });
  }

  async loadTrainedModelFromURL(url: string) {
    this.model = await tf.loadLayersModel(url);
    console.log('Modal de firebase listo para usarse!!!', this.model);
  }

  startPrediction() {
    if (!this.predictionInProcess) {
      console.log('inciando predicción');
      this.predictionInProcess = true;
      this.predictionLoop();
    }
  }

  private predictionLoop = () => {
    if (this.predictionInProcess) {
      if (this.handsDetected) {
        tf.tidy(() => {
          let imageFeatures = this.calculateFeaturesOnCurrentFrame();
          let modelPredict: any = this.model.predict(imageFeatures.expandDims());
          let prediction = modelPredict.squeeze();
          let highestIndex = prediction.argMax().arraySync();
          let predictionArray = prediction.arraySync();
          let confidencePercentage = Math.floor(predictionArray[highestIndex] * 100);
          
          let datasetItem = this.datasetService.getWord(highestIndex);
          if (!this._itemPrediction || this._itemPrediction.word_index != highestIndex) {
            this._itemPrediction = datasetItem;
            this.itemPredictionSubject.next(datasetItem);
          }
        });
      }
      window.requestAnimationFrame(this.predictionLoop);
    }
  }

  private calculateFeaturesOnCurrentFrame() {
    return tf.tidy(() => {
      let videoFrameAsTensor = tf.browser.fromPixels(this.canvasElement);
      let resizedTensorFrame = tf.image.resizeBilinear(
        videoFrameAsTensor,
        [this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH],
        true
      );

      let normalizedTensorFrame = resizedTensorFrame.div(255);

      let prediction: any = this.mobilenet.predict(normalizedTensorFrame.expandDims());
      return prediction.squeeze();
    });
  }

}
