import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandLandmarkerService } from 'src/app/services/common/hand-landmarker.service';
import { MobilenetService } from 'src/app/services/common/mobilenet.service';
import { PracticeModelService } from 'src/app/services/common/practice-model.service';
import { DatasetService } from 'src/app/services/dataset.service';
import { JsonFileService } from 'src/app/services/json-file.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-splash-screen-page',
  templateUrl: './splash-screen-page.component.html',
  styleUrls: ['./splash-screen-page.component.css']
})
export class SplashScreenPageComponent implements OnInit {

  constructor(
    private _handLandmarkerService: HandLandmarkerService,
    private _mobilenetService: MobilenetService,
    private _jsonFileService: JsonFileService,
    private _datasetService: DatasetService,
    private _practiceModelService: PracticeModelService,
    private _router: Router
    ) {}

    ngOnInit() {
      this.loadServices();
    }

    async loadServices() {
      await this._handLandmarkerService.loadHandLandmarker();
      await this._mobilenetService.loadMobileNetFeatureModel();

      if (environment.training_mode) {
        this._router.navigate(['/training-welcome']);
      } else {
        await this.initializaDataset();
        await this._practiceModelService.loadFromAssets();
        this._router.navigate(['/home']);
      }
  
    }
  
    async initializaDataset() {
      let datasetJson = await this._jsonFileService.loadFromAssets();
      this._datasetService.initializeDataset(datasetJson);
    }
  
}
