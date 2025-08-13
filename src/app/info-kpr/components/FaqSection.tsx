"use client";

import React, { useState } from "react";
import { FaqItem } from "./FaqItem";

interface FaqData {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqData: FaqData[];
}

export const FaqSection = ({ faqData }: FaqSectionProps) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
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
  );
};
