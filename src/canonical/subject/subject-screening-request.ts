export interface SubjectScreeningRequest {
  customerNumber: string;
  name: string;
  customerType: string;
  dateOfBirth?: string;
  birthName?: string;
  birthCountry?: string;
  citizenship?: string;
  orgUnitId: string;
  residenceStreet?: string;
  residenceCity?: string;
  residenceCountry?: string;
  source: string;
  embargo: boolean;
  pep: boolean;
  generatedAlerts: boolean;
  detailed: boolean;
}
