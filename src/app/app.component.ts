import { Component, OnInit } from '@angular/core';
import { SignClassificationService } from './services/sign-classification.service';
import { HandDetectionService } from './services/hand-detection.service';
import { PrimeNGConfig } from 'primeng/api';
import { DatasetService } from './services/dataset.service';
import { JsonFileService } from './services/json-file.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  
  constructor(
    private _handDetectionService: HandDetectionService,
    private _signClassificationService: SignClassificationService,
    private _jsonFileService: JsonFileService,
    private _datasetService: DatasetService,
    private primengConfig: PrimeNGConfig
    ) {}

  async ngOnInit() {
    this.primengConfig.ripple = true;
    await this._handDetectionService.loadHandLandmarker();
    await this._signClassificationService.loadMobileNetFeatureModel();
    await this.initializaDataset();

    this._handDetectionService.handsDetected.subscribe((handsDetected) => {
      this._signClassificationService.setHandsDetected(handsDetected);
    });
  }

  async initializaDataset() {
    let datasetJson = await this._jsonFileService.loadFromFirebase();
    console.log('dataset',datasetJson);
    this._datasetService.initializeDataset(datasetJson);
  }

}
