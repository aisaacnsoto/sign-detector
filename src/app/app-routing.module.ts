import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingSummaryPageComponent } from './pages/training-summary-page/training-summary-page.component';
import { TrainingSummaryAddFramesPageComponent } from './pages/training-summary-add-frames-page/training-summary-add-frames-page.component';
import { TrainingTestPageComponent } from './pages/training-test-page/training-test-page.component';
import { TrainingAddSectionPageComponent } from './pages/training-add-section-page/training-add-section-page.component';
import { LearningSectionsPageComponent } from './pages/learning-sections-page/learning-sections-page.component';
import { LearningSectionOverviewPageComponent } from './pages/learning-section-overview-page/learning-section-overview-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PracticePageComponent } from './pages/practice-page/practice-page.component';
import { TrainingAddWordPageComponent } from './pages/training-add-word-page/training-add-word-page.component';
import { TrainingAddFramesPageComponent } from './pages/training-add-frames-page/training-add-frames-page.component';
import { SplashScreenPageComponent } from './pages/splash-screen-page/splash-screen-page.component';
import { TrainingWelcomeComponent } from './pages/training-welcome/training-welcome.component';
import { TrainingFinishComponent } from './pages/training-finish/training-finish.component';
import { TrainingUploadModelComponent } from './pages/training-upload-model/training-upload-model.component';

const routes: Routes = [
  {
    path: 'splash-screen',
    component: SplashScreenPageComponent
  },
  {
    path: 'training-welcome',
    component: TrainingWelcomeComponent
  },
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
    path: 'training-summary',
    component: TrainingSummaryPageComponent
  },
  {
    path: 'training-summary-add-frames/:index',
    component: TrainingSummaryAddFramesPageComponent
  },
  {
    path: 'training-test',
    component: TrainingTestPageComponent
  },
  {
    path: 'training-upload-model',
    component: TrainingUploadModelComponent
  },
  {
    path: 'training-finish',
    component: TrainingFinishComponent
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
  { path: '', redirectTo: '/splash-screen', pathMatch: 'full' }, // Redirección predeterminada
  { path: '**', redirectTo: '/splash-screen' } // Ruta para manejar errores 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
