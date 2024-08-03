import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {

  private videoPlaying: boolean = false;
  private videoElement: HTMLVideoElement;
  private cameraReadySubject = new BehaviorSubject<boolean>(false);
  cameraReady$: Observable<boolean> = this.cameraReadySubject.asObservable();

  constructor() { }

  private async prepareCamera() {
    const constraints = {
      video: true,
      width: 640,
      height: 480
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }
  
  async initializeCamera(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.videoPlaying) {
      try {
        let stream = await this.prepareCamera();
        this.videoElement = videoElement;
        this.videoElement.srcObject = stream;
  
        return new Promise((resolve) => {
          this.videoElement.onloadedmetadata = () => {
            this.videoPlaying = true;
            this.cameraReadySubject.next(true);
            resolve();
          };
        });
      } catch (err) {
        console.error('Error accessing webcam: ', err);
        throw err;
      }
    }
  }

  stopCamera(): void {
    if (this.videoPlaying) {
      const stream = this.videoElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
  
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
      this.videoPlaying = false;
      this.cameraReadySubject.next(false);
    }
  }

  isVideoPlaying(): boolean {
    return this.videoPlaying;
  }


}
