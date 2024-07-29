import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetSection } from 'src/app/interfaces/dataset-section';
import { DatasetWord } from 'src/app/interfaces/dataset-word';
import { DatasetService } from 'src/app/services/dataset.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-learning-section-overview-page',
  templateUrl: './learning-section-overview-page.component.html',
  styleUrls: ['./learning-section-overview-page.component.css']
})
export class LearningSectionOverviewPageComponent implements OnInit {

  section: DatasetSection;
  words: DatasetWord[];

  constructor(
    private _datasetService: DatasetService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}
  
  ngOnInit() {
    this.getParamsFromURL();
  }

  getParamsFromURL() {
    this._route.paramMap.subscribe(params => {
      let index = parseInt(params.get('section_index'));
      this.section = this._datasetService.getSection(index);
      this.words = this._datasetService.getSectionWords(index);
    });
  }

}
