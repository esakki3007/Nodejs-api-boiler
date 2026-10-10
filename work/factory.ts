export class WebcheckAdapterFactory {
  getAdapter(
    group: ScreeningGroup,
    language: string,
  ): WebcheckAdapter<any> {
    const normalizedLanguage = language.toLowerCase();

    if (group === 'MR') {
      if (normalizedLanguage !== 'en') {
        throw new Error('MR supports English only');
      }

      return new WebcheckAdapterEnglish();
    }

    if (group === 'ERGO') {
      switch (normalizedLanguage) {
        case 'en':
          return new WebcheckAdapterEnglish();

        case 'de':
          return new WebcheckAdapterGerman();

        default:
          throw new Error(
            `Unsupported ERGO language: ${language}`,
          );
      }
    }

    throw new Error(`Unsupported group: ${group}`);
  }
}