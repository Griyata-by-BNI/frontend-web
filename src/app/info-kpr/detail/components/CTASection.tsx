export const CTASection = () => {
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl flex flex-col">
          <div>
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
              alt="Keluarga bahagia di rumah baru"
              className="w-full h-56 object-cover block"
            />
          </div>

          <div className="p-6 text-center flex flex-col flex-grow">
            <h3 className="text-2xl font-bold text-[#007A70] m-0 mb-2">
              Cek Kemampuan KPR-mu
            </h3>

            <p className="text-gray-600 text-sm m-0 mb-6 flex-grow">
              Hitung dulu estimasi KPR yang bisa kamu dapatkan di sini. Sebuah
              langkah awal untuk wujudkan rumah impianmu bersama BNI.
            </p>

            <a
              href="#"
              className="block w-full bg-[#27C5B8] text-white py-3 px-6 rounded-lg no-underline font-bold text-base transition-all duration-200 ease-in-out hover:bg-[#21b3a6] hover:scale-105 mt-auto"
            >
              Cek Sekarang!
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl flex flex-col">
          <div>
            <img
              src="https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1964&auto=format&fit=crop"
              alt="Proses pindah rumah yang mudah"
              className="w-full h-56 object-cover block"
            />
          </div>

          <div className="p-6 text-center flex flex-col flex-grow">
            <h3 className="text-2xl font-bold text-[#007A70] m-0 mb-2">
              Ajukan KPR Anti Ribet
            </h3>

            <p className="text-gray-600 text-sm m-0 mb-6 flex-grow">
              Ajukan KPRmu dengan mudah di manapun dan kapanpun.
            </p>

            <a
              href="#"
              className="block w-full bg-[#27C5B8] text-white py-3 px-6 rounded-lg no-underline font-bold text-base transition-all duration-200 ease-in-out hover:bg-[#21b3a6] hover:scale-105 mt-auto"
            >
              Ajukan KPR
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
