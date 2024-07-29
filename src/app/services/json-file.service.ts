import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DatasetJson } from '../interfaces/dataset-json';

@Injectable({
  providedIn: 'root'
})
export class JsonFileService {

  private path = 'assets/dataset';

  constructor(private http: HttpClient) { }

  async generateJsonFile(data: DatasetJson, fileName: string): Promise<Blob> {
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    //const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    //saveAs(jsonBlob, fileName);
  }

  async loadArrayFromJson(fileName: string): Promise<DatasetJson> {
    const filePath = `${this.path}/${fileName}`;
    try {
      const response = await this.http.get<DatasetJson>(filePath).toPromise();
      return response;
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  async loadFromFirebase() {
    try {
      let url = await this.getDownloadURL();
      const response = this.http.get<DatasetJson>(url.download_url).toPromise();
      return response;
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  async getDownloadURL() {
    const filePath = `http://localhost:3000/getfile?path=dataset_v1/dataset/dataset.json`;
    try {
      const response = this.http.get<any>(filePath).toPromise();
      return response;
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }
}
