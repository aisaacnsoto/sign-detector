import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TrainingStep1PageComponent } from './pages/training-step1-page/training-step1-page.component';
import { TrainingStep2PageComponent } from './pages/training-step2-page/training-step2-page.component';
import { TrainingStep3PageComponent } from './pages/training-step3-page/training-step3-page.component';
import { TrainingStep4PageComponent } from './pages/training-step4-page/training-step4-page.component';
import { TrainingAddSectionPageComponent } from './pages/training-add-section-page/training-add-section-page.component';
import { HandDetectionService } from './services/hand-detection.service';
import { WebcamService } from './services/webcam.service';
import { SignClassificationService } from './services/sign-classification.service';
import { DatasetService } from './services/dataset.service';
import { GifGeneratorService } from './services/gif-generator.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { LearningSectionOverviewPageComponent } from './pages/learning-section-overview-page/learning-section-overview-page.component';
import { LearningSectionsPageComponent } from './pages/learning-sections-page/learning-sections-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PracticePageComponent } from './pages/practice-page/practice-page.component';
import { SignDetectorModelService } from './services/sign-detector-model.service';
import { TrainingAddWordPageComponent } from './pages/training-add-word-page/training-add-word-page.component';
import { TrainingAddFramesPageComponent } from './pages/training-add-frames-page/training-add-frames-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TrainingStep1PageComponent,
    TrainingStep2PageComponent,
    TrainingStep3PageComponent,
    TrainingStep4PageComponent,
    TrainingAddSectionPageComponent,
    LearningSectionOverviewPageComponent,
    LearningSectionsPageComponent,
    HomePageComponent,
    PracticePageComponent,
    TrainingAddWordPageComponent,
    TrainingAddFramesPageComponent
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
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  providers: [
    WebcamService,
    SignClassificationService,
    HandDetectionService,
    DatasetService,
    GifGeneratorService,
    SignDetectorModelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
