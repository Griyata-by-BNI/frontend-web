"use client";

import interestRatesData from "@/data/list-interest.json";
import { RequirementsSection } from "./components/RequirementsSection";
import { InterestRateSection } from "./components/InterestRateSection";
import { CTASection } from "./components/CTASection";
import { InterestRatesData } from "../types";

const DetailInfoKprPage = () => {
  return (
    <main className="max-w-5xl mx-auto my-10 px-5 md:my-20">
      <RequirementsSection />

      <InterestRateSection data={interestRatesData as InterestRatesData} />

      <CTASection />
    </main>
  );
};

export default DetailInfoKprPage;
