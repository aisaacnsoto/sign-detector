import { Component } from '@angular/core';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-training-step4-page',
  templateUrl: './training-step4-page.component.html',
  styleUrls: ['./training-step4-page.component.css']
})
export class TrainingStep4PageComponent {

  dataset: DatasetItem[] = [];

  constructor(
    private _datasetService: DatasetService,
    ) {
    this.dataset = this._datasetService.getItems();
  }

  /*async getGifURL(frames: string[]) {
    return await this._gifGeneratorService.generateGif(frames);
  }*/

}
