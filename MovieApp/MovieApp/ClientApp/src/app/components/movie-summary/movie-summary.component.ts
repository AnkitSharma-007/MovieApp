import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-movie-summary',
  templateUrl: './movie-summary.component.html',
  styleUrls: ['./movie-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCard, MatCardContent, MatButton, NgIf, MatProgressSpinner],
})
export class MovieSummaryComponent {
  geminiInput = '';
  movieSummary = '';

  @Input() set movieTitle(title: string) {
    this.geminiInput = `Give me a summary of the movie "${title}" in 300 words`;
    this.movieSummary = '';
  }
  showLoader = false;

  MODEL_NAME = 'gemini-1.0-pro';
  API_KEY = 'YOUR_API_KEY_HERE';
  generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  async fetchSummaryFromGemini() {
    const genAI = new GoogleGenerativeAI(this.API_KEY);
    const model = genAI.getGenerativeModel({
      model: this.MODEL_NAME,
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
    });

    try {
      this.showLoader = true;
      const parts = [{ text: this.geminiInput }];

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
      });

      this.movieSummary = result.response.text();
      this.showLoader = false;
      this.cdr.detectChanges();
    } catch (e) {
      console.log('An error Occurred: ', e);
    }
  }
}
