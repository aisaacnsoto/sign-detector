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

  async getJSONs() {
    try {
      let service_url = `${environment.service_url}/list-docs`;
      let response = await this.http.get<any>(service_url).toPromise();
      let datasets = [];
      for (let index = 0; index < response.urls.length; index++) {
        const url = response.urls[index];
        let data = await this.http.get<DatasetJson>(url).toPromise();
        datasets.push(data);
      }
      return this.reasignIDS(datasets);
    } catch (error) {
      console.error('Error cargando archivo JSON:', error);
      throw error;
    }
  }

  reasignIDS(datasets: any[]) {
    let sectionIndex = 0;
    let wordIndex = 0;
    let newDataSet: DatasetJson = {
      sections: [],
      words: []
    };
    let asdf = newDataSet.words.filter(word => word.section_index == 1)

    datasets.forEach(dataset => {
      let sections = dataset.sections;
      sections.forEach(section => {
        let index_antiguo = section.section_index;
        section.section_index = sectionIndex;

        let wordsToChangeIndex = dataset.words.filter(word => word.section_index == index_antiguo)
        wordsToChangeIndex.forEach(word => {
          word.section_index = section.section_index;
        });
        sectionIndex++;
        newDataSet.sections.push(section);
      });

      let words = dataset.words;
      words.forEach(word => {
        word.word_index = wordIndex;

        wordIndex++;

        newDataSet.words.push(word);
      });
    });
    return newDataSet;
  }

}
