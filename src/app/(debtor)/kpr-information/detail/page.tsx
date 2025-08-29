"use client";

import interestRatesData from "@/data/list-interest.json";
import { RequirementsSection } from "./components/RequirementsSection";
import { InterestRateSection } from "./components/InterestRateSection";
import { CTASection } from "./components/CTASection";
import { InterestRatesData } from "../_types";

const DetailInfoKprPage = () => {
  return (
    <main
      className="
        mx-auto
        w-full
        max-w-screen-lg lg:max-w-screen-xl
        px-4 sm:px-6 lg:px-8
        pt-16 md:pt-24
        pb-8 md:pb-12
      "
    >
      {/* Spasi vertikal adaptif antar section */}
      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <RequirementsSection />

        <InterestRateSection data={interestRatesData as InterestRatesData} />

        <CTASection />
      </div>
    </main>
  );
};

export default DetailInfoKprPage;
