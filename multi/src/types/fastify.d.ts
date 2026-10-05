import { WebcheckAdapterFactory } from '../adapters/webcheck/webcheck-adapter.factory';
import { SubjectScreeningService } from '../services/subject-screening.service';

declare module 'fastify' {
  interface FastifyInstance {
    webcheckAdapterFactory: WebcheckAdapterFactory;
    subjectScreeningService: SubjectScreeningService;
  }
}
