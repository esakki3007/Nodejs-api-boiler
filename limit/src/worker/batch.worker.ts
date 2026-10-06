import { parentPort } from 'node:worker_threads';

import { BatchMessage } from '../types/batch.types';
import { BatchRecordProcessor } from './batch.record.processor';

if (!parentPort) {
  throw new Error('batch.worker.ts must run inside Worker Thread');
}

const processor = new BatchRecordProcessor();

parentPort.on(
  'message',
  async ({
    jobId,
    batch,
  }: {
    jobId: string;
    batch: BatchMessage;
  }) => {
    try {
      console.log(
        JSON.stringify({
          event: 'BATCH_WORKER_STARTED',
          correlationId: batch.correlationId,
          language: batch.language,
          batchNumber: batch.batchNumber,
          count: batch.count,
          byteLength: batch.byteLength,
        }),
      );

      const result = await processor.process(batch);

      parentPort!.postMessage({
        jobId,
        result,
      });
    } catch (error) {
      parentPort!.postMessage({
        jobId,
        error:
          error instanceof Error ? error.message : String(error),
      });
    }
  },
);
