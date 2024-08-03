import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HandLandmarkerService } from './common/hand-landmarker.service';

@Injectable({
  providedIn: 'root'
})
export class HandDetectionService {

  private videoEl: HTMLVideoElement;
  private canvasEl: HTMLCanvasElement;
  private detectionInProcess: boolean;

  private handsDetected = new BehaviorSubject<boolean>(false);

  constructor(
    private _handLandmarkerService: HandLandmarkerService
  ) { }

  startHandsDetection(videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement) {
    if (!this.detectionInProcess) {
      this.detectionInProcess = true;
      this.videoEl = videoEl;
      this.canvasEl = canvasEl;

      this.handsDetectionLoop();
    }
    return this.handsDetected.asObservable();
  }

  stopHandDetection() {
    this.detectionInProcess = false;
  }

  private handsDetectionLoop = () => {
    if (this.detectionInProcess && this.videoEl.srcObject != null) {
      let handsDetected = this._handLandmarkerService.detectAndDraw(this.videoEl, this.canvasEl);

      if (handsDetected) {
        if (!this.handsDetected.getValue()) {
          this.handsDetected.next(true);
        }
      } else {
        if (this.handsDetected.getValue()) {
          this.handsDetected.next(false);
        }
      }

      window.requestAnimationFrame(this.handsDetectionLoop);
    }
  }

}
