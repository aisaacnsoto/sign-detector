import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { DatasetService } from './dataset.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetItem } from '../interfaces/dataset-item';

@Injectable({
  providedIn: 'root'
})
export class SignClassificationService {

  private mobilenet: tf.GraphModel;
  private model: tf.Sequential;

  private collectingData: boolean;
  private predictionInProcess: boolean;
  private handsDetected: boolean;

  private canvasElement: HTMLCanvasElement;
  private index: number;
  
  private MOBILE_NET_INPUT_WIDTH = 224;
  private MOBILE_NET_INPUT_HEIGHT = 224;
  private EPOCHS_NUMBER = 10;

  
  private trainingDataInputs = [];
  private trainingDataOutputs = [];

  private itemPredictionSubject = new BehaviorSubject<DatasetItem>(null);
  private _itemPrediction: DatasetItem;
  itemPrediction: Observable<DatasetItem> = this.itemPredictionSubject.asObservable();

  constructor(private datasetService: DatasetService) { }

  setCanvas(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
  }

  setHandsDetected(handsDetected: boolean) {
    this.handsDetected = handsDetected;
  }

  getEpochsNumber() {
    return this.EPOCHS_NUMBER;
  }

  async loadMobileNetFeatureModel() {
    console.log('Awaiting TF.js load...');
    const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    this.mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
    console.log('MobileNet v3 loaded successfully!');

    tf.tidy(() => {
      let answer: any = this.mobilenet.predict(tf.zeros([1, this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH, 3]));
      console.log(answer.shape);
    });
  }

  private constructModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: this.datasetService.getItems().length, activation: 'softmax' }));

    this.model.summary();

    this.model.compile({
      optimizer: 'adam',
      loss: (this.datasetService.getItems().length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async train(onEpochBegin) {
    this.constructModel();

    tf.util.shuffleCombo(this.trainingDataInputs, this.trainingDataOutputs);

    let outputsAsTensor = tf.tensor1d(this.trainingDataOutputs, 'int32');
    let oneHotOutputs = tf.oneHot(outputsAsTensor, this.datasetService.getItems().length);
    let inputsAsTensor = tf.stack(this.trainingDataInputs);

    let results = await this.model.fit(inputsAsTensor, oneHotOutputs, {
      shuffle: true,
      batchSize: 5,
      epochs: this.EPOCHS_NUMBER,
      callbacks: { onEpochBegin: onEpochBegin }
    });

    outputsAsTensor.dispose();
    oneHotOutputs.dispose();
    inputsAsTensor.dispose();
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
          
          let datasetItem = this.datasetService.getItem(highestIndex);
          if (!this._itemPrediction || this._itemPrediction.index != highestIndex) {
            this._itemPrediction = datasetItem;
            this.itemPredictionSubject.next(datasetItem);
          }
          /*let text = 'Prediction: ' + datasetItem.label + ' with ' +  + '% confidence';
          console.log(text);*/
        });
      }
      window.requestAnimationFrame(this.predictionLoop);
    }
  }

  private calculateFeaturesOnCurrentFrame(saveImage: boolean = false) {
    return tf.tidy(() => {
      if (saveImage) {
        let dataURL = this.canvasElement.toDataURL('image/jpeg');
        this.datasetService.addImageItem(this.index, dataURL);
      }
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

  startDataCollection(index: number) {
    if (!this.collectingData) {
      this.collectingData = true;
      this.index = index;
      this._dataCollectionLoop();
    }
  }

  private _dataCollectionLoop = () => {
    if (this.collectingData) {
      if (this.handsDetected) {
        let imageFeatures = this.calculateFeaturesOnCurrentFrame(true);
        this.trainingDataInputs.push(imageFeatures);
        this.trainingDataOutputs.push(this.index);
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
    this.datasetService.clearItems();
    for (let i = 0; i < this.trainingDataInputs.length; i++) {
      this.trainingDataInputs[i].dispose();
    }
    this.trainingDataInputs.splice(0);
    this.trainingDataOutputs.splice(0);
    console.log('No data collected');

    console.log('Tensors in memory: ' + tf.memory().numTensors);
  }

  async save(modelName: string) {
    let url = 'downloads://' + modelName;
    const saveResults = await this.model.save(url);
    return url;
  }

}
