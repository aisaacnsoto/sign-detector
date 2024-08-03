import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { TrainingWizardService } from 'src/app/services/training-wizard.service';
import { WebcamService } from 'src/app/services/common/webcam.service';

@Component({
  selector: 'app-training-add-frames-page',
  templateUrl: './training-add-frames-page.component.html',
  styleUrls: ['./training-add-frames-page.component.css']
})
export class TrainingAddFramesPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  collectBtn = { label: 'Iniciar' };
  nextBtn = { label: 'Siguiente', visible: false };

  datasetWords: DatasetWord[];
  currentWord: DatasetWord;
  currentIndex: number;
  collectingData: boolean;
  readyToContinue: boolean;

  constructor(
    private _webcamService: WebcamService,
    private _handDetectionService: HandDetectionService,
    private _trainingWizardService: TrainingWizardService,
    private _datasetService: DatasetService,
    private _router: Router
    ) {}

  ngOnInit() {
    this.datasetWords = this._datasetService.getWords();
    this.currentIndex = 0;
    this.currentWord = this.datasetWords.at(this.currentIndex);
  }

  ngAfterViewInit() {
    this.startCamera();

    this._trainingWizardService.setElements(this.canvasEl.nativeElement, this.videoEl.nativeElement);
  }

  ngOnDestroy() {
    this._handDetectionService.stopHandDetection();
    this._webcamService.stopCamera();
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

  onDataCollectClick = () => {
    this.collectingData = !this.collectingData;

    if (this.collectingData) {
      this._trainingWizardService.startDataCollection(this.currentWord.word_index);
      this.collectBtn.label = 'Detener';
    } else {
      this._trainingWizardService.stopDataCollection();
      this.collectBtn.label = 'Iniciar';
    }
    this.showContinueButton();
    this.showNextButton();
  }

  onNextClick = () => {
    if (this.currentIndex != this.datasetWords.length - 1) {
      this.currentIndex++;
      this.currentWord = this.datasetWords.at(this.currentIndex);
      this.showNextButton();
    }
  }

  onContinueClick = () => {
    this._router.navigate(['/training-summary']);
  }

  showNextButton() {
    if (!this.collectingData && this.currentWord.frames_count > 1 && this.currentIndex != this.datasetWords.length - 1) {
      this.nextBtn.visible = true;
    } else {
      this.nextBtn.visible = false;
    }
  }

  showContinueButton() {
    let errors = 0;
    this.datasetWords.forEach(word => {
      if (word.frames_count == 0) {
        errors++;
      }
    });
    if (!this.collectingData && errors == 0) {
      this.readyToContinue = true;
    } else {
      this.readyToContinue = false;
    }
  }

}
