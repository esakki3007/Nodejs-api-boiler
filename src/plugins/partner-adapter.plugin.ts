import fp from 'fastify-plugin';
import { CheckAdapter } from '../adapters/partner/check.adapter';

export default fp(async (fastify) => {
  fastify.decorate('checkAdapter', new CheckAdapter());
});
