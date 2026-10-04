import Fastify from 'fastify';
import subjectScreeningPlugin from './plugins/subject-screening.plugin';
import partnerAdapterPlugin from './plugins/partner-adapter.plugin';
import { checkRoute } from './routes/partner/check.route';

export async function buildApp() {
  const fastify = Fastify({ logger: true });

  await fastify.register(subjectScreeningPlugin);
  await fastify.register(partnerAdapterPlugin);

  await fastify.register(checkRoute, { prefix: '/partner' });

  return fastify;
}
