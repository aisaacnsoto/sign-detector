import { Injectable } from '@angular/core';
import { HandLandmarker, FilesetResolver, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

@Injectable({
  providedIn: 'root'
})
export class HandLandmarkerService {

  private _handLandmarker: HandLandmarker;
  private _handLandmarks: NormalizedLandmark[][];

  async loadHandLandmarker() {
    if (!this._handLandmarker) {
      let url = `${window.location.protocol}//${window.location.host}/assets/third_party/mediapipe`;
      let vision = await FilesetResolver.forVisionTasks(url);
      this._handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `assets/third_party/mediapipe/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      console.log('HandLandmarker cargado');
    }
  }

  detectAndDraw(videoEl: HTMLVideoElement, canvas: HTMLCanvasElement) {
    return this.detect(videoEl).draw(canvas, videoEl.videoWidth, videoEl.videoHeight).handsDetected();
  }

  private detect(videoEl: HTMLVideoElement) {
    if (this._handLandmarker) {
      let startTimeMs = performance.now();
      let result = this._handLandmarker.detectForVideo(videoEl, startTimeMs);
      this._handLandmarks = result.landmarks;
      this._handLandmarks = result.landmarks;
    }
    return this;
  }

  private draw(canvas: HTMLCanvasElement, width: number, height: number) {
    if (this._handLandmarks) {
      let canvasCtx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let landmarks of this._handLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }

      canvasCtx.restore();
    }
    return this;
  }

  private handsDetected(): boolean {
    return (this._handLandmarks.length > 0);
  }

}
