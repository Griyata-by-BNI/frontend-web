import { InfoCard } from "./InfoCard";
import { SubmissionDetail, PropertyDetail } from "@/types/riwayat";
import { FileText, User, Users, Briefcase, Phone, Home } from "lucide-react";

interface PengajuanKPRViewProps {
  submissionData: SubmissionDetail;
  propertyData: PropertyDetail | null;
}

export const PengajuanKPRView = ({ submissionData, propertyData }: PengajuanKPRViewProps) => {
  const { debtor_information, spouse_information, employee_information, emergency_contact, loan_information } = submissionData;

  const dataNasabah = [
    { label: "Nama Lengkap", value: debtor_information.full_name },
    { label: "Nama Lengkap Ibu Kandung", value: debtor_information.mother_maiden_name },
    { label: "Jenis Kelamin", value: debtor_information.gender === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Tanggal Lahir", value: new Date(debtor_information.birth_date).toLocaleDateString("id-ID") },
    { label: "Tempat Lahir", value: debtor_information.place_of_birth },
    { label: "Status Pernikahan", value: debtor_information.marital_status },
    { label: "Status Tempat Tinggal", value: debtor_information.residence_status },
    { label: "NIK", value: debtor_information.nik },
    { label: "Pendidikan", value: debtor_information.education },
    { label: "NPWP", value: debtor_information.tax_id_number },
    { label: "Email", value: debtor_information.email },
    { label: "Nomor Handphone", value: debtor_information.phone_number },
    { label: "Alamat KTP", value: debtor_information.id_card_address },
    { label: "Alamat Domisili", value: debtor_information.domicile_address },
  ];

  const dataPasangan = spouse_information ? [
    { label: "Nama Lengkap", value: spouse_information.full_name },
    { label: "Jenis Kelamin", value: spouse_information.gender === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Tanggal Lahir", value: new Date(spouse_information.birth_date).toLocaleDateString("id-ID") },
    { label: "Kewarganegaraan", value: spouse_information.nationality },
    { label: "Pendidikan", value: spouse_information.education },
    { label: "NIK", value: spouse_information.nik },
    { label: "NPWP", value: spouse_information.tax_id_number },
    { label: "Nomor Handphone", value: spouse_information.phone_number },
    { label: "Email", value: spouse_information.email },
    { label: "Alamat KTP", value: spouse_information.id_card_address },
  ] : [];

  const dataKontak = [
    { label: "Nama Lengkap", value: emergency_contact.fullName },
    { label: "Alamat", value: emergency_contact.address },
    { label: "Telepon Rumah", value: emergency_contact.homePhoneNumber.toString() },
    { label: "Nomor HP", value: emergency_contact.mobilePhoneNumber.toString() },
    { label: "Hubungan", value: emergency_contact.relationship },
  ];

  const dataPekerjaan = [
    { label: "Jenis Pekerjaan", value: employee_information.employment_type },
    { label: "Nama Perusahaan", value: employee_information.company_name },
    { label: "Alamat Perusahaan", value: employee_information.address },
    { label: "Telepon Perusahaan", value: employee_information.phone_number },
    { label: "Jabatan", value: employee_information.job_title },
    { label: "Posisi", value: employee_information.position },
    { label: "Jenis Industri", value: employee_information.industry_type },
    { label: "Lama Bekerja", value: `${employee_information.length_of_work_years} Tahun` },
    { label: "Gaji Pokok", value: `Rp ${employee_information.basic_salary.toLocaleString("id-ID")}` },
    { label: "Pendapatan Lain", value: `Rp ${employee_information.other_income.toLocaleString("id-ID")}` },
    { label: "Total Pendapatan", value: `Rp ${employee_information.total_income.toLocaleString("id-ID")}` },
    { label: "Total Pengeluaran", value: `Rp ${employee_information.total_expenses.toLocaleString("id-ID")}` },
  ];

  const dataProperti = propertyData ? [
    { label: "Nama Properti", value: propertyData.name },
    { label: "Developer", value: propertyData.developerName },
    { label: "Cluster", value: propertyData.clusterName },
    { label: "Tipe", value: propertyData.clusterTypeName },
    { label: "Harga", value: `Rp ${parseInt(propertyData.price).toLocaleString("id-ID")}` },
    { label: "Lokasi", value: propertyData.location },
    { label: "Kamar Tidur", value: propertyData.jumlahKamarTidur.toString() },
    { label: "Kamar Mandi", value: propertyData.jumlahKamarMandi.toString() },
    { label: "Luas Bangunan", value: `${propertyData.buildingArea} m²` },
    { label: "Luas Tanah", value: `${propertyData.landArea} m²` },
    { label: "Jumlah Lantai", value: propertyData.jumlahLantai.toString() },
    { label: "Garasi", value: propertyData.garasi ? "Ya" : "Tidak" },
    { label: "Kolam Renang", value: propertyData.kolamRenang ? "Ya" : "Tidak" },
  ] : [];

  const dataPinjaman = [
    { label: "Nilai Pinjaman", value: `Rp ${parseInt(loan_information.loan_value).toLocaleString("id-ID")}` },
    { label: "Jangka Waktu", value: `${loan_information.monthly_period} bulan` },
  ];

  const dataDokumen = ["KTP", "NPWP", "Kartu Keluarga", "Buku Nikah", "Slip Gaji", "Rekening Koran"];

  return (
    <div className="space-y-8">
      <InfoCard
        title="Informasi Nasabah"
        details={dataNasabah}
        icon={<User className="w-6 h-6 text-gray-500" />}
      />
      
      {spouse_information && (
        <InfoCard
          title="Informasi Pasangan"
          details={dataPasangan}
          icon={<Users className="w-6 h-6 text-gray-500" />}
        />
      )}
      
      <InfoCard
        title="Kontak Darurat"
        details={dataKontak}
        icon={<Phone className="w-6 h-6 text-gray-500" />}
      />
      
      <InfoCard
        title="Informasi Pekerjaan"
        details={dataPekerjaan}
        icon={<Briefcase className="w-6 h-6 text-gray-500" />}
      />

      {propertyData && (
        <InfoCard
          title="Informasi Properti"
          details={dataProperti}
          icon={<Home className="w-6 h-6 text-gray-500" />}
        />
      )}

      <InfoCard
        title="Informasi Pinjaman"
        details={dataPinjaman}
        icon={<FileText className="w-6 h-6 text-gray-500" />}
      />
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <FileText className="w-6 h-6 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-800">Dokumen Terkirim</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 list-inside list-disc marker:text-teal-500">
          {dataDokumen.map((doc, index) => (
            <li key={index} className="text-gray-700">
              {doc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};