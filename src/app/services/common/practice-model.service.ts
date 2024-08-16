import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatasetService } from 'src/app/services/dataset.service';
import { DatasetWord } from 'src/app/interfaces/dataset-word';

@Injectable({
  providedIn: 'root'
})
export class PracticeModelService {

  private model: tf.LayersModel;

  async loadFromAssets() {
    let url = `${window.location.protocol}//${window.location.host}/assets/model/model.json`;
    this.model = await tf.loadLayersModel(url);
    console.log('Model de firebase listo para usarse!!!', this.model);
  }

  predict(imageFeatures: any) {
    let modelPredict: any = this.model.predict(imageFeatures.expandDims());
    let prediction = modelPredict.squeeze();
    let highestIndex: number = prediction.argMax().arraySync();
    let predictionArray = prediction.arraySync();
    let confidencePercentage = Math.floor(predictionArray[highestIndex] * 100);
    return highestIndex;
  }

}
