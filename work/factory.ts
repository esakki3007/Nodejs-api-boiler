export class WebcheckAdapterFactory {
  getAdapter(group: ScreeningGroup, language: Language) {
    if (group === 'MR') {
      return new WebcheckAdapterEnglish();
    }

    switch (language) {
      case 'en':
        return new WebcheckAdapterEnglish();

      case 'de':
        return new WebcheckAdapterGerman();

      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
  
}