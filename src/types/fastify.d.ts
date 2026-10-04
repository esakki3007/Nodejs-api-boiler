import { CheckAdapter } from '../adapters/partner/check.adapter';
import { SubjectScreeningService } from '../services/subject-screening.service';

declare module 'fastify' {
  interface FastifyInstance {
    checkAdapter: CheckAdapter;
    subjectScreeningService: SubjectScreeningService;
  }
}
