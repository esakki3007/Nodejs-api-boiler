# WebFileCheck - Batch Consumer / Worker

This package contains only the batch-consumption and concurrent record-processing layer.

Existing Webcheck adapter, canonical mapping, transformation, and NetReveal layers are intentionally not implemented here.

## Flow

Azure Service Bus Batch Queue
  -> BatchQueueConsumer
  -> BatchWorkerManager
  -> Worker Thread
  -> BatchRecordProcessor
  -> WebcheckAdapter
  -> Existing Canonical Mapping
  -> Existing NetReveal Transformation / Client

## Configuration

Set:

BATCH_RECORD_CONCURRENCY=10

The processor creates one adapter per batch and uses p-limit to restrict
the number of records being processed concurrently.

## Important

Update the two imports in batch.record.processor.ts to match the paths
of your existing WebcheckAdapter and WebcheckAdapterFactory.

The current failure policy is batch-level: if any record fails, the
batch result is unsuccessful and the Service Bus message is not completed.
This is intentional for the initial implementation and should be revisited
when record-level retry/idempotency is added.
