// types/kpr.ts
export type Gender = "L" | "P";
export type MaritalStatus = "menikah" | "belum_menikah" | "cerai" | string;

export interface DebtorInformation {
  full_name: string;
  mother_maiden_name: string;
  gender: Gender;
  birth_date: string;
  place_of_birth: string;
  marital_status: MaritalStatus;
  residence_status: string;
  nik: string;
  education: string;
  tax_id_number: string;
  email: string;
  phone_number: string;
  id_card_address: string;
  domicile_address?: string | null;
}

export interface SpouseInformation {
  full_name: string;
  gender: Gender;
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
  homePhoneNumber: string;
  mobilePhoneNumber: string;
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
  employmentHistory?: EmploymentHistory;
}

export interface LoanInformation {
  property_id: number;
  loan_value: string | number;
  monthly_period: number;
  down_payment: string | number;
}

export interface KprApplicationPayload {
  debtor_information: DebtorInformation;
  spouse_information?: SpouseInformation | null;
  emergency_contact: EmergencyContact;
  employee_information: EmployeeInformation;
  loan_information: LoanInformation;
}

export interface KprApplicationResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    debtor_information_id: number;
    spouse_information_id: number;
    employment_information_id: number;
    emergency_contact_id: number;
    loan_information_id: number;
  };
}

export interface KprSubmissionObjectPayload {
  property_id: number;
  loan_information_id: number;
  debtor_id: number;
  debtor_information_id: number;
  spouse_information_id: number | null;
  employment_information_id: number;
  emergency_contact_id: number;
  interest_id: number;
}

export interface KprSubmissionPayload {
  submission: KprSubmissionObjectPayload;
  id_card: File;
  tax_id: File;
  employment_certificate: File;
  salary_slip: File;
  spouse_id_card?: File | null;
  marriage_certificate?: File | null;
}
