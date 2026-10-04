import { SubjectScreeningRequest } from '../canonical/subject/subject-screening-request';
import { SubjectScreeningResponse } from '../canonical/subject/subject-screening-response';
import { SubjectRequestMapper } from '../netreveal/subject/subject-request.mapper';
import { SubjectResponseMapper } from '../netreveal/subject/subject-response.mapper';
import { SubjectScreeningClient } from '../netreveal/subject/subject-screening.client';

export class SubjectScreeningService {
  constructor(
    private readonly client: SubjectScreeningClient,
    private readonly requestMapper: SubjectRequestMapper,
    private readonly responseMapper: SubjectResponseMapper,
  ) {}

  async screen(
    request: SubjectScreeningRequest,
  ): Promise<SubjectScreeningResponse> {
    const netRevealRequest = this.requestMapper.toNetReveal(request);
    const netRevealResponse = await this.client.screen(netRevealRequest);
    return this.responseMapper.toCanonical(netRevealResponse);
  }
}
