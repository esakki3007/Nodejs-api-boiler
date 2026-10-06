export interface BatchRecord {
  customer_number: string | number;
  name: string;
  birthname?: string | null;
  birth_date?: string | null;
  birth_country?: string | null;
  resident_street?: string | null;
  resident_city?: string | null;
  resident_country?: string | null;
  citizenship?: string | null;
  customer_type?: string | null;

  [key: string]: unknown;
}

export interface BatchMessage {
  messageType: 'BATCH';
  correlationId: string;
  language: 'EN' | 'DE';
  blobPath: string;
  batchNumber: number;
  count: number;
  byteLength: number;
  records: BatchRecord[];
}

export interface BatchWorkerResult {
  success: boolean;
  batchNumber: number;
  processed: number;
  succeeded: number;
  failed: number;
  errors?: Array<{
    index: number;
    customerNumber?: string | number;
    error: string;
  }>;
}
