export type ApiStatus = "submitted" | "under_review" | "verified" | "rejected";

export interface SubmissionSummary {
  submission: {
    id: number;
    status: ApiStatus;
    verified_at: string;
    verified_by: string;
    verification_notes: string;
    created_at: string;
  };
  property_information: {
    propertyId: number;
    propertyName: string;
    clusterName: string;
    clusterTypeName: string;
    developerName: string;
    propertyPhotoUrl: string[];
    submissionId: number;
    createdAt: string;
  };
}

export interface DebtorInformation {
  full_name: string;
  mother_maiden_name: string;
  gender: string;
  birth_date: string;
  place_of_birth: string;
  marital_status: string;
  residence_status: string;
  nik: string;
  education: string;
  tax_id_number: string;
  email: string;
  phone_number: string;
  id_card_address: string;
  domicile_address: string;
}

export interface SpouseInformation {
  full_name: string;
  gender: string;
  birth_date: string;
  nationality: string;
  education: string;
  nik: string;
  tax_id_number: string;
  phone_number: string;
  email: string;
  id_card_address: string;
}

export interface EmergencyContact {
  fullName: string;
  address: string;
  homePhoneNumber: number;
  mobilePhoneNumber: number;
  relationship: string;
}

export interface EmploymentHistory {
  employment_type: string;
  company_name: string;
  address: string;
  phone_number: string;
  job_title: string;
  position: string;
  industry_type: string;
  length_of_work_years: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  basic_salary: number;
}

export interface EmployeeInformation {
  employment_type: string;
  company_name: string;
  address: string;
  phone_number: string;
  job_title: string;
  position: string;
  industry_type: string;
  length_of_work_years: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  basic_salary: number;
  employmentHistory: EmploymentHistory;
}

export interface LoanInformation {
  property_id: number;
  loan_value: string;
  monthly_period: number;
}

export interface DocumentSubmission {
  type: string;
  url: string;
}

export interface SubmissionDetail {
  submission: {
    id: number;
    status: ApiStatus;
    verified_at: string;
    verified_by: string;
    verification_notes: string;
    created_at: string;
  };
  debtor_information: DebtorInformation;
  spouse_information: SpouseInformation;
  emergency_contact: EmergencyContact;
  employee_information: EmployeeInformation;
  loan_information: LoanInformation;
  documents: DocumentSubmission[];
}

export interface PropertyDetail {
  id: number;
  developerId: number;
  developerName: string;
  clusterId: number;
  clusterName: string;
  clusterTypeId: number;
  clusterTypeName: string;
  name: string;
  description: string;
  price: string;
  location: string;
  latitude: string;
  longitude: string;
  facilities: Array<{
    name: string;
    value: number | boolean;
  }>;
  spesifications: string;
  landArea: number;
  buildingArea: number;
  jumlahLantai: number;
  jumlahKamarTidur: number;
  jumlahKamarMandi: number;
  garasi: boolean;
  kolamRenang: boolean;
  collateralAddress: string;
  createdAt: string;
  updatedAt: string;
  stock: number;
  property_photo_urls: string[];
}
