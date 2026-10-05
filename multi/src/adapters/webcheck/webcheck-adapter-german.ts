import { SubjectScreeningRequest } from '../../canonical/subject/subject-screening-request';
import { WebcheckAdapter } from './webcheck.adapter';

/** Replace these placeholder German fields with the exact fields from your document. */
export interface WebcheckGermanRequest {
  language: 'de';
  kundenNummer: string;
  name: string;
  kundenTyp: string;
  geburtsdatum?: string;
  geburtsname?: string;
  geburtsland?: string;
  staatsangehoerigkeit?: string;
  orgEinheit: string;
  wohnortStrasse?: string;
  wohnortStadt?: string;
  wohnortLand?: string;
  embargo?: string | boolean;
  pep?: string | boolean;
  generatedAlerts?: string | boolean;
  detailed?: string | boolean;
}

export class WebcheckAdapterGerman extends WebcheckAdapter<WebcheckGermanRequest> {
  toCanonical(request: WebcheckGermanRequest): SubjectScreeningRequest {
    return {
      customerNumber: this.required(request.kundenNummer, 'kundenNummer'),
      name: this.required(request.name, 'name'),
      customerType: this.required(request.kundenTyp, 'kundenTyp'),
      dateOfBirth: request.geburtsdatum,
      birthName: request.geburtsname,
      birthCountry: request.geburtsland,
      citizenship: request.staatsangehoerigkeit,
      orgUnitId: this.required(request.orgEinheit, 'orgEinheit'),
      residenceStreet: request.wohnortStrasse,
      residenceCity: request.wohnortStadt,
      residenceCountry: request.wohnortLand,
      source: 'WEBCHECK',
      embargo: this.toBoolean(request.embargo),
      pep: this.toBoolean(request.pep),
      generatedAlerts: this.toBoolean(request.generatedAlerts),
      detailed: request.detailed === undefined ? true : this.toBoolean(request.detailed),
    };
  }
}
