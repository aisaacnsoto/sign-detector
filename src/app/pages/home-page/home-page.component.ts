import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';
import { JsonFileService } from 'src/app/services/json-file.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(
    private router: Router,
    private _jsonFileService: JsonFileService,
    private _datasetService: DatasetService,
    ) { }

  ngOnInit() {
  }

  /*async initializaDataset() {
    let datasetJson = await this._jsonFileService.loadFromFirebase();
    console.log('dataset',datasetJson);
    this._datasetService.initializeDataset(datasetJson);
  }*/

  onLearningClick = () => {
    this.router.navigate(['/learning/sections']);
  }

  onPracticeClick = () => {
    this.router.navigate(['/practice']);
  }

  onExamenClick = () => {
    this.router.navigate(['/exam']);
  }

  onConcienciaClick = () => {
    this.router.navigate(['/conciencia']);
  }
}
