import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from 'src/app/services/exam.service';

@Component({
  selector: 'app-exam-result-page',
  templateUrl: './exam-result-page.component.html',
  styleUrls: ['./exam-result-page.component.css']
})
export class ExamResultPageComponent {
  score: number = 0;

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.score = this.examService.getScore();
  }

  onReinicioClick = async () => {
    this.router.navigate(['/exam']);
  }

  onPrincipalClick = async () => {
    this.router.navigate(['/home']);
  }

}
