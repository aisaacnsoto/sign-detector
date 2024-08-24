import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { DatasetService } from 'src/app/services/dataset.service';
import { GifGeneratorService } from 'src/app/services/common/gif-generator.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { JsonFileService } from 'src/app/services/json-file.service';
import { TrainingWizardService } from 'src/app/services/training-wizard.service';
import { WebcamService } from 'src/app/services/common/webcam.service';

import { environment } from 'src/environments/environment';
import { DatasetSection } from 'src/app/interfaces/dataset-section';

@Component({
  selector: 'app-training-test-page',
  templateUrl: './training-test-page.component.html',
  styleUrls: ['./training-test-page.component.css']
})
export class TrainingTestPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('status') statusEl: ElementRef;

  words: DatasetWord[] = [];
  sections: DatasetSection[] = [];
  predicting: boolean;

  constructor(
    private _webcamService: WebcamService,
    private _gifGeneratorService: GifGeneratorService,
    private _handDetectionService: HandDetectionService,
    private _trainingWizardService: TrainingWizardService,
    private _datasetService: DatasetService,
    private _jsonFileService: JsonFileService,
    private _router: Router
    ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.words = this._datasetService.getWords();
    this.sections = this._datasetService.getSections();
    this.setTrainingWizardService();
    this.startCamera();
    this.trainAndPredict();
  }

  ngOnDestroy() {
    this._handDetectionService.stopHandDetection();
    this._webcamService.stopCamera();
  }

  setTrainingWizardService() {
    this._trainingWizardService.setElements(this.canvasEl.nativeElement, this.videoEl.nativeElement);
  }

  startCamera = async () => {
    try {
      await this._webcamService.initializeCamera(this.videoEl.nativeElement);
      this._handDetectionService.startHandsDetection(this.videoEl.nativeElement, this.canvasEl.nativeElement).subscribe(handsDetected => {
        this._trainingWizardService.setHandsDetected(handsDetected);
      });
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  trainAndPredict = async () => {
    this.statusEl.nativeElement.textContent = 'Comenzando entrenamiento.';
    await this._trainingWizardService.train((epoch) => {
      let epochs_number = this._trainingWizardService.getEpochsNumber();
      this.statusEl.nativeElement.textContent = `Comenzando entrenamiento. (${epoch+1} / ${epochs_number})`;
    });
    this.statusEl.nativeElement.textContent = 'Entrenamiento finalizado.';

    this._trainingWizardService.startPrediction().subscribe((prediction) => {
      if (prediction) {
        this.statusEl.nativeElement.textContent = prediction.word_label;
      }
    });
  }

  onFinishClick = async () => {
    // this._router.navigate(['/training-upload-model']);
    console.log('guardando modelo...')
    this._trainingWizardService.save('downloads://model')
    console.log('modelo descargado...')
  }

}
