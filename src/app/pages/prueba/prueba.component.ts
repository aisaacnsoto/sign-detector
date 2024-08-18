import { Component, OnInit } from '@angular/core';
import { DatasetJson } from 'src/app/interfaces/dataset-json';
import { GifGeneratorService } from 'src/app/services/common/gif-generator.service';
import { MobilenetService } from 'src/app/services/common/mobilenet.service';
import { TrainModelService } from 'src/app/services/common/train-model.service';
import { JsonFileService } from 'src/app/services/json-file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

  private dataset: DatasetJson;
  private wordIndex = 0;
  private trainingDataInputs = [];
  private trainingDataOutputs = [];
  private EPOCHS_NUMBER = 10;

  constructor(
    private _gifGeneratorService: GifGeneratorService,
    private _jsonFileService: JsonFileService,
    private _mobilenetService: MobilenetService,
    private _trainModelService: TrainModelService
  ) { }

  async ngOnInit() {
      console.log('Recuperando datasets...');
      this.dataset = await this._jsonFileService.loadFromAssets();
      console.log(this.dataset);

      /*for (let i = 0; i < this.dataset.words.length; i++) {
        let word = this.dataset.words[i];
        // subiendo gif a firebase
        console.log('subiendo palabra:', word.word_label)
        let url = `${environment.service_url}/upload_gif`;
        let nombreArchivo = `gifs/${new Date().getTime()}.gif`;
        let body = {
          path: `${nombreArchivo}`,
          image: word.word_gif
        };
        let response = await this._jsonFileService.uploadJsonFile(url, body);

        word.word_gif = response.url;
        console.log('subida exitosa');
      }



      // Convertir el arreglo a JSON
      const jsonBlob = new Blob([JSON.stringify(this.dataset, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);

      // Crear un enlace temporal y simular un clic para descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = 'datasetconurls.json';
      document.body.appendChild(a);
      a.click();

      // Limpiar el enlace temporal
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      //this.startDataCollection();*/
  }


  startDataCollection() {
    this._dataCollectionLoop();
  }

  private _dataCollectionLoop = () => {
    this.addFrames();
  }

  async addFrames() {
    if (this.wordIndex < this.dataset.words.length) {
      let word = this.dataset.words.find(word => word.word_index == this.wordIndex);
      for (let index = 0; index < word.hand_landmark_frames.length; index++) {
        let base64String = word.hand_landmark_frames[index];
        let imageFeatures = await this.base64ToFeatures(base64String);
        this.trainingDataInputs.push(imageFeatures);
        this.trainingDataOutputs.push(this.wordIndex);

      }
      this.wordIndex++;
      console.log(this.trainingDataInputs, this.trainingDataOutputs);
      window.requestAnimationFrame(this._dataCollectionLoop);
    } else {
      await this.train((epoch) => {
        console.log(`Comenzando entrenamiento. (${epoch+1} / ${this.EPOCHS_NUMBER})`);
      });
      console.log('Generando imágenes gif...');
      await this.generateGifs();
      console.log('guardando dataset consolidado...');
      await this.descargarDatasetFinal();
      console.log('guardando modelo entrenado...');
      // await this.uploadModel();
      await this.save('downloads://my-model-entrenado');
      console.log('Proceso finalizado!!');
    }
  }

  base64ToFeatures(base64String) {
    return new Promise((resolve, reject) => {
      // Crear un nuevo elemento <img>
      const img = new Image();

      // Configurar el src de la imagen como el string Base64
      img.src = base64String;

      // Esperar a que la imagen se cargue
      img.onload = () => {
        try {
          // Convertir la imagen en un tensor
          const tensor = this._mobilenetService.calculateFeaturesOnCurrentFrame(img);
          resolve(tensor);
        } catch (error) {
          reject(error);
        }
      };

      // Manejar errores de carga de imagen
      img.onerror = (error) => reject(error);
    });
  }

  async train(onEpochBegin) {
    await this._trainModelService.train(
      this.trainingDataInputs,
      this.trainingDataOutputs,
      this.dataset.words.length,
      this.EPOCHS_NUMBER,
      onEpochBegin
    );
  }

  async save(url: string) {
    return await this._trainModelService.save(url);
  }

  async generateGifs() {
    if (this.dataset.words.length > 0) {
      for (let index = 0; index < this.dataset.words.length; index++) {
        if (this.dataset.words[index].frames_count > 0) {
          let url = await this._gifGeneratorService.generateGif(this.dataset.words[index].webcam_frames);
          this.dataset.words[index].word_gif = url;
          this.dataset.words[index].webcam_frames = undefined;
          this.dataset.words[index].hand_landmark_frames = undefined;
        }
      }
    }
  }

  async descargarDatasetFinal() {
    let data: DatasetJson = {
      sections: this.dataset.sections,
      words: this.dataset.words
    };
    /*let url = `${environment.service_url}/upload_dataset`;
    let nombreArchivo = `dataset.json`;
    let body = {
      path: `${nombreArchivo}`,
      json: JSON.stringify(data)
    };
    let response = await this._jsonFileService.uploadJsonFile(url, body);
    console.log(response);*/
    // Convertir el arreglo a JSON
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);

    // Crear un enlace temporal y simular un clic para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datasetfinal.json';
    document.body.appendChild(a);
    a.click();

    // Limpiar el enlace temporal
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async uploadModel() {
    this._trainModelService.save(`${environment.service_url}/upload_model`);
  }

}
