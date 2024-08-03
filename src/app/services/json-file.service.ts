import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatasetJson } from '../interfaces/dataset-json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JsonFileService {

  constructor(private http: HttpClient) { }

  async uploadJsonFile(url: string, body: any): Promise<any> {
    try {
      return await this.http.post<any>(url, body).toPromise();
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  async loadFromAssets(): Promise<DatasetJson> {
    let filePath = `assets/dataset/dataset.json`;
    try {
      return await this.http.get<DatasetJson>(filePath).toPromise();
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  async loadFromFirebase(): Promise<DatasetJson> {
    try {
      let path = environment.dataset.path;
      let url = `${environment.service_url}/getfile?path=${path}`;
      let response = await this.getDownloadURL(url);
      return this.http.get<DatasetJson>(response.download_url).toPromise();
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  async getDownloadURL(url_backend: string) {
    try {
      return this.http.get<any>(url_backend).toPromise();
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }
}
