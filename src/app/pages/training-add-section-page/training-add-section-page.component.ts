import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-training-add-section-page',
  templateUrl: './training-add-section-page.component.html',
  styleUrls: ['./training-add-section-page.component.css']
})
export class TrainingAddSectionPageComponent implements OnInit, AfterViewInit {

  @ViewChild('sectionLabelInput') sectionLabelInput: ElementRef<HTMLInputElement>;
  @ViewChild('divGif') divGif: ElementRef<HTMLDivElement>;
  sections: DatasetSection[] = [];

  sectionForm = this._formBuilder.group({
    sectionLabel: ['', Validators.required],
  });

  constructor(
    private router: Router,
    private _datasetService: DatasetService,
    private _formBuilder: FormBuilder
    ) {
    this.sections = this._datasetService.getSections();
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
  }

  onAddClick = () => {
    if (this.sectionForm.valid) {
      if (this._datasetService.existsSection(this.sectionForm.value.sectionLabel)) {
        console.log('La sección ya ha sido agregada.');
        return;
      }
      this._datasetService.addSection(this.sectionForm.value.sectionLabel);
      this.sectionForm.reset();
      this.sectionLabelInput.nativeElement.focus();
    }
  }

  onBackClick = () => {
    this.router.navigate(['/training-add-word']);
  }

}
