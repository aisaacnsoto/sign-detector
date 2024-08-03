import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { TrainingWizardService } from 'src/app/services/training-wizard.service';
import { WebcamService } from 'src/app/services/common/webcam.service';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-training-summary-add-frames-page',
  templateUrl: './training-summary-add-frames-page.component.html',
  styleUrls: ['./training-summary-add-frames-page.component.css']
})
export class TrainingSummaryAddFramesPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  collectBtn = { label: 'Iniciar' };
  backBtn = { label: 'Regresar', visible: true };

  item: DatasetWord;
  collectingData: boolean;

  constructor(
    private _webcamService: WebcamService,
    private _handDetectionService: HandDetectionService,
    private _trainingWizardService: TrainingWizardService,
    private _datasetService: DatasetService,
    private _route: ActivatedRoute,
    private _router: Router
    ) {}

  ngOnInit() {
    this.getParamsFromURL();
  }

  ngAfterViewInit() {
    this.startCamera();

    this._trainingWizardService.setElements(this.canvasEl.nativeElement, this.videoEl.nativeElement);
  }

  getParamsFromURL() {
    this._route.paramMap.subscribe(params => {
      let index = parseInt(params.get('index'));
      this.item = this._datasetService.getWord(index);
    });
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
      this._trainingWizardService.startDataCollection(this.item.word_index);
      this.collectBtn.label = 'Detener';
      this.backBtn.visible = false;
    } else {
      this._trainingWizardService.stopDataCollection();
      this.collectBtn.label = 'Iniciar';
      this.backBtn.label = 'Listo';
      this.backBtn.visible = true;
    }
  }

  onBackClick = () => {
    this._router.navigate(['/training-summary']);
  }

}
