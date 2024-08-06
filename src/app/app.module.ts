import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TrainingSummaryPageComponent } from './pages/training-summary-page/training-summary-page.component';
import { TrainingSummaryAddFramesPageComponent } from './pages/training-summary-add-frames-page/training-summary-add-frames-page.component';
import { TrainingTestPageComponent } from './pages/training-test-page/training-test-page.component';
import { TrainingAddSectionPageComponent } from './pages/training-add-section-page/training-add-section-page.component';
import { HandDetectionService } from './services/hand-detection.service';
import { WebcamService } from './services/common/webcam.service';
import { TrainingWizardService } from './services/training-wizard.service';
import { DatasetService } from './services/dataset.service';
import { GifGeneratorService } from './services/common/gif-generator.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { LearningSectionOverviewPageComponent } from './pages/learning-section-overview-page/learning-section-overview-page.component';
import { LearningSectionsPageComponent } from './pages/learning-sections-page/learning-sections-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PracticePageComponent } from './pages/practice-page/practice-page.component';
import { SignDetectorModelService } from './services/sign-detector-model.service';
import { TrainingAddWordPageComponent } from './pages/training-add-word-page/training-add-word-page.component';
import { TrainingAddFramesPageComponent } from './pages/training-add-frames-page/training-add-frames-page.component';
import { SplashScreenPageComponent } from './pages/splash-screen-page/splash-screen-page.component';
import { TrainingWelcomeComponent } from './pages/training-welcome/training-welcome.component';
import { TrainingFinishComponent } from './pages/training-finish/training-finish.component';

@NgModule({
  declarations: [
    AppComponent,
    TrainingSummaryPageComponent,
    TrainingSummaryAddFramesPageComponent,
    TrainingTestPageComponent,
    TrainingAddSectionPageComponent,
    LearningSectionOverviewPageComponent,
    LearningSectionsPageComponent,
    HomePageComponent,
    PracticePageComponent,
    TrainingAddWordPageComponent,
    TrainingAddFramesPageComponent,
    SplashScreenPageComponent,
    TrainingWelcomeComponent,
    TrainingFinishComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    RippleModule,
    ReactiveFormsModule,
  ],
  providers: [
    WebcamService,
    TrainingWizardService,
    HandDetectionService,
    DatasetService,
    GifGeneratorService,
    SignDetectorModelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
