import { WebcheckAdapterFactory } from './webcheck/adapters/webcheck-adapter.factory';
import { PaymentAdapterFactory } from './payment/adapters/payment-adapter.factory';

import { WebcheckNetRevealService } from './webcheck/webcheck-netreveal.service';
import { PaymentNetRevealService } from './payment/payment-netreveal.service';

type ScreeningGroup = 'MR' | 'ERGO';
type ScreeningType = 'WEBCHECK' | 'PAYMENT';
type Language = 'en' | 'de';

interface ScreeningContext {
  group: ScreeningGroup;
  screeningType: ScreeningType;
  language: string;
}

export class ScreeningOrchestrator {
  constructor(
    private readonly webcheckAdapterFactory: WebcheckAdapterFactory,
    private readonly paymentAdapterFactory: PaymentAdapterFactory,
    private readonly webcheckNetRevealService: WebcheckNetRevealService,
    private readonly paymentNetRevealService: PaymentNetRevealService,
  ) {}

  async screen(
    context: ScreeningContext,
    record: Record<string, unknown>,
  ) {
    const group = context.group.toUpperCase();
    const language = context.language.toLowerCase();

    // 1. Validate the group and language.
    if (group !== 'MR' && group !== 'ERGO') {
      throw new Error(`Unsupported screening group: ${group}`);
    }

    if (language !== 'en' && language !== 'de') {
      throw new Error(`Unsupported language: ${language}`);
    }

    // 2. MR supports English Webcheck screening only.
    if (group === 'MR' &&
        (language !== 'en' || context.screeningType !== 'WEBCHECK')) {
      throw new Error(
        'MR supports English Webcheck screening only',
      );
    }

    // 3. Select the appropriate adapter and service.
    switch (context.screeningType) {
      case 'WEBCHECK': {
        const adapter =
          this.webcheckAdapterFactory.getAdapter(
            group,
            language as Language,
          );

        const canonicalRequest =
          await adapter.toCanonical(record);

        const canonicalResponse =
          await this.webcheckNetRevealService.webCheckScreen(
            canonicalRequest,
          );

        return adapter.toResponse(canonicalResponse);
      }

      case 'PAYMENT': {
        if (group !== 'ERGO') {
          throw new Error(
            'Payment screening is supported only for ERGO',
          );
        }

        const adapter =
          this.paymentAdapterFactory.getAdapter(
            group,
            language as Language,
          );

        const canonicalRequest =
          await adapter.toCanonical(record);

        const canonicalResponse =
          await this.paymentNetRevealService.paymentScreen(
            canonicalRequest,
          );

        return adapter.toResponse(canonicalResponse);
      }

      default:
        throw new Error(
          `Unsupported screening type: ${context.screeningType}`,
        );
    }
  }
}