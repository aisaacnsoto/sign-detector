import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-training-step1-page',
  templateUrl: './training-step1-page.component.html',
  styleUrls: ['./training-step1-page.component.css']
})
export class TrainingStep1PageComponent implements OnInit, AfterViewInit {

  @ViewChild('newClassNameInput') newClassNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('divGif') divGif: ElementRef<HTMLDivElement>;

  readyToTrain: boolean = false;
  words: DatasetWord[] = [];
  sections: DatasetSection[] = [];
  selectedSection: DatasetSection;

  constructor(
    private router: Router,
    private _datasetService: DatasetService
    ) {
    this.words = this._datasetService.getWords();
    this.sections = this._datasetService.getSections();
  }

  ngOnInit() {
    this.showTrainButton();
  }
  
  ngAfterViewInit() {
  }

  onAddClassClick = () => {
    let className = this.newClassNameInput.nativeElement.value;
    if (className && this.selectedSection) {
      this._datasetService.addWord(className, this.selectedSection.section_index);
      this.newClassNameInput.nativeElement.value = '';
      this.newClassNameInput.nativeElement.focus();

      this.showTrainButton();
    }
  }

  onAddSectionClick = () => {
    this.router.navigate(['/training-add-section']);
  }

  onTrainClick = () => {
    this.router.navigate(['/training-step3']);
  }

  showTrainButton() {
    if (this.words.length > 1) {
      let errorCount = 0;
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i].frames_count == 0) {
          errorCount++;
        }

      }
      if (errorCount == 0) {
        this.readyToTrain = true;
      } else {
        this.readyToTrain = false;
      }
    } else {
      this.readyToTrain = false;
    }
  }

  getSectionWords(section_index: number): DatasetWord[] {
    return this._datasetService.getSectionWords(section_index);
  }

}
