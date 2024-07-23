import { Injectable } from '@angular/core';
import { DatasetItem } from '../interfaces/dataset-item';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  private dataset: DatasetItem[] = [];

  constructor() {}

  addItem(label: string): void {
    let index = this.dataset.length;
    this.dataset.push({ index, label, images: [], webcamImages: [], imagesCount: 0 });
  }

  removeItem(index: number): void {
    this.dataset = this.dataset.filter(item => item.index !== index);
  }

  getItem(index: number): DatasetItem {
    return this.dataset.at(index);
  }

  getItems(): DatasetItem[] {
    return this.dataset;
  }

  clearItems(): void {
    this.dataset = [];
  }

  addImageItem(index: number, handDetectionImage: string, webcamImage: string): void {
    let item = this.dataset.at(index);
    item.images.push(handDetectionImage);
    item.webcamImages.push(webcamImage);
    item.imagesCount = item.images.length;
  }

}
