import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-training-add-word-page',
  templateUrl: './training-add-word-page.component.html',
  styleUrls: ['./training-add-word-page.component.css']
})
export class TrainingAddWordPageComponent implements OnInit, AfterViewInit {

  @ViewChild('wordLabelInput') wordLabelInput: ElementRef<HTMLInputElement>;

  readyToContinue: boolean = false;
  words: DatasetWord[] = [];
  sections: DatasetSection[] = [];
  selectedSection: DatasetSection = null;

  wordForm = this._formBuilder.group({
    section: [this.selectedSection, Validators.required],
    wordLabel: ['', Validators.required]
  });

  constructor(
    private _router: Router,
    private _datasetService: DatasetService,
    private _formBuilder: FormBuilder

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
    if (this.wordForm.valid) {
      if (this._datasetService.existsWord(this.wordForm.value.wordLabel.trim())) {
        console.log('La palabra ya ha sido agregada.');
        return;
      }
      this.selectedSection = this.wordForm.value.section;
      this._datasetService.addWord(this.wordForm.value.wordLabel.trim(), this.selectedSection.section_index);
      this.wordForm.reset();
      this.wordForm.patchValue({section: this.selectedSection, wordLabel: ''});
      this.wordLabelInput.nativeElement.focus();

      this.showContinueButton();
    }
  }

  onAddSectionClick = () => {
    this._router.navigate(['/training-add-section']);
  }

  onContinueClick = () => {
    this._router.navigate(['/training-add-frames']);
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
