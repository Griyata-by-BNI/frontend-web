import {
  BadgePercent,
  HelpCircle,
  Info,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KPRAffordability } from "./_components/KPRAffordability";

export default function KprAffordabilityPage() {
  return (
    <div className="bg-light-tosca">
      <main className="custom-container py-6 md:py-10 px-4 md:px-0">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-teal-50 via-white to-indigo-50 p-6 md:p-10 shadow-lg shadow-gray-500/10 mb-8">
          <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />

          <div className="flex items-start gap-8">
            <div className="hidden md:flex h-30 aspect-square items-center justify-center rounded-xl">
              <Image
                width={100}
                height={100}
                alt="icon"
                className="h-full w-full"
                src="/images/loan-home.png"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Cek Kemampuan KPR
              </h1>
              <p className="mt-2 text-gray-600">
                Temukan harga rumah yang sesuai dengan kemampuan finansial Anda!
              </p>

              {/* badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-3 py-1 text-sm font-semibold text-teal-800 border border-teal-200">
                  <Target className="h-4 w-4" /> Rekomendasi harga tepat
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-sm font-semibold text-indigo-800 border border-indigo-200">
                  <BadgePercent className="h-4 w-4" /> Hitung DP & cicilan
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3 py-1 text-sm font-semibold text-amber-800 border border-amber-200">
                  <ShieldCheck className="h-4 w-4" /> Sesuai best practice
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left: Affordability Tool */}
          <div className="lg:col-span-2">
            <KPRAffordability />
          </div>

          {/* Right: Tips & FAQ */}
          <aside className="mt-8 lg:mt-0 space-y-4">
            {/* Tips Cepat */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-teal-600" />
                <h2 className="text-base md:text-lg font-bold text-gray-900">
                  Tips Cepat
                </h2>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>
                  Batasi total cicilan ≤{" "}
                  <span className="font-semibold">
                    35%–40% dari penghasilan
                  </span>
                  .
                </li>
                <li>Sesuaikan DP untuk menekan cicilan dan total bunga.</li>
              </ul>
            </div>

            {/* Catatan & Asumsi */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base md:text-lg font-bold text-gray-900">
                  Catatan
                </h2>
              </div>
              <p className="text-sm text-gray-700">
                Hasil bersifat indikatif dan bisa berbeda dengan penawaran bank.
                Biaya provisi, administrasi, notaris, asuransi, dan PPN/BPHTB
                mungkin belum seluruhnya termasuk.
              </p>
            </div>

            {/* FAQ Ringkas */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                <h2 className="text-base md:text-lg font-bold text-gray-900">
                  FAQ Singkat
                </h2>
              </div>
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-800 group-open:text-teal-700">
                  Bagaimana menentukan DP ideal?
                </summary>
                <p className="mt-1 text-sm text-gray-700">
                  Umumnya 10%–20% dari harga rumah. DP lebih besar → cicilan &
                  bunga total lebih kecil.
                </p>
              </details>
              <details className="group mt-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-800 group-open:text-teal-700">
                  Kenapa pengajuan bisa ditolak meski simulasi lolos?
                </summary>
                <p className="mt-1 text-sm text-gray-700">
                  Bank menilai riwayat kredit, stabilitas penghasilan, rasio
                  utang, dan appraisal aset—faktor di luar kalkulasi simulasi.
                </p>
              </details>
            </div>
          </aside>
        </section>

        {/* CTA bawah (opsional) */}
        {/* <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
          <p className="text-sm text-gray-700">
            Butuh bantuan membaca hasil simulasi? Tim kami siap membantu.
          </p>
          <Link
            href="/hubungi-kami"
            className="ml-0 md:ml-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2 !text-white text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition"
          >
            Konsultasi Gratis
          </Link>
        </div> */}
      </main>
    </div>
  );
}
