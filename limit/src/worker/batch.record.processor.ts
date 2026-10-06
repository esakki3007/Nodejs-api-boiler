import pLimit from 'p-limit';

import {
  BatchMessage,
  BatchRecord,
  BatchWorkerResult,
} from '../types/batch.types';
import { batchConfig } from '../config/batch.config';

// Replace this import with your existing adapter factory path.
import {
  WebcheckAdapterFactory,
} from '../modules/webcheck/adapters/webcheck-adapter.factory';

// Replace this type import/path with your existing adapter base class.
import { WebcheckAdapter } from '../modules/webcheck/adapters/webcheck.adapter';

export class BatchRecordProcessor {
  private readonly concurrency: number;

  constructor() {
    this.concurrency = batchConfig.recordConcurrency;

    if (this.concurrency < 1) {
      throw new Error(
        'BATCH_RECORD_CONCURRENCY must be greater than 0',
      );
    }
  }

  async process(
    batch: BatchMessage,
  ): Promise<BatchWorkerResult> {
    // Create/select the adapter once per batch, not once per record.
    const adapter: WebcheckAdapter =
      WebcheckAdapterFactory.getAdapter(batch.language);

    const limit = pLimit(this.concurrency);

    const results = await Promise.all(
      batch.records.map((record, index) =>
        limit(() =>
          this.processRecord(
            batch,
            record,
            index,
            adapter,
          ),
        ),
      ),
    );

    const succeeded = results.filter(
      (result) => result.success,
    );

    const failed = results.filter(
      (result) => !result.success,
    );

    return {
      success: failed.length === 0,
      batchNumber: batch.batchNumber,
      processed: results.length,
      succeeded: succeeded.length,
      failed: failed.length,
      errors: failed.map((result) => ({
        index: result.index,
        customerNumber: result.customerNumber,
        error: result.error!,
      })),
    };
  }

  private async processRecord(
    batch: BatchMessage,
    record: BatchRecord,
    index: number,
    adapter: WebcheckAdapter,
  ): Promise<{
    success: boolean;
    index: number;
    customerNumber?: string | number;
    error?: string;
  }> {
    try {
      console.log(
        JSON.stringify({
          event: 'BATCH_RECORD_STARTED',
          correlationId: batch.correlationId,
          batchNumber: batch.batchNumber,
          index,
          customerNumber: record.customer_number,
        }),
      );

      // Existing flow:
      // record -> Webcheck adapter -> canonical -> NetReveal
      await adapter.process(record);

      console.log(
        JSON.stringify({
          event: 'BATCH_RECORD_COMPLETED',
          correlationId: batch.correlationId,
          batchNumber: batch.batchNumber,
          index,
          customerNumber: record.customer_number,
        }),
      );

      return {
        success: true,
        index,
        customerNumber: record.customer_number,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.error(
        JSON.stringify({
          event: 'BATCH_RECORD_FAILED',
          correlationId: batch.correlationId,
          batchNumber: batch.batchNumber,
          index,
          customerNumber: record.customer_number,
          error: errorMessage,
        }),
      );

      return {
        success: false,
        index,
        customerNumber: record.customer_number,
        error: errorMessage,
      };
    }
  }
}
