import { SubjectScreeningRequest } from '../../canonical/subject/subject-screening-request';
import { SubjectScreeningResponse } from '../../canonical/subject/subject-screening-response';

export interface WebcheckResponse { statusCode: string; transactionId: string; }

export abstract class WebcheckAdapter<TRequest> {
  abstract toCanonical(request: TRequest): SubjectScreeningRequest;

  toResponse(response: SubjectScreeningResponse): WebcheckResponse {
    return { statusCode: response.statusCode, transactionId: response.transactionId };
  }

  protected required(value: string | undefined | null, fieldName: string): string {
    if (value === undefined || value === null || value.trim() === '') {
      throw new Error(`${fieldName} is required`);
    }
    return value;
  }

  protected toBoolean(value?: string | boolean): boolean {
    if (typeof value === 'boolean') return value;
    if (!value) return false;
    return ['Y', 'YES', 'TRUE', '1'].includes(value.toUpperCase());
  }
}
