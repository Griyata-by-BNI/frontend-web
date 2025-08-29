import { IconFlag, IconUser, IconBriefcase, IconCheckmark } from "./Icons";
import { DOCUMENT_REQUIREMENTS } from "../../_constants";

export const RequirementsSection = () => {
  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-9 text-gray-800 -mt-8 sm:-mt-10 lg:-mt-12">
        Syarat & Ketentuan Pengajuan
      </h2>

      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-9 shadow-lg">
        {/* 3 info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-xl flex items-start gap-4 sm:gap-5">
            <div className="flex-shrink-0 text-[#007A70] bg-[#E6F2F1] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
              <IconFlag />
            </div>
            <div>
              <h4 className="m-0 mb-1.5 sm:mb-2 text-gray-800 text-base sm:text-lg">
                Kewarganegaraan
              </h4>
              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                Warga Negara Indonesia (WNI) dan berdomisili di Indonesia.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-xl flex items-start gap-4 sm:gap-5">
            <div className="flex-shrink-0 text-[#007A70] bg-[#E6F2F1] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
              <IconUser />
            </div>
            <div>
              <h4 className="m-0 mb-1.5 sm:mb-2 text-gray-800 text-base sm:text-lg">
                Usia Pemohon
              </h4>
              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                Minimum 21 tahun, maksimal saat kredit lunas:
              </p>
              <ul className="m-0 mt-1 text-sm text-gray-600 leading-relaxed list-inside list-disc">
                <li>
                  <b>55 tahun</b> (Pegawai)
                </li>
                <li>
                  <b>65 tahun</b> (Profesional & Wiraswasta)
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-xl flex items-start gap-4 sm:gap-5">
            <div className="flex-shrink-0 text-[#007A70] bg-[#E6F2F1] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
              <IconBriefcase />
            </div>
            <div>
              <h4 className="m-0 mb-1.5 sm:mb-2 text-gray-800 text-base sm:text-lg">
                Status Pekerjaan
              </h4>
              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                Memiliki pekerjaan dan penghasilan tetap:
              </p>
              <ul className="m-0 mt-1 text-sm text-gray-600 leading-relaxed list-inside list-disc">
                <li>
                  <b>Pegawai Tetap</b> (min. 1-2 tahun)
                </li>
                <li>
                  <b>Profesional</b> (min. 2 tahun)
                </li>
                <li>
                  <b>Wiraswasta</b> (min. 2 tahun)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-center font-bold mb-4 sm:mb-6 text-dark-tosca text-base sm:text-lg">
          Persyaratan Dokumen
        </h3>

        {/* Tabel untuk md+; kartu stacked untuk <md */}
        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {DOCUMENT_REQUIREMENTS.map((doc, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="font-semibold text-gray-800">{doc.name}</div>
              <div className="mt-2 grid grid-cols-1 xs:grid-cols-3 gap-2 text-sm">
                <BadgeCheck label="Pegawai Tetap" checked={doc.pegawai} />
                <BadgeCheck label="Profesional" checked={doc.profesional} />
                <BadgeCheck
                  label="Pengusaha/Wiraswasta"
                  checked={doc.pengusaha}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Table for md and up */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr className="align-top">
                <th className="p-3 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-800">
                  Jenis Dokumen
                </th>
                <th className="p-3 text-center border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-800">
                  Pegawai Tetap
                </th>
                <th className="p-3 text-center border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-800">
                  Profesional
                </th>
                <th className="p-3 text-center border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-800">
                  Pengusaha/Wiraswasta
                </th>
              </tr>
            </thead>
            <tbody>
              {DOCUMENT_REQUIREMENTS.map((doc, index) => (
                <tr key={index}>
                  <td className="p-3 text-left border-b border-gray-200 text-sm">
                    {doc.name}
                  </td>
                  <td className="p-3 text-center border-b border-gray-200 text-sm">
                    {doc.pegawai && <CheckIcon />}
                  </td>
                  <td className="p-3 text-center border-b border-gray-200 text-sm">
                    {doc.profesional && <CheckIcon />}
                  </td>
                  <td className="p-3 text-center border-b border-gray-200 text-sm">
                    {doc.pengusaha && <CheckIcon />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-600 italic">
          * Properti baru : Surat Pemesanan Rumah. Properti seken : Sertifikat
          IMB, Bukti Lunas PBB Tahun Terakhir.
        </p>
      </div>
    </section>
  );
};

const CheckIcon = () => (
  <div className="text-[#007A70] w-5 h-5 sm:w-6 sm:h-6 mx-auto">
    <IconCheckmark />
  </div>
);

const BadgeCheck = ({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) => (
  <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 border border-gray-200">
    <span className="text-gray-600">{label}</span>
    {checked ? (
      <span className="inline-flex items-center gap-1 text-[#007A70] font-medium">
        <span className="w-4 h-4">
          <IconCheckmark />
        </span>
        <span className="text-xs">Ya</span>
      </span>
    ) : (
      <span className="text-xs text-gray-400">-</span>
    )}
  </div>
);
