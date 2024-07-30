import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-training-add-word-page',
  templateUrl: './training-add-word-page.component.html',
  styleUrls: ['./training-add-word-page.component.css']
})
export class TrainingAddWordPageComponent implements OnInit, AfterViewInit {

  @ViewChild('newClassNameInput') newClassNameInput: ElementRef<HTMLInputElement>;

  readyToContinue: boolean = false;
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
    this.showContinueButton();
  }
  
  ngAfterViewInit() {
  }

  onAddClassClick = () => {
    let className = this.newClassNameInput.nativeElement.value;
    if (className && this.selectedSection) {
      this._datasetService.addWord(className, this.selectedSection.section_index);
      this.newClassNameInput.nativeElement.value = '';
      this.newClassNameInput.nativeElement.focus();

      this.showContinueButton();
    }
  }

  onAddSectionClick = () => {
    this.router.navigate(['/training-add-section']);
  }

  onContinueClick = () => {
    this.router.navigate(['/training-add-frames']);
  }

  showContinueButton() {
    if (this.words.length > 1) {
      this.readyToContinue = true;
    } else {
      this.readyToContinue = false;
    }
  }

  getSectionWords(section_index: number): DatasetWord[] {
    return this._datasetService.getSectionWords(section_index);
  }

}
