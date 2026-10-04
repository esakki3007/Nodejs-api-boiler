import { HttpClient } from '../../infrastructure/http/http-client';
import { NetRevealSubjectRequest } from './subject-request.mapper';
import { NetRevealSubjectResponse } from './subject-response.mapper';

export interface SubjectScreeningClient {
  screen(request: NetRevealSubjectRequest): Promise<NetRevealSubjectResponse>;
}

export class NetRevealSubjectScreeningClient implements SubjectScreeningClient {
  constructor(private readonly httpClient: HttpClient) {}

  async screen(
    request: NetRevealSubjectRequest,
  ): Promise<NetRevealSubjectResponse> {
    return this.httpClient.post<NetRevealSubjectResponse>(
      '/subject/screening',
      request,
    );
  }
}
