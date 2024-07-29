import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-learning-sections-page',
  templateUrl: './learning-sections-page.component.html',
  styleUrls: ['./learning-sections-page.component.css']
})
export class LearningSectionsPageComponent implements OnInit {

  sections: DatasetSection[];

  constructor(
    private _datasetService: DatasetService,
    private _router: Router
    ) { }

  ngOnInit() {
    this.getSections();
  }

  getSections() {
    this.sections = this._datasetService.getSections();
  }

  onGoClick = (section_index: number) => {
    this._router.navigate(['/learning/section/overview/'+section_index]);
  }

  onBackClick = () => {
    this._router.navigate(['/home']);
  }
}
