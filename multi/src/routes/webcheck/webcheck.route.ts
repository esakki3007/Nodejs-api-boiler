import { FastifyInstance } from 'fastify';
import { WebcheckLanguage } from '../../adapters/webcheck/webcheck-adapter.factory';
import { WebcheckEnglishRequest } from '../../adapters/webcheck/webcheck-adapter-english';
import { WebcheckGermanRequest } from '../../adapters/webcheck/webcheck-adapter-german';

type WebcheckRequest = WebcheckEnglishRequest | WebcheckGermanRequest;

export async function webcheckRoute(fastify: FastifyInstance) {
  fastify.post('/webcheck', async (request, reply) => {
    const body = request.body as WebcheckRequest;
    const language = body.language.toLowerCase() as WebcheckLanguage;
    const adapter = fastify.webcheckAdapterFactory.getAdapter(language);

    try {
      const canonicalRequest = adapter.toCanonical(body);
      const canonicalResponse = await fastify.subjectScreeningService.screen(canonicalRequest);
      return reply.send(adapter.toResponse(canonicalResponse));
    } catch (error) {
      request.log.error({ error }, 'WebCheck processing failed');
      throw error;
    }
  });
}
