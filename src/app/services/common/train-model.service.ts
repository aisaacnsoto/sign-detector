import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetService } from 'src/app/services/dataset.service';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { MobilenetService } from './mobilenet.service';

@Injectable({
  providedIn: 'root'
})
export class TrainModelService {

  private model: tf.Sequential;

  private constructModel(units: number) {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units, activation: 'softmax' }));

    this.model.summary();

    this.model.compile({
      optimizer: 'adam',
      loss: (units === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async train(trainingDataInputs: any[], trainingDataOutputs: any[], units: number, epochs: number, onEpochBegin) {
    this.constructModel(units);

    tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);

    let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
    let oneHotOutputs = tf.oneHot(outputsAsTensor, units);
    let inputsAsTensor = tf.stack(trainingDataInputs);

    let results = await this.model.fit(inputsAsTensor, oneHotOutputs, {
      shuffle: true,
      batchSize: 5,
      epochs,
      callbacks: { onEpochBegin }
    });

    outputsAsTensor.dispose();
    oneHotOutputs.dispose();
    inputsAsTensor.dispose();
  }

  predict(imageFeatures: any) {
    let modelPredict: any = this.model.predict(imageFeatures.expandDims());
    let prediction = modelPredict.squeeze();
    let highestIndex: number = prediction.argMax().arraySync();
    let predictionArray = prediction.arraySync();
    let confidencePercentage = Math.floor(predictionArray[highestIndex] * 100);
    return highestIndex;
  }

  async save(url: string) {
    return await this.model.save(url);
  }

}
