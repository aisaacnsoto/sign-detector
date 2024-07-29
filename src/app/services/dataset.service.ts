import { Injectable } from '@angular/core';
import { DatasetWord } from '../interfaces/dataset-word';
import { DatasetSection } from '../interfaces/dataset-section';
import { DatasetJson } from '../interfaces/dataset-json';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  private _words: DatasetWord[] = [];
  private _sections: DatasetSection[] = [];

  constructor() {
  }

  initializeDataset(datasetJson: DatasetJson) {
    this._sections = datasetJson.sections;
    this._words = datasetJson.words;
  }

  addWord(word_label: string, section_index: number): void {
    let word_index = 0;

    let last_word = this.getWords().at(this.getWords().length - 1);
    if (last_word) {
      word_index = last_word.word_index + 1;
    }
    this.getWords().push({ word_index, word_label, section_index, hand_landmark_frames: [], webcam_frames: [], frames_count: 0 });
    this.getSection(section_index).words_count = this.getSectionWords(section_index).length + 1;
  }

  removeWord(index: number): void {
    this._words = this.getWords().filter(word => word.word_index !== index);
  }

  getWord(index: number): DatasetWord {
    return this.getWords().find((value) => value.word_index == index);
  }

  getWords(): DatasetWord[] {
    return this._words;
  }

  clearWords(): void {
    this._words = [];
  }

  addWordFrames(index: number, handDetectionImage: string, webcamImage: string): void {
    let word = this.getWord(index);
    word.hand_landmark_frames.push(handDetectionImage);
    word.webcam_frames.push(webcamImage);
    word.frames_count = word.hand_landmark_frames.length;
  }

  addSection(label: string): void {
    let section_index = 0;

    let last_section = this.getSections().at(this.getSections().length - 1);
    if (last_section) {
      section_index = last_section.section_index + 1;
    }
    this.getSections().push({ section_index, section_label: label, words_count: 0 });
  }

  removeSection(index: number): void {
    this._sections = this.getSections().filter(section => section.section_index !== index);
  }

  getSection(index: number): DatasetSection {
    return this.getSections().find((value) => value.section_index == index);
  }

  getSections(): DatasetSection[] {
    return this._sections;
  }

  clearSections(): void {
    this._sections = [];
  }

  getSectionLabel(index: number): string {
    return this.getSection(index)?.section_label;
  }

  getSectionWords(section_index: number): DatasetWord[] {
    return this.getWords().filter(value => value.section_index == section_index);
  }

}
