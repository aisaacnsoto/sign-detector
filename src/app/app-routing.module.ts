import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingStep1PageComponent } from './pages/training-step1-page/training-step1-page.component';
import { TrainingStep2PageComponent } from './pages/training-step2-page/training-step2-page.component';
import { TrainingStep3PageComponent } from './pages/training-step3-page/training-step3-page.component';
import { TrainingStep4PageComponent } from './pages/training-step4-page/training-step4-page.component';
import { TrainingAddSectionPageComponent } from './pages/training-add-section-page/training-add-section-page.component';
import { LearningSectionsPageComponent } from './pages/learning-sections-page/learning-sections-page.component';
import { LearningSectionOverviewPageComponent } from './pages/learning-section-overview-page/learning-section-overview-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PracticePageComponent } from './pages/practice-page/practice-page.component';
import { TrainingAddWordPageComponent } from './pages/training-add-word-page/training-add-word-page.component';
import { TrainingAddFramesPageComponent } from './pages/training-add-frames-page/training-add-frames-page.component';

const routes: Routes = [
  {
    path: 'training-add-word',
    component: TrainingAddWordPageComponent
  },
  {
    path: 'training-add-section',
    component: TrainingAddSectionPageComponent
  },
  {
    path: 'training-add-frames',
    component: TrainingAddFramesPageComponent
  },
  {
    path: 'training-step1',
    component: TrainingStep1PageComponent
  },
  {
    path: 'training-step2/:index',
    component: TrainingStep2PageComponent
  },
  {
    path: 'training-step3',
    component: TrainingStep3PageComponent
  },
  {
    path: 'training-step4',
    component: TrainingStep4PageComponent
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'learning/sections',
    component: LearningSectionsPageComponent
  },
  {
    path: 'learning/section/overview/:section_index',
    component: LearningSectionOverviewPageComponent
  },
  {
    path: 'practice',
    component: PracticePageComponent
  },
  { path: '', redirectTo: '/training-add-word', pathMatch: 'full' }, // Redirección predeterminada
  { path: '**', redirectTo: '/training-add-word' } // Ruta para manejar errores 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
