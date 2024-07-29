import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { DatasetService } from 'src/app/services/dataset.service';
import { GifGeneratorService } from 'src/app/services/gif-generator.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { JsonFileService } from 'src/app/services/json-file.service';
import { SignClassificationService } from 'src/app/services/sign-classification.service';
import { WebcamService } from 'src/app/services/webcam.service';

import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
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
  @ViewChild('status') statusEl: ElementRef;

  randomWord: DatasetWord;
  randomIndexes: number[] = [];
  waitingForNextWord: boolean;
  practiceFinished: boolean;

  constructor(
    private webcamService: WebcamService,
    private gifGeneratorService: GifGeneratorService,
    private handDetectionService: HandDetectionService,
    //private signClassificationService: SignClassificationService,
    private signDetectorModelService: SignDetectorModelService,
    private datasetService: DatasetService,
    private jsonFileService: JsonFileService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage
    ) {}

  ngOnInit() {
    
  }

  async ngAfterViewInit() {
    this.setRandomWord();
    await this.startCamera();
    await this.loadModel();
    this.setSignClassificationService();
    this.startPractice();
  }

  async loadModel() {
    
    await this.signDetectorModelService.loadMobileNetFeatureModel();
    const filePath = `http://localhost:3000/getfile?path=model.json`;
    let response = await this.jsonFileService.getDownloadURL(filePath);
    await this.signDetectorModelService.loadTrainedModelFromURL(response.download_url);
    
  }

  ngOnDestroy() {
    this.handDetectionService.stopHandDetection();
    this.webcamService.stopCamera();
  }

  setSignClassificationService() {
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
    this.handDetectionService.startHandsDetection(this.videoEl.nativeElement, this.canvasEl.nativeElement);

    this.handDetectionService.handsDetected.subscribe((handsDetected) => {
      this.signDetectorModelService.setHandsDetected(handsDetected);
    });
    
    this.signDetectorModelService.startPrediction()
    
    this.signDetectorModelService.itemPrediction.subscribe(this.onPrediction);
  }

  onPrediction = (word: DatasetWord) => {
    if (word && !this.waitingForNextWord && !this.practiceFinished) {
      if (word.word_index == this.randomWord.word_index) {
        this.statusEl.nativeElement.textContent = 'Correcto :D';
        this.generateNextWord();
      } else {
        this.statusEl.nativeElement.textContent = 'Incorrecto :(';
      }
    }
  }

  generateNextWord() {
    this.waitingForNextWord = true;
    setTimeout(() => {
      this.setRandomWord();
      this.statusEl.nativeElement.textContent = '';
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
      this.randomWordEl.nativeElement.textContent = this.randomWord.word_label;
      this.randomIndexes.push(randomIndex);
    } else {
      if (this.randomIndexes.length < datasetWordCount) {
        this.setRandomWord();
      } else {
        this.practiceFinished = true;
        this.randomWordEl.nativeElement.textContent = '';
        this.statusEl.nativeElement.textContent = '';
        console.log('no hay más palabras en el dataset');
      }
    }
  }

}
