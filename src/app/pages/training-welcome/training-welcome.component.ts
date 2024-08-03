import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-welcome',
  templateUrl: './training-welcome.component.html',
  styleUrls: ['./training-welcome.component.css']
})
export class TrainingWelcomeComponent {

  constructor(private _router: Router) { }

  onStartClick = () => {
    this._router.navigate(['/training-add-word']);
  }

}
