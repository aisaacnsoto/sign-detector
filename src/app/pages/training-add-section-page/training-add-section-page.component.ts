import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
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

  constructor(
    private router: Router,
    private _datasetService: DatasetService
    ) {
    this.sections = this._datasetService.getSections();
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
  }

  onAddClick = () => {
    let sectionLabel = this.sectionLabelInput.nativeElement.value;
    if (sectionLabel) {
      this._datasetService.addSection(sectionLabel);
      this.sectionLabelInput.nativeElement.value = '';
      this.sectionLabelInput.nativeElement.focus();
    }
  }

  onBackClick = () => {
    this.router.navigate(['/training-step1']);
  }

}
