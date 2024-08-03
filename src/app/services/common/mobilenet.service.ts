import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class MobilenetService {

  private mobilenet: tf.GraphModel;
  private MOBILE_NET_INPUT_WIDTH = 224;
  private MOBILE_NET_INPUT_HEIGHT = 224;

  async loadMobileNetFeatureModel() {
    if (!this.mobilenet) {
      const URL = `${window.location.protocol}//${window.location.host}/assets/third_party/mobilenet/model.json`;
      this.mobilenet = await tf.loadGraphModel(URL);
  
      tf.tidy(() => {
        let answer: any = this.mobilenet.predict(tf.zeros([1, this.MOBILE_NET_INPUT_HEIGHT, this.MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(answer.shape);
      });
    }
    return this.mobilenet;
  }

  
  calculateFeaturesOnCurrentFrame(canvasEl: HTMLCanvasElement) {
    return tf.tidy(() => {
      let videoFrameAsTensor = tf.browser.fromPixels(canvasEl);
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
