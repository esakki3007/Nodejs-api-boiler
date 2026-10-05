import { SubjectScreeningRequest } from '../../canonical/subject/subject-screening-request';
import { WebcheckAdapter } from './webcheck.adapter';

export interface WebcheckEnglishRequest {
  language: 'en';
  name: string;
  customerNumber: string;
  customerType: string;
  birthyear?: string;
  birthName?: string;
  birthCountry?: string;
  citizenship?: string;
  orgUnitId: string;
  residenceStreet?: string;
  residenceCity?: string;
  residenceCountry?: string;
  embargo?: string | boolean;
  pep?: string | boolean;
  generatedAlerts?: string | boolean;
  detailed?: string | boolean;
}

export class WebcheckAdapterEnglish extends WebcheckAdapter<WebcheckEnglishRequest> {
  toCanonical(request: WebcheckEnglishRequest): SubjectScreeningRequest {
    return {
      customerNumber: this.required(request.customerNumber, 'customerNumber'),
      name: this.required(request.name, 'name'),
      customerType: this.required(request.customerType, 'customerType'),
      dateOfBirth: request.birthyear,
      birthName: request.birthName,
      birthCountry: request.birthCountry,
      citizenship: request.citizenship,
      orgUnitId: this.required(request.orgUnitId, 'orgUnitId'),
      residenceStreet: request.residenceStreet,
      residenceCity: request.residenceCity,
      residenceCountry: request.residenceCountry,
      source: 'WEBCHECK',
      embargo: this.toBoolean(request.embargo),
      pep: this.toBoolean(request.pep),
      generatedAlerts: this.toBoolean(request.generatedAlerts),
      detailed: request.detailed === undefined ? true : this.toBoolean(request.detailed),
    };
  }
}
