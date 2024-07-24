import { Component, OnInit } from '@angular/core';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';
import { GifGeneratorService } from 'src/app/services/gif-generator.service';

@Component({
  selector: 'app-training-step4-page',
  templateUrl: './training-step4-page.component.html',
  styleUrls: ['./training-step4-page.component.css']
})
export class TrainingStep4PageComponent implements OnInit {

  dataset: DatasetItem[] = [];

  constructor(
    private _datasetService: DatasetService,
    private _gifGeneratorService: GifGeneratorService
    ) {}
  
  ngOnInit() {
    this.dataset = this._datasetService.getItems();
    
    this.generateGifs();
  }

  generateGifs() {
    if (this.dataset.length > 0) {
      this.dataset.forEach(item => {
        if (item.imagesCount > 0) {
          this._gifGeneratorService.generateGif(item.webcamImages).then(url => {
            item.imageGif = url;
          });
        }
      });
    }
  }

}
