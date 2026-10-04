import { FastifyInstance } from 'fastify';
import { CheckSoapRequest } from '../../adapters/partner/check.adapter';

export async function checkRoute(fastify: FastifyInstance) {
  fastify.post('/check', async (request, reply) => {
    const soapRequest = request.body as CheckSoapRequest;

    try {
      const canonicalRequest =
        fastify.checkAdapter.toCanonical(soapRequest);

      const canonicalResponse =
        await fastify.subjectScreeningService.screen(
          canonicalRequest,
        );

      const soapResponse =
        fastify.checkAdapter.toSoapResponse(
          canonicalResponse,
          soapRequest,
        );

      return reply.type('text/xml').send(soapResponse);
    } catch (error) {
      request.log.error({ error }, 'Check API failed');
      throw error;
    }
  });
}
