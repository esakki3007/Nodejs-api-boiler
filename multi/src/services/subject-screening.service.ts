import { SubjectScreeningRequest } from '../canonical/subject/subject-screening-request';
import { SubjectScreeningResponse } from '../canonical/subject/subject-screening-response';

export interface SubjectScreeningClient {
  screen(request: SubjectScreeningRequest): Promise<SubjectScreeningResponse>;
}

export class SubjectScreeningService {
  constructor(private readonly client: SubjectScreeningClient) {}
  screen(request: SubjectScreeningRequest): Promise<SubjectScreeningResponse> {
    return this.client.screen(request);
  }
}
