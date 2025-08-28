// utils/kprMappers.ts
import type {
  KprApplicationPayload,
  KprApplicationResponse,
  KprSubmissionPayload,
  KprSubmissionObjectPayload,
} from "@/types/submission";

/** Ambil File pertama dari antd Upload fileList */
function pickFirstFile(list: any[] | undefined | null): File | null {
  if (!Array.isArray(list) || list.length === 0) return null;
  const f = list[0];
  // antd Upload menaruh file asli di originFileObj
  return (f?.originFileObj as File) ?? (f as unknown as File) ?? null;
}

/** Normalisasi YYYY-MM-DD dari string/Date/dayjs */
function toISODate(value: any): string {
  if (!value) return "";
  if (typeof value?.format === "function") return value.format("YYYY-MM-DD");
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** Cek object punya setidaknya satu nilai bermakna */
function hasAnyValue(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;
  return Object.values(obj).some(
    (v) => v !== undefined && v !== null && `${v}`.trim() !== ""
  );
}

/** Mapper: formData -> payload untuk useAddKprDetail (JSON) */
export function buildKprDetailPayload(
  formData: any,
  propertyId: number
): KprApplicationPayload {
  const marital_status = formData?.is_married ? "menikah" : "belum_menikah";

  return {
    debtor_information: {
      full_name: formData.full_name,
      mother_maiden_name: formData.mother_maiden_name,
      gender: formData.gender,
      birth_date: toISODate(formData.birth_date),
      place_of_birth: formData.place_of_birth,
      marital_status,
      residence_status: formData.residence_status,
      nik: formData.nik,
      education: formData.education,
      tax_id_number: formData.tax_id_number,
      email: formData.email,
      phone_number: `${formData.phone_number ?? ""}`,
      id_card_address: formData.id_card_address,
      domicile_address: formData.same_as_ktp
        ? formData.id_card_address
        : formData.domicile_address ?? null,
    },

    spouse_information:
      formData.is_married && formData.spouse_information
        ? {
            full_name: formData.spouse_information.full_name,
            gender: formData.spouse_information.gender,
            birth_date: toISODate(formData.spouse_information.birth_date),
            nationality: formData.spouse_information.nationality,
            education: formData.spouse_information.education,
            nik: formData.spouse_information.nik,
            tax_id_number: formData.spouse_information.tax_id_number,
            phone_number: formData.spouse_information.phone_number,
            email: formData.spouse_information.email,
            id_card_address: formData.spouse_information.id_card_address,
          }
        : null,

    emergency_contact: {
      fullName: formData.emergency_contact_name,
      address: formData.emergency_contact_address,
      homePhoneNumber: `${formData.emergency_contact_home_phone ?? ""}`,
      mobilePhoneNumber: `${formData.emergency_contact_mobile_phone ?? ""}`,
      relationship: formData.emergency_contact_relationship,
    },

    employee_information: {
      employment_type: formData.employment_type,
      company_name: formData.company_name,
      address: formData.address,
      phone_number: formData.company_phone_number,
      job_title: formData.job_title,
      position: formData.position,
      industry_type: formData.industry_type,
      length_of_work_years: Number(formData.length_of_work_years ?? 0),
      other_income: Number(formData.other_income ?? 0),
      total_income: Number(formData.total_income ?? 0),
      total_expenses: Number(formData.total_expenses ?? 0),
      basic_salary: Number(formData.basic_salary ?? 0),
      ...(hasAnyValue(formData.employmentHistory)
        ? {
            employmentHistory: {
              employment_type: formData.employmentHistory.employment_type,
              company_name: formData.employmentHistory.company_name,
              address: formData.employmentHistory.address,
              phone_number: formData.employmentHistory.phone_number,
              job_title: formData.employmentHistory.job_title,
              position: formData.employmentHistory.position,
              industry_type: formData.employmentHistory.industry_type,
              length_of_work_years: Number(
                formData.employmentHistory.length_of_work_years ?? 0
              ),
              other_income: Number(
                formData.employmentHistory.other_income ?? 0
              ),
              total_income: Number(
                formData.employmentHistory.total_income ?? 0
              ),
              total_expenses: Number(
                formData.employmentHistory.total_expenses ?? 0
              ),
              basic_salary: Number(
                formData.employmentHistory.basic_salary ?? 0
              ),
            },
          }
        : {}),
    },

    loan_information: {
      down_payment: Number(formData.downPayment ?? 0),
      property_id: Number(propertyId),
      loan_value: `${formData.loanAmount ?? ""}`,
      monthly_period: Number(formData.tenor ?? 0),
    },
  };
}

/** Mapper: formData + IDs hasil detail -> payload untuk useSubmitKpr (multipart) */
export function buildKprSubmissionPayload(
  formData: any,
  ids: KprApplicationResponse["data"],
  opts: { propertyId: number; debtorId: number; interestId?: number }
): KprSubmissionPayload {
  const submission: KprSubmissionObjectPayload = {
    property_id: Number(opts.propertyId),
    loan_information_id: Number(ids.loan_information_id),
    debtor_id: Number(opts.debtorId),
    debtor_information_id: Number(ids.debtor_information_id),
    spouse_information_id: ids.spouse_information_id
      ? Number(ids.spouse_information_id ?? 0)
      : null,
    employment_information_id: Number(ids.employment_information_id),
    emergency_contact_id: Number(ids.emergency_contact_id),
    interest_id: Number(opts.interestId ?? formData.interestRate ?? 0),
  };

  const id_card = pickFirstFile(formData.id_card);
  const tax_id = pickFirstFile(formData.tax_id);
  const employment_certificate = pickFirstFile(formData.employment_certificate);
  const salary_slip = pickFirstFile(formData.salary_slip);
  const spouse_id_card = pickFirstFile(formData.spouse_id_card);
  const marriage_certificate = pickFirstFile(formData.marriage_certificate);

  if (!id_card || !tax_id || !employment_certificate || !salary_slip) {
    throw new Error(
      "Dokumen wajib (KTP, NPWP, Sertifikat Pekerjaan, Slip Gaji) belum lengkap."
    );
  }

  return {
    submission,
    id_card,
    tax_id,
    employment_certificate,
    salary_slip,
    spouse_id_card: spouse_id_card ?? null,
    marriage_certificate: marriage_certificate ?? null,
  };
}
