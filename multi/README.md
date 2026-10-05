# ERGO WebCheck Adapter Section

This ZIP contains the WebCheck language-specific adapter layer for the agreed Subject Screening architecture.

## Flow

WebCheck Route -> WebcheckAdapterFactory -> English/German Adapter -> SubjectScreeningRequest -> SubjectScreeningService -> NetReveal -> SubjectScreeningResponse -> Adapter Response.

The route does not know NetReveal mapping details. English and German adapters only translate their legacy request fields into the shared canonical model.

## Files

- `webcheck.adapter.ts` - base generic adapter and common helpers.
- `webcheck-adapter-english.ts` - English request mapping.
- `webcheck-adapter-german.ts` - German request mapping; German names are placeholders to be replaced with the exact document fields.
- `webcheck-adapter.factory.ts` - selects the adapter by language.
- `webcheck-adapter.plugin.ts` - Fastify registration.
- `fastify.d.ts` - Fastify decoration types.
- `webcheck.route.ts` - complete route orchestration.
- canonical Subject Screening request/response models.

## German fields

Update only `WebcheckGermanRequest` and `WebcheckAdapterGerman.toCanonical()` with your exact German contract. The canonical model and downstream Subject Screening service should remain unchanged.
