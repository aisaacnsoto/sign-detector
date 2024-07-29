import { Component, OnInit } from '@angular/core';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { JsonFileService } from 'src/app/services/json-file.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-training-step4-page',
  templateUrl: './training-step4-page.component.html',
  styleUrls: ['./training-step4-page.component.css']
})
export class TrainingStep4PageComponent implements OnInit {

  dataset: DatasetJson;
  datasetFolderName = environment.dataset.directory;

  constructor(
    private _jsonFileService: JsonFileService
  ) {}
  
  async ngOnInit() {
    this.dataset = await this._jsonFileService.loadFromFirebase();
    
    // let url = await getDownloadURL(storageRef);
    // console.log(url);
    /*this._jsonFileService.loadArrayFromJson('dataset.json').then(result => {
      this.dataset = result.words;
      this.dataset[2] = result.words[0];
      this.dataset[3] = result.words[1];
    }).catch(reason => {
      console.log('error', reason);
    });*/
  }

}
