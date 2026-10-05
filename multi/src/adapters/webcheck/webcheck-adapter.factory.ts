import { WebcheckAdapter } from './webcheck.adapter';
import { WebcheckAdapterEnglish } from './webcheck-adapter-english';
import { WebcheckAdapterGerman } from './webcheck-adapter-german';

export enum WebcheckLanguage { ENGLISH = 'en', GERMAN = 'de' }

export class WebcheckAdapterFactory {
  private readonly englishAdapter = new WebcheckAdapterEnglish();
  private readonly germanAdapter = new WebcheckAdapterGerman();

  getAdapter(language: WebcheckLanguage): WebcheckAdapter<any> {
    switch (language) {
      case WebcheckLanguage.ENGLISH: return this.englishAdapter;
      case WebcheckLanguage.GERMAN: return this.germanAdapter;
      default: throw new Error(`Unsupported WebCheck language: ${language}`);
    }
  }
}
