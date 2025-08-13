"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const FeatureIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center h-16 w-16 bg-teal-50 rounded-full mb-4">
    {children}
  </div>
);

const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8 text-teal-600"
  >
    <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.032z" />
  </svg>
);

const TimeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-teal-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const EasyProcessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-teal-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 text-teal-500 transition-transform duration-300 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const BniGriyaSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const element = textRef.current;
      if (element) {
        if (element.scrollHeight > element.clientHeight) {
          setIsOverflowing(true);
        } else {
          setIsOverflowing(false);
        }
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Griyata by BNI</h2>
      <p
        ref={textRef}
        className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ${
          isExpanded ? "max-h-96" : "max-h-10 overflow-hidden"
        }`}
      >
        Nikmati kemudahan memenuhi berbagai kebutuhan finansial Anda melalui
        fasilitas pembiayaan konsumtif beragunan properti rumah. Dengan
        fleksibilitas tinggi, layanan ini dapat digunakan untuk pembelian rumah
        baru, pembangunan atau renovasi, take over KPR dari bank lain, hingga
        refinancing untuk tambahan dana tunai. Keunggulannya? Proses cepat,
        transparan, dan terintegrasi dengan platform digital, memastikan Anda
        dapat mengajukan pembiayaan dengan aman dan efisien—kapan saja, di mana
        saja. Rumah Anda bukan hanya tempat tinggal, tapi juga aset yang bisa
        mewujudkan rencana masa depan.
      </p>
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-teal-600 font-semibold mt-3 text-sm hover:text-teal-700"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left py-4"
    >
      <span className="font-semibold text-teal-600 pr-4">{question}</span>
      <ChevronDownIcon isOpen={isOpen} />
    </button>
    <div
      className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <p className="text-gray-600 text-sm leading-relaxed pb-4">{answer}</p>
      </div>
    </div>
  </div>
);

const InfoKprPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "Properti apa saja yang bisa dijadikan agunan?",
      answer:
        "Jenis properti yang dapat dijadikan jaminan meliputi rumah tapak sebagai hunian utama, rumah susun, atau apartemen.",
    },
    {
      question: "Berapa maksimal plafon kredit yang bisa diajukan?",
      answer:
        "Plafon kredit BNI Griya dapat mencapai hingga Rp 20 miliar, disesuaikan dengan nilai properti dan kemampuan membayar kembali.",
    },
    {
      question: "Siapa saja yang bisa mengajukan KPR di BNI?",
      answer:
        "Pengajuan KPR BNI dapat dilakukan oleh Warga Negara Indonesia berusia minimal 21 tahun. Saat kredit lunas, usia maksimal adalah 55 tahun atau sesuai usia pensiun untuk pegawai/karyawan, dan 65 tahun untuk wiraswasta atau profesional.",
    },
    {
      question: "Berapa lama tenor pembiayaan KPR di BNI?",
      answer:
        "Tenor pembiayaan untuk pembelian rumah tinggal baik baru maupun seken dapat mencapai hingga 30 tahun.",
    },
  ];

  const jenisFitur = [
    {
      type: "Pembelian",
      description:
        "Beli rumah baru atau seken kini lebih mudah dengan KPR Griyata by BNI.",
      imageUrl:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
      link: "/info-kpr/detail",
    },
    {
      type: "Pembangunan",
      description:
        "Bangun rumah impianmu dari nol dengan dukungan KPR Griyata by BNI.",
      imageUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      link: null,
    },
    {
      type: "Take Over",
      description:
        "Cicilan KPR di bank lain terasa berat? Pindah ke Griyata by BNI dan nikmati kemudahan take over.",
      imageUrl:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
      link: null,
    },
    {
      type: "Refinancing",
      description:
        "Butuh dana tambahan untuk beli rumah? Griyata by BNI Refinancing siap membantu.",
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      link: null,
    },
    {
      type: "KPR Cermat",
      description:
        "Jaga Saldo Rata-Rata Harian (SRH) di tabungan dan nikmati diskon suku bunga KPR lewat KPR Cermat.",
      imageUrl:
        "https://images.unsplash.com/photo-1579621970795-87facc2f976d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      link: null,
    },
  ];

  const handleFaqClick = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="container p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Informasi KPR
        </h1>

        <BniGriyaSection />

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
            Keunggulan
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center p-2">
              <FeatureIconWrapper>
                <WalletIcon />
              </FeatureIconWrapper>
              <p className="font-semibold text-gray-800 text-sm leading-tight">
                Suku Bunga Ringan
              </p>
            </div>
            <div className="flex flex-col items-center p-2">
              <FeatureIconWrapper>
                <TimeIcon />
              </FeatureIconWrapper>
              <p className="font-semibold text-gray-800 text-sm leading-tight">
                Tenor Hingga 30 Tahun
              </p>
            </div>
            <div className="flex flex-col items-center p-2">
              <FeatureIconWrapper>
                <EasyProcessIcon />
              </FeatureIconWrapper>
              <p className="font-semibold text-gray-800 text-sm leading-tight">
                Proses Mudah & Cepat
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Jenis dan Fitur
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jenisFitur.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.type} KPR`}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="bg-teal-100 text-teal-700 text-xs font-bold mr-2 px-2.5 py-1 rounded-full self-start">
                    {item.type}
                  </span>
                  <p className="text-sm text-gray-700 mt-3 flex-grow">
                    {item.description}
                  </p>
                  <div className="mt-2">
                    {item.link ? (
                      <Link
                        href={item.link}
                        className="text-sm text-teal-600 font-semibold hover:underline self-start"
                      >
                        Click for more info →
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-500 font-semibold self-start">
                        Coming Soon →
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">FAQs</h2>
          <div>
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                {...faq}
                isOpen={openFaqIndex === index}
                onClick={() => handleFaqClick(index)}
              />
            ))}
          </div>
        </div>

        <div className="bg-teal-600 text-white rounded-xl shadow-lg p-6 text-center">
          <p className="font-light text-sm">Butuh informasi lebih lanjut?</p>
          <h3 className="text-2xl font-bold mt-1">BNI Call - 1500046</h3>
        </div>
      </div>
    </div>
  );
};

export default InfoKprPage;
