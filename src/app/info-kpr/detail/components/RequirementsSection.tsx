import { IconFlag, IconUser, IconBriefcase, IconCheckmark } from "./Icons";
import { DOCUMENT_REQUIREMENTS } from "../../constants";

export const RequirementsSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-9 text-gray-800">
        Syarat & Ketentuan Pengajuan
      </h2>

      <div className="bg-white rounded-2xl p-9 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="flex-1 bg-gray-50 p-6 rounded-xl flex items-start gap-5">
            <div className="flex-shrink-0 text-[#007A70] bg-[#E6F2F1] w-12 h-12 rounded-full flex items-center justify-center">
              <IconFlag />
            </div>

            <div>
              <h4 className="m-0 mb-2 text-gray-800 text-lg">
                Kewarganegaraan
              </h4>

              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                Warga Negara Indonesia (WNI) dan berdomisili di Indonesia.
              </p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-6 rounded-xl flex items-start gap-5">
            <div className="flex-shrink-0 text-[#007A70] bg-[#E6F2F1] w-12 h-12 rounded-full flex items-center justify-center">
              <IconUser />
            </div>

            <div>
              <h4 className="m-0 mb-2 text-gray-800 text-lg">Usia Pemohon</h4>

              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                Minimum 21 tahun, maksimal saat kredit lunas:
              </p>

              <ul className="m-0 text-sm text-gray-600 leading-relaxed list-inside list-disc">
                <li>
                  <b>55 tahun</b> (Pegawai)
                </li>

                <li>
                  <b>65 tahun</b> (Profesional & Wiraswasta)
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-6 rounded-xl flex items-start gap-5">
            <div className="flex-shrink-0 text-[#007A70] bg-[#E6F2F1] w-12 h-12 rounded-full flex items-center justify-center">
              <IconBriefcase />
            </div>

            <div>
              <h4 className="m-0 mb-2 text-gray-800 text-lg">
                Status Pekerjaan
              </h4>

              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                Memiliki pekerjaan dan penghasilan tetap:
              </p>

              <ul className="m-0 text-sm text-gray-600 leading-relaxed list-inside list-disc">
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

        <h3 className="text-center font-bold mb-6 text-dark-tosca">
          Persyaratan Dokumen
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
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
                    {doc.pegawai && (
                      <div className="text-[#007A70] w-6 h-6 mx-auto">
                        <IconCheckmark />
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-center border-b border-gray-200 text-sm">
                    {doc.profesional && (
                      <div className="text-[#007A70] w-6 h-6 mx-auto">
                        <IconCheckmark />
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-center border-b border-gray-200 text-sm">
                    {doc.pengusaha && (
                      <div className="text-[#007A70] w-6 h-6 mx-auto">
                        <IconCheckmark />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-600 italic">
          * Properti baru : Surat Pemesanan Rumah. Properti seken : Sertifikat
          IMB, Bukti Lunas PBB Tahun Terakhir.
        </p>
      </div>
    </section>
  );
};
