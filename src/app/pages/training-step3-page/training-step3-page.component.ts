import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { DatasetService } from 'src/app/services/dataset.service';
import { GifGeneratorService } from 'src/app/services/gif-generator.service';
import { HandDetectionService } from 'src/app/services/hand-detection.service';
import { JsonFileService } from 'src/app/services/json-file.service';
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
  @ViewChild('status') statusEl: ElementRef;

  dataset: DatasetWord[] = [];
  predicting: boolean;

  constructor(
    private webcamService: WebcamService,
    private gifGeneratorService: GifGeneratorService,
    private handDetectionService: HandDetectionService,
    private signClassificationService: SignClassificationService,
    private datasetService: DatasetService,
    private jsonFileService: JsonFileService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataset = this.datasetService.getWords();
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
    await this.downloadDatasetJson();
    await this.signClassificationService.save('sign_detector');
    this.statusEl.nativeElement.textContent = '¡Modelo guardado correctamente!';
  }

  async generateGifs() {
    if (this.dataset.length > 0) {
      for (let index = 0; index < this.dataset.length; index++) {
        if (this.dataset[index].frames_count > 0) {
          let url = await this.gifGeneratorService.generateGif(this.dataset[index].webcam_frames);
          this.dataset[index].word_gif = url;
        }
      }
    }
  }

  async downloadDatasetJson() {
    let data: DatasetJson = {
      sections: [
        {
          section_index: 0,
          section_label: 'Sección 1',
          words_count: 0
        }
      ],
      words: this.dataset
    };
    await this.jsonFileService.generateJsonFile(data, 'dataset.json');
  }

}
