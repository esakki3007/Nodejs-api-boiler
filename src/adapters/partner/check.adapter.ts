import { SubjectScreeningRequest } from '../../canonical/subject/subject-screening-request';
import { SubjectScreeningResponse } from '../../canonical/subject/subject-screening-response';

export interface CheckSoapRequest {
  name: string;
  birthyear?: string;
  orgUnitId: string;
  customerNumber: string;
  customerType: string;
  birthName?: string;
  birthCountry?: string;
  citizenship?: string;
  residenceStreet?: string;
  residenceCity?: string;
  residenceCountry?: string;
}

export interface CheckSoapResponse {
  checkStatus: string;
  birthyear?: string;
  name: string;
  orgUnitId: string;
  referenceNumber: string;
}

export class CheckAdapter {
  toCanonical(request: CheckSoapRequest): SubjectScreeningRequest {
    return {
      customerNumber: request.customerNumber,
      name: request.name,
      customerType: request.customerType,
      dateOfBirth: request.birthyear,
      birthName: request.birthName,
      birthCountry: request.birthCountry,
      citizenship: request.citizenship,
      orgUnitId: request.orgUnitId,
      residenceStreet: request.residenceStreet,
      residenceCity: request.residenceCity,
      residenceCountry: request.residenceCountry,
      source: 'ERGO',
      embargo: false,
      pep: false,
      generatedAlerts: false,
      detailed: true,
    };
  }

  toSoapResponse(
    response: SubjectScreeningResponse,
    originalRequest: CheckSoapRequest,
  ): CheckSoapResponse {
    return {
      checkStatus: response.statusCode,
      birthyear: originalRequest.birthyear,
      name: originalRequest.name,
      orgUnitId: originalRequest.orgUnitId,
      referenceNumber: response.transactionId,
    };
  }
}
