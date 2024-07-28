import { Component, OnInit } from '@angular/core';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { JsonFileService } from 'src/app/services/json-file.service';

@Component({
  selector: 'app-training-step4-page',
  templateUrl: './training-step4-page.component.html',
  styleUrls: ['./training-step4-page.component.css']
})
export class TrainingStep4PageComponent implements OnInit {

  dataset: DatasetItem[] = [];

  constructor(
    private _jsonFileService: JsonFileService
  ) {}
  
  ngOnInit() {
    this._jsonFileService.loadArrayFromJson('dataset.json').then(result => {
      this.dataset = result.words;
      this.dataset[2] = result.words[0];
      this.dataset[3] = result.words[1];
    }).catch(reason => {
      console.log('error', reason);
    });
  }

}
