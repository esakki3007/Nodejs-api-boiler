import fp from 'fastify-plugin';
import { WebcheckAdapterFactory } from '../adapters/webcheck/webcheck-adapter.factory';

export default fp(async (fastify) => {
  fastify.decorate('webcheckAdapterFactory', new WebcheckAdapterFactory());
});
