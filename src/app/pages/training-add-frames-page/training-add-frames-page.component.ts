import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { SignClassificationService } from 'src/app/services/sign-classification.service';
import { WebcamService } from 'src/app/services/webcam.service';
import { Button } from 'primeng/button';

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
    private webcamService: WebcamService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService,
    private datasetService: DatasetService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
    this.datasetWords = this.datasetService.getWords();
    this.currentIndex = 0;
    this.currentWord = this.datasetWords.at(this.currentIndex);
  }

  ngAfterViewInit() {
    this.startCamera();

    this.signClassificationService.setElements(this.canvasEl.nativeElement, this.videoEl.nativeElement);
  }

  ngOnDestroy() {
    this.handDetectionService.stopHandDetection();
    this.webcamService.stopCamera();
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
      this.signClassificationService.startDataCollection(this.currentWord.word_index);
      this.collectBtn.label = 'Detener';
    } else {
      this.signClassificationService.stopDataCollection();
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
    this.router.navigate(['/training-step1']);
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
