import { Component, OnInit } from '@angular/core';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { JsonFileService } from 'src/app/services/json-file.service';
import { SignDetectorModelService } from 'src/app/services/sign-detector-model.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-training-step4-page',
  templateUrl: './training-step4-page.component.html',
  styleUrls: ['./training-step4-page.component.css']
})
export class TrainingStep4PageComponent implements OnInit {

  constructor(
    private _modelService: SignDetectorModelService,
    private _jsonFileService: JsonFileService
  ) {}
  
  async ngOnInit() {
    
    const filePath = `http://localhost:3000/getfile?path=model.json`;
    let response = await this._jsonFileService.getDownloadURL(filePath);
    await this._modelService.loadTrainedModelFromURL(response.download_url);
    
  }

}
