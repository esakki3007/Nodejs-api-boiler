import { Worker } from 'node:worker_threads';
import { randomUUID } from 'node:crypto';

import {
  BatchMessage,
  BatchWorkerResult,
} from '../types/batch.types';

interface PendingJob {
  resolve: (result: BatchWorkerResult) => void;
  reject: (error: Error) => void;
}

export class BatchWorkerManager {
  private readonly worker: Worker;
  private readonly pendingJobs = new Map<string, PendingJob>();

  constructor() {
    this.worker = new Worker(
      new URL('./batch.worker.ts', import.meta.url),
    );

    this.worker.on('message', (message) => {
      this.handleWorkerMessage(message);
    });

    this.worker.on('error', (error) => {
      console.error(
        JSON.stringify({
          event: 'BATCH_WORKER_ERROR',
          error: error.message,
        }),
      );

      for (const [, pending] of this.pendingJobs) {
        pending.reject(error);
      }

      this.pendingJobs.clear();
    });

    this.worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(
          JSON.stringify({
            event: 'BATCH_WORKER_EXIT',
            code,
          }),
        );
      }
    });
  }

  async process(batch: BatchMessage): Promise<BatchWorkerResult> {
    const jobId = randomUUID();

    return new Promise<BatchWorkerResult>((resolve, reject) => {
      this.pendingJobs.set(jobId, { resolve, reject });

      this.worker.postMessage({
        jobId,
        batch,
      });
    });
  }

  private handleWorkerMessage(message: {
    jobId: string;
    result?: BatchWorkerResult;
    error?: string;
  }): void {
    const pending = this.pendingJobs.get(message.jobId);

    if (!pending) {
      console.warn(
        JSON.stringify({
          event: 'UNKNOWN_WORKER_JOB',
          jobId: message.jobId,
        }),
      );
      return;
    }

    this.pendingJobs.delete(message.jobId);

    if (message.error) {
      pending.reject(new Error(message.error));
      return;
    }

    if (!message.result) {
      pending.reject(new Error('Worker returned empty result'));
      return;
    }

    pending.resolve(message.result);
  }

  async shutdown(): Promise<void> {
    await this.worker.terminate();
  }
}
