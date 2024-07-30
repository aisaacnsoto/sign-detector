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

  async uploadJsonFile(url: string, body: any): Promise<any> {
    try {
      const response = await this.http.post<any>(url, body).toPromise();
      return response;
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
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
      const url = `http://localhost:3000/getfile?path=dataset_v1/dataset/dataset.json`;
      let response = await this.getDownloadURL(url);
      const dataset = this.http.get<DatasetJson>(response.download_url).toPromise();
      return dataset;
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  async getDownloadURL(url_backend: string) {
    try {
      const response = this.http.get<any>(url_backend).toPromise();
      return response;
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }
}
