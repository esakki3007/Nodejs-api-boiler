import {
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';

import { BatchMessage } from '../types/batch.types';
import { BatchWorkerManager } from '../worker/batch.worker.manager';

export class BatchQueueConsumer {
  constructor(
    private readonly receiver: ServiceBusReceiver,
    private readonly workerManager: BatchWorkerManager,
  ) {}

  async start(): Promise<void> {
    this.receiver.subscribe({
      processMessage: async (message: ServiceBusReceivedMessage) => {
        await this.handleMessage(message);
      },

      processError: async (args) => {
        console.error(
          JSON.stringify({
            event: 'BATCH_QUEUE_ERROR',
            error: args.error.message,
          }),
        );
      },
    });
  }

  private async handleMessage(
    message: ServiceBusReceivedMessage,
  ): Promise<void> {
    const batch = this.parseBatchMessage(message);

    console.log(
      JSON.stringify({
        event: 'BATCH_MESSAGE_RECEIVED',
        correlationId: batch.correlationId,
        batchNumber: batch.batchNumber,
        count: batch.count,
        language: batch.language,
      }),
    );

    try {
      const result = await this.workerManager.process(batch);

      if (!result.success) {
        throw new Error(
          `Batch ${batch.batchNumber} processing failed`,
        );
      }

      await this.receiver.completeMessage(message);

      console.log(
        JSON.stringify({
          event: 'BATCH_MESSAGE_COMPLETED',
          correlationId: batch.correlationId,
          batchNumber: batch.batchNumber,
          processed: result.processed,
          succeeded: result.succeeded,
          failed: result.failed,
        }),
      );
    } catch (error) {
      console.error(
        JSON.stringify({
          event: 'BATCH_MESSAGE_FAILED',
          correlationId: batch.correlationId,
          batchNumber: batch.batchNumber,
          error:
            error instanceof Error ? error.message : String(error),
        }),
      );

      // Do not complete the message.
      // Service Bus can redeliver it according to its delivery policy.
      throw error;
    }
  }

  private parseBatchMessage(
    message: ServiceBusReceivedMessage,
  ): BatchMessage {
    if (!message.body) {
      throw new Error('Batch message body is empty');
    }

    const batch =
      typeof message.body === 'string'
        ? JSON.parse(message.body)
        : message.body;

    if (batch.messageType !== 'BATCH') {
      throw new Error(`Invalid message type: ${batch.messageType}`);
    }

    if (!Array.isArray(batch.records)) {
      throw new Error('Batch records must be an array');
    }

    return batch as BatchMessage;
  }
}
