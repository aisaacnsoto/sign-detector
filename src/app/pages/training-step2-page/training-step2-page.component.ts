import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { SignClassificationService } from 'src/app/services/sign-classification.service';
import { WebcamService } from 'src/app/services/webcam.service';


@Component({
  selector: 'app-training-step2-page',
  templateUrl: './training-step2-page.component.html',
  styleUrls: ['./training-step2-page.component.css']
})
export class TrainingStep2PageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('dataCollector') dataCollectorEl: ElementRef<HTMLButtonElement>;
  @ViewChild('back') backEl: ElementRef<HTMLButtonElement>;

  item: DatasetItem;
  collectingData: boolean;

  constructor(
    private webcamService: WebcamService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService,
    private datasetService: DatasetService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
    this.getParamsFromURL();
  }

  ngAfterViewInit() {
    this.addEvents();
    this.startCamera();

    this.signClassificationService.setElements(this.canvasEl.nativeElement, this.videoEl.nativeElement);
  }

  getParamsFromURL() {
    this.route.paramMap.subscribe(params => {
      let index = parseInt(params.get('index'));
      this.item = this.datasetService.getItem(index);
    });
  }

  ngOnDestroy() {
    this.handDetectionService.stopHandDetection();
    this.webcamService.stopCamera();
  }

  addEvents() {
    this.dataCollectorEl.nativeElement.addEventListener('click', this.onDataCollectClick);
    this.backEl.nativeElement.addEventListener('click', this.onBackClick);
  }

  startCamera = async () => {
    try {
      await this.webcamService.initializeCamera(this.videoEl.nativeElement);
      this.handDetectionService.startHandsDetection(this.videoEl.nativeElement, this.canvasEl.nativeElement);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  onDataCollectClick = () => {
    this.collectingData = !this.collectingData;

    if (this.collectingData) {
      this.signClassificationService.startDataCollection(this.item.index);
      this.dataCollectorEl.nativeElement.textContent = 'Detener';
      this.backEl.nativeElement.style.display = 'none';
    } else {
      this.signClassificationService.stopDataCollection();
      this.dataCollectorEl.nativeElement.textContent = 'Iniciar';
      this.backEl.nativeElement.style.display = 'block';
      this.backEl.nativeElement.textContent = 'Listo';
    }
  }

  onBackClick = () => {
    this.router.navigate(['/training-step1']);
  }

  /*trainAndPredict = async () => {
    await this.signClassificationService.train();
    this.signClassificationService.predict();
  }

  reset = () => {
    this.signClassificationService.reset();
  }

  download = async () => {
    let url = await this.signClassificationService.save('mi-modelo-entrenado');
    console.log('modelo descargado en: '+url);
  }*/

}
