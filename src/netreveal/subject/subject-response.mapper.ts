import { SubjectScreeningResponse } from '../../canonical/subject/subject-screening-response';

export interface NetRevealSubjectResponse {
  code: string;
  trxId: string;
}

export class SubjectResponseMapper {
  toCanonical(
    response: NetRevealSubjectResponse,
  ): SubjectScreeningResponse {
    return {
      statusCode: response.code,
      transactionId: response.trxId,
    };
  }
}
