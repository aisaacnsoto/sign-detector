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
import { DatasetSection } from 'src/app/interfaces/dataset-section';

@Component({
  selector: 'app-training-step3-page',
  templateUrl: './training-step3-page.component.html',
  styleUrls: ['./training-step3-page.component.css']
})
export class TrainingStep3PageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('status') statusEl: ElementRef;

  words: DatasetWord[] = [];
  sections: DatasetSection[] = [];
  predicting: boolean;
  datasetFolderName = environment.dataset.directory;

  constructor(
    private webcamService: WebcamService,
    private gifGeneratorService: GifGeneratorService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService,
    private datasetService: DatasetService,
    private jsonFileService: JsonFileService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage
    ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.words = this.datasetService.getWords();
    this.sections = this.datasetService.getSections();
    this.setSignClassificationService();
    this.startCamera();
    this.trainAndPredict();
  }

  ngOnDestroy() {
    this.handDetectionService.stopHandDetection();
    this.webcamService.stopCamera();
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
        this.statusEl.nativeElement.textContent = prediction.word_label;
      }
    });
  }

  onFinishClick = async () => {
    //this.router.navigate(['/training-step4']);
    this.statusEl.nativeElement.textContent = 'Guardando modelo...';
    await this.generateGifs();
    await this.uploadDatasetJson();
    await this.uploadModel();
    this.statusEl.nativeElement.textContent = '¡Modelo guardado correctamente!';
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
  }

  async generateGifs() {
    if (this.words.length > 0) {
      for (let index = 0; index < this.words.length; index++) {
        if (this.words[index].frames_count > 0) {
          let url = await this.gifGeneratorService.generateGif(this.words[index].webcam_frames);
          this.words[index].word_gif = url;
        }
      }
    }
  }

  async uploadDatasetJson() {
    let data: DatasetJson = {
      sections: this.sections,
      words: this.words
    };
    let jsonFile = await this.jsonFileService.generateJsonFile(data);

    let storageRef = ref(this.storage, `${this.datasetFolderName}/dataset/dataset.json`);
    await uploadBytes(storageRef, jsonFile);
  }

  async uploadModel() {
    // let path = `${this.datasetFolderName}/model/model.json`
    // let url = storageRef.fullPath;
    // console.log('storageRef.fullPath',storageRef);
    this.signClassificationService.save("http://localhost:3000/uploadmodel");
  }

}
