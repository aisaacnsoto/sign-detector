import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  
  constructor(
    private _primengConfig: PrimeNGConfig,
    private _router: Router
    ) {}

  async ngOnInit() {
    this._primengConfig.ripple = true;
    this._router.navigate(['/splash-screen']);
  }

}
