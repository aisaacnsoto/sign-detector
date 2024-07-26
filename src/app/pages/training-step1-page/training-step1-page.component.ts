import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetItem } from 'src/app/interfaces/dataset-item';
import { DatasetService } from 'src/app/services/dataset.service';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-training-step1-page',
  templateUrl: './training-step1-page.component.html',
  styleUrls: ['./training-step1-page.component.css']
})
export class TrainingStep1PageComponent implements OnInit, AfterViewInit {

  @ViewChild('newClassNameInput') newClassNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('divGif') divGif: ElementRef<HTMLDivElement>;
  dataset: DatasetItem[] = [];
  readyToTrain: boolean = false;

  constructor(
    private router: Router,
    private _datasetService: DatasetService
    ) {
    this.dataset = this._datasetService.getItems();
  }

  ngOnInit() {
    this.showTrainButton();
  }
  
  ngAfterViewInit() {
  }

  onAddClassClick = () => {
    const className = this.newClassNameInput.nativeElement.value;
    if (className) {
      this._datasetService.addItem(className);
      this.newClassNameInput.nativeElement.value = '';
      this.newClassNameInput.nativeElement.focus();
    }
  }

  onTrainClick = () => {
    this.router.navigate(['/training-step3']);
  }

  showTrainButton() {
    if (this.dataset.length > 1) {
      let errorCount = 0;
      for (let i = 0; i < this.dataset.length; i++) {
        if (this.dataset[i].imagesCount == 0) {
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

}
