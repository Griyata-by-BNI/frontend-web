import React from "react";
import { ChevronDownIcon } from "./Icons";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export const FaqItem: React.FC<FaqItemProps> = ({
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
