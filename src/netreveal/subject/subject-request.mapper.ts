import { SubjectScreeningRequest } from '../../canonical/subject/subject-screening-request';

export interface NetRevealSubjectRequest {
  id: string;
  type: string;
  sequence: string;
  data: {
    tnx: {
      customerNumber: string;
      name: string;
      customerType: string;
      dateOfBirth?: string;
      birthName?: string;
      birthCountry?: string;
      citizenShip?: string;
      orgunit_id: string;
      residenceStreet?: string;
      residenceCity?: string;
      residenceCountry?: string;
      source: string;
      embargo: 'Y' | 'N';
      pep: 'Y' | 'N';
      generatedAlerts: 'Y' | 'N';
      detailed: 'Y' | 'N';
    };
  };
}

export class SubjectRequestMapper {
  toNetReveal(request: SubjectScreeningRequest): NetRevealSubjectRequest {
    return {
      id: request.customerNumber,
      type: 'SUBJECT',
      sequence: '1',
      data: {
        tnx: {
          customerNumber: request.customerNumber,
          name: request.name,
          customerType: request.customerType,
          dateOfBirth: request.dateOfBirth,
          birthName: request.birthName,
          birthCountry: request.birthCountry,
          citizenShip: request.citizenship,
          orgunit_id: request.orgUnitId,
          residenceStreet: request.residenceStreet,
          residenceCity: request.residenceCity,
          residenceCountry: request.residenceCountry,
          source: request.source,
          embargo: request.embargo ? 'Y' : 'N',
          pep: request.pep ? 'Y' : 'N',
          generatedAlerts: request.generatedAlerts ? 'Y' : 'N',
          detailed: request.detailed ? 'Y' : 'N',
        },
      },
    };
  }
}
