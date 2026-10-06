export const batchConfig = {
  recordConcurrency: Number(
    process.env.BATCH_RECORD_CONCURRENCY ?? 10,
  ),
};
