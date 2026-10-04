import fp from 'fastify-plugin';
import { UndiciHttpClient } from '../infrastructure/http/undici-http-client';
import { SubjectRequestMapper } from '../netreveal/subject/subject-request.mapper';
import { SubjectResponseMapper } from '../netreveal/subject/subject-response.mapper';
import { NetRevealSubjectScreeningClient } from '../netreveal/subject/subject-screening.client';
import { SubjectScreeningService } from '../services/subject-screening.service';

export default fp(async (fastify) => {
  const httpClient = new UndiciHttpClient(
    process.env.NETREVEAL_BASE_URL ?? 'http://localhost:3001',
  );

  const service = new SubjectScreeningService(
    new NetRevealSubjectScreeningClient(httpClient),
    new SubjectRequestMapper(),
    new SubjectResponseMapper(),
  );

  fastify.decorate('subjectScreeningService', service);
});
