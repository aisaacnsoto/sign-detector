import { Injectable } from '@angular/core';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandDetectionService {

  private handLandmarker: HandLandmarker;
  private videoElement: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;
  private detectionInProcess: boolean;

  private handsDetectedSubject = new BehaviorSubject<boolean>(false);
  private _handsDetected: boolean;
  handsDetected: Observable<boolean> = this.handsDetectedSubject.asObservable();

  constructor() { }

  async loadHandLandmarker() {
    const URL = `${window.location.protocol}//${window.location.host}/assets/mediapipe`;
    let vision = await FilesetResolver.forVisionTasks(URL);
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `assets/mediapipe/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
    });
    console.log('HandLandmarker cargado');
  }

  startHandsDetection(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    if (!this.detectionInProcess) {
      this.detectionInProcess = true;
      this.videoElement = videoElement;
      this.canvasElement = canvasElement;
  
      this.handsDetectionLoop();
    }
  }

  stopHandDetection() {
    this.detectionInProcess = false;
  }

  private handsDetectionLoop = () => {
    if (this.detectionInProcess && this.videoElement.srcObject != null) {

      let canvasCtx = this.canvasElement.getContext("2d");
      let position = this.videoElement.getBoundingClientRect();
      // this.canvasElement.style.width = this.videoElement.videoWidth.toString();
      // this.canvasElement.style.height = this.videoElement.videoHeight.toString();
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;
  
      let startTimeMs = performance.now();
      let results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);
  
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5
          });
          drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        }
        if (results.landmarks.length > 0) {
          if (!this._handsDetected) {
            this._handsDetected = true;
            this.handsDetectedSubject.next(true);
          }
        } else {
          if (this._handsDetected) {
            this._handsDetected = false;
            this.handsDetectedSubject.next(false);
          }
        }
      }
      canvasCtx.restore();
  
      window.requestAnimationFrame((this.handsDetectionLoop));
    }
  }

}
