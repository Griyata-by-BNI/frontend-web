"use client";

import React from "react";
import { AboutSection } from "./_components/AboutSection";
import { KeunggulanSection } from "./_components/KeunggulanSection";
import { StatsSection } from "./_components/StatsSection";
import { JenisFiturSection } from "./_components/JenisFiturSection";
import { FaqSection } from "./_components/FaqSection";
import { ContactSection } from "./_components/ContactSection";
import { FAQS } from "./_constants";

const InfoKprPage: React.FC = () => {
  const jenisFitur = [
    {
      type: "Pembelian",
      description:
        "Beli rumah baru atau seken kini lebih mudah dengan KPR Griyata by BNI.",
      imageUrl:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
      link: "/kpr-information/detail",
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

  return (
    <div className="bg-gray-100 font-sans">
      {/* Hero: lebih pendek di mobile, negative margin hanya untuk layar besar */}
      <div className="bg-gradient-to-b from-teal-500 to-teal-600 text-center py-12 sm:py-16 lg:py-20 lg:-mt-12 lg:-mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Griyata by BNI
        </h1>
      </div>

      {/* About */}
      <div className="custom-container px-4 sm:px-6 lg:px-0">
        <AboutSection />
      </div>

      {/* Keunggulan + Stats + Jenis Fitur */}
      <div className="custom-container px-4 sm:px-6 lg:px-0 !py-0 mt-6 sm:mt-8 lg:mt-10 mb-8 sm:mb-10 rounded-2xl overflow-clip border border-gray-200 shadow-lg shadow-gray-500/5">
        <KeunggulanSection />

        <StatsSection />

        <div className="bg-white p-4 sm:p-6">
          <JenisFiturSection items={jenisFitur} />
        </div>
      </div>

      {/* FAQ */}
      <div className="custom-container px-4 sm:px-6 lg:px-0 !py-0">
        <FaqSection faqData={FAQS} />
      </div>

      {/* Contact */}
      <div className="custom-container px-4 sm:px-6 lg:px-0 !py-0 mb-8 sm:mb-10">
        <ContactSection />
      </div>
    </div>
  );
};

export default InfoKprPage;
