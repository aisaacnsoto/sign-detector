import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { DatasetService } from 'src/app/services/dataset.service';
import { GifGeneratorService } from 'src/app/services/common/gif-generator.service';
import { JsonFileService } from 'src/app/services/json-file.service';
import { TrainingWizardService } from 'src/app/services/training-wizard.service';

import { environment } from 'src/environments/environment';
import { DatasetSection } from 'src/app/interfaces/dataset-section';

@Component({
  selector: 'app-training-upload-model',
  templateUrl: './training-upload-model.component.html',
  styleUrls: ['./training-upload-model.component.css']
})
export class TrainingUploadModelComponent implements OnInit {

  words: DatasetWord[] = [];
  sections: DatasetSection[] = [];

  constructor(
    private _gifGeneratorService: GifGeneratorService,
    private _trainingWizardService: TrainingWizardService,
    private _datasetService: DatasetService,
    private _jsonFileService: JsonFileService,
    private _router: Router
    ) {}

  ngOnInit() {
    this.process();
  }

  async process() {
    this.words = this._datasetService.getWords();
    this.sections = this._datasetService.getSections();
    //await this.generateGifs();
    await this.uploadDatasetJson();
    //await this.uploadModel();
    setTimeout(() => {
      this._router.navigate(['/training-finish']);
    }, 1000);
  }

  async generateGifs() {
    if (this.words.length > 0) {
      for (let index = 0; index < this.words.length; index++) {
        if (this.words[index].frames_count > 0) {
          let url = await this._gifGeneratorService.generateGif(this.words[index].webcam_frames);
          this.words[index].word_gif = url;
        }
      }
    }
  }

  async uploadDatasetJson() {
    /*this.words.forEach(word => {
      word.hand_landmark_frames = undefined;
      word.webcam_frames = undefined;
    })*/
    let data: DatasetJson = {
      sections: this.sections,
      words: this.words
    };
    let url = `${environment.service_url}/upload_dataset`;
    let nombreArchivo = `${Date.now()}.json`;
    let body = {
      path: `${environment.dataset.path}/${nombreArchivo}`,
      nombre_archivo: nombreArchivo,
      json: JSON.stringify(data)
    };
    let response = await this._jsonFileService.uploadJsonFile(url, body);
    console.log(response);
  }

  async uploadModel() {
    this._trainingWizardService.save(`${environment.service_url}/upload_model`);
  }

}
