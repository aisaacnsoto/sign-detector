import { Component, OnInit } from '@angular/core';
import { SignClassificationService } from './services/sign-classification.service';
import { HandDetectionService } from './services/hand-detection.service';
import { WebcamService } from './services/webcam.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  
  constructor(
    private _handDetectionService: HandDetectionService,
    private _signClassificationService: SignClassificationService,
    private _webcamService: WebcamService,
    ) {}

  async ngOnInit() {
    await this._handDetectionService.createHandLandmarker();
    await this._signClassificationService.loadMobileNetFeatureModel();

    this._handDetectionService.handsDetected.subscribe((handsDetected) => {
      this._signClassificationService.setHandsDetected(handsDetected);
    });
  }

}
