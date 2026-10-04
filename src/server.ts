import { buildApp } from './app';

async function start() {
  const app = await buildApp();

  await app.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 3000),
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
