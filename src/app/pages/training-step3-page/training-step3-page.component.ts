import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { SignClassificationService } from 'src/app/services/sign-classification.service';
import { WebcamService } from 'src/app/services/webcam.service';


@Component({
  selector: 'app-training-step3-page',
  templateUrl: './training-step3-page.component.html',
  styleUrls: ['./training-step3-page.component.css']
})
export class TrainingStep3PageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('finishButton') finishButton: ElementRef<HTMLButtonElement>;
  @ViewChild('status') statusEl: ElementRef;
  @ViewChild('prediction') predictionEl: ElementRef;

  dataset: DatasetItem[] = [];
  predicting: boolean;

  constructor(
    private webcamService: WebcamService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService,
    private datasetService: DatasetService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.dataset = this.datasetService.getItems();
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.addEvents();
    this.setSignClassificationService();
    this.startCamera();
    this.trainAndPredict();
  }

  ngOnDestroy() {
    this.handDetectionService.stopHandDetection();
    this.webcamService.stopCamera();
  }

  addEvents() {
    this.finishButton.nativeElement.addEventListener('click', this.onFinishClick);
  }

  setSignClassificationService() {
    this.signClassificationService.setElements(this.canvasEl.nativeElement, this.videoEl.nativeElement);
  }

  startCamera = async () => {
    try {
      await this.webcamService.initializeCamera(this.videoEl.nativeElement);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  trainAndPredict = async () => {
    this.statusEl.nativeElement.textContent = 'Comenzando entrenamiento.';
    await this.signClassificationService.train((epoch) => {
      let epochs_number = this.signClassificationService.getEpochsNumber();
      this.statusEl.nativeElement.textContent = `Comenzando entrenamiento. (${epoch+1} / ${epochs_number})`;
    });
    this.statusEl.nativeElement.textContent = 'Entrenamiento finalizado.';

    this.handDetectionService.startHandsDetection(this.videoEl.nativeElement, this.canvasEl.nativeElement);

    this.signClassificationService.startPrediction();

    this.signClassificationService.itemPrediction.subscribe((prediction) => {
      if (prediction) {
        this.predictionEl.nativeElement.textContent = prediction.label;
      }
    });
  }

  onFinishClick = () => {
    this.router.navigate(['/training-step4']);
  }

}
