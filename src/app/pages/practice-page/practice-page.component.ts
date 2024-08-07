import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { WebcamService } from 'src/app/services/common/webcam.service';

import { SignDetectorModelService } from 'src/app/services/sign-detector-model.service';

@Component({
  selector: 'app-practice-page',
  templateUrl: './practice-page.component.html',
  styleUrls: ['./practice-page.component.css']
})
export class PracticePageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('randomWord') randomWordEl: ElementRef;
  //@ViewChild('status') statusEl: ElementRef;

  randomWord: DatasetWord;
  randomIndexes: number[] = [];
  waitingForNextWord: boolean;
  practiceFinished: boolean;
  showSuccess: boolean;
  showFail: boolean;

  constructor(
    private webcamService: WebcamService,
    private handDetectionService: HandDetectionService,
    private signDetectorModelService: SignDetectorModelService,
    private datasetService: DatasetService,
    private router: Router
    ) {}

  ngOnInit() {
    
  }

  async ngAfterViewInit() {
    this.setRandomWord();
    await this.startCamera();
    this.setTrainingWizardService();
    this.startPractice();
  }

  ngOnDestroy() {
    this.handDetectionService.stopHandDetection();
    this.webcamService.stopCamera();
  }

  setTrainingWizardService() {
    this.signDetectorModelService.setElements(this.canvasEl.nativeElement);
  }

  startCamera = async () => {
    try {
      await this.webcamService.initializeCamera(this.videoEl.nativeElement);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  startPractice = async () => {
    this.handDetectionService.startHandsDetection(this.videoEl.nativeElement, this.canvasEl.nativeElement)
      .subscribe((handsDetected) => {
        this.signDetectorModelService.setHandsDetected(handsDetected);
      });

    this.signDetectorModelService.startPrediction().subscribe(this.onPrediction);
  }

  onPrediction = (word: DatasetWord) => {
    if (word && !this.waitingForNextWord && !this.practiceFinished) {
      if (word.word_index == this.randomWord.word_index) {
        this.randomWordEl.nativeElement.style.color = '#00ff00';
        this.showSuccess = true;
        this.showFail = false;
        this.generateNextWord();
      } else {
        this.randomWordEl.nativeElement.style.color = '#ff0000';
        this.showSuccess = false;
        this.showFail = true;
      }
    }
  }

  generateNextWord() {
    this.waitingForNextWord = true;
    setTimeout(() => {
      this.setRandomWord();
      this.waitingForNextWord = false;
    }, 2000);
  }

  onFinishClick = async () => {
    this.router.navigate(['/home']);
  }

  setRandomWord() {
    let datasetWordCount = this.datasetService.getWords().length;
    let randomIndex = Math.floor(Math.random() * datasetWordCount);
    if (!this.randomIndexes.includes(randomIndex)) {
      this.randomWord = this.datasetService.getWords().at(randomIndex);
      this.randomWordEl.nativeElement.style.color = 'white';
      this.showSuccess = false;
        this.showFail = false;
      this.randomWordEl.nativeElement.textContent = this.randomWord.word_label;
      this.randomIndexes.push(randomIndex);
    } else {
      if (this.randomIndexes.length < datasetWordCount) {
        this.setRandomWord();
      } else {
        this.practiceFinished = true;
        this.randomWordEl.nativeElement.textContent = '';
        this.randomWordEl.nativeElement.style.color = 'white';
        this.showSuccess = false;
        this.showFail = false;
        console.log('no hay más palabras en el dataset');
      }
    }
  }

}
