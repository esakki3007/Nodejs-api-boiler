# ERGO Subject Screening End-to-End Example

## Flow

Legacy API
  -> API-specific Adapter
  -> SubjectScreeningRequest
  -> SubjectScreeningService
  -> SubjectRequestMapper
  -> NetReveal Subject Screening Client
  -> NetReveal { code, trxId }
  -> SubjectResponseMapper
  -> SubjectScreeningResponse
  -> API-specific Adapter
  -> Legacy API response

## Route responsibility

The route only:
1. Converts legacy request through its adapter.
2. Calls SubjectScreeningService.
3. Converts canonical response through its adapter.
4. Sends the response.

The route does NOT call NetReveal mappers or clients directly.

## Shared components

For all seven legacy APIs, reuse:
- SubjectScreeningRequest
- SubjectScreeningResponse
- SubjectScreeningService
- SubjectRequestMapper
- SubjectResponseMapper
- SubjectScreeningClient

Create an adapter per legacy API.

If four APIs have the same business structure, their adapters can all produce the same SubjectScreeningRequest.

## Placeholder values

This example uses:
- source = ERGO
- embargo = false
- pep = false
- generatedAlerts = false
- detailed = true
- endpoint = /subject/screening

Replace these with the actual ERGO/NetReveal rules.
