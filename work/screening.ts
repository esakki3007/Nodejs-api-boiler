export type ScreeningGroup = 'MR' | 'ERGO';

export type ScreeningType = 'WEBCHECK' | 'PAYMENT';

export type ScreeningLanguage = 'en' | 'de';

export interface ScreeningBatch {
  group: ScreeningGroup;
  screeningType: ScreeningType;
  language: string;
  orgUnit: string;
  Embargo: boolean;
  PEP: boolean;
}

export class ScreeningOrchestrator {
  constructor(
    private readonly webcheckServiceFactory: WebcheckScreeningServiceFactory,
    private readonly paymentServiceFactory: PaymentScreeningServiceFactory,
    private readonly webcheckAdapterFactory: WebcheckAdapterFactory,
    private readonly paymentAdapterFactory: PaymentAdapterFactory,
  ) {}

  async screen(batch: ScreeningBatch, record: Record<string, unknown>) {
    const language = batch.language.toLowerCase();

    if (batch.group === 'MR' && language !== 'en') {
      throw new Error('MR supports English only');
    }

    const adapter =
      batch.screeningType === 'WEBCHECK'
        ? this.webcheckAdapterFactory.getAdapter(
            batch.group,
            language,
          )
        : this.paymentAdapterFactory.getAdapter(
            batch.group,
            language,
          );

    const service =
      batch.screeningType === 'WEBCHECK'
        ? this.webcheckServiceFactory.getService(
            batch.group,
            language,
          )
        : this.paymentServiceFactory.getService(
            batch.group,
            language,
          );

    const lowerCaseRecord = Object.fromEntries(
      Object.entries(record).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ]),
    );

    const request = {
      ...lowerCaseRecord,
      orgUnitId: batch.orgUnit,
      embargo: batch.Embargo,
      pep: batch.PEP,
    };

    const canonicalRequest = await adapter.toCanonical(request);

    const canonicalResponse = await service.screen(
      canonicalRequest,
    );

    return adapter.toResponse(canonicalResponse);
  }
}