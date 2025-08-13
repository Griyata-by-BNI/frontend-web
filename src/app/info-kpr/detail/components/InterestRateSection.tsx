import { useState } from "react";
import { InterestRatesData, TabType, RateTypeId } from "../../types";
import { InterestRateTable } from "./InterestRateTable";
import { InterestRateModal } from "./InterestRateModal";
import { IconInfo } from "./Icons";

interface InterestRateSectionProps {
  data: InterestRatesData;
}

export const InterestRateSection = ({ data }: InterestRateSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("single-fixed");
  const [selectedRateType, setSelectedRateType] = useState<RateTypeId>("A");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-9 text-gray-800">
          Pilihan Suku Bunga
        </h2>
        <div className="bg-white rounded-2xl p-9 shadow-lg md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {data.rateTypes.map((type) => (
              <button
                key={type.id}
                className={`p-3 border-2 rounded-lg cursor-pointer text-left transition-all duration-200 font-semibold text-sm hover:border-[#007A70] ${
                  selectedRateType === type.id
                    ? "border-[#007A70] bg-[#E6F2F1] text-[#007A70]"
                    : "border-gray-200 bg-transparent text-gray-600"
                }`}
                onClick={() => setSelectedRateType(type.id as RateTypeId)}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-8 bg-gray-50 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-5 cursor-pointer border-none rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "single-fixed"
                  ? "bg-[#007A70] text-white"
                  : "bg-transparent text-gray-600"
              }`}
              onClick={() => setActiveTab("single-fixed")}
            >
              Single Fixed
            </button>
            <button
              className={`flex-1 py-2 px-5 cursor-pointer border-none rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "fixed-berjenjang"
                  ? "bg-[#007A70] text-white"
                  : "bg-transparent text-gray-600"
              }`}
              onClick={() => setActiveTab("fixed-berjenjang")}
            >
              Fixed Berjenjang
            </button>
          </div>

          {activeTab === "single-fixed" && (
            <InterestRateTable
              data={data.singleFixed}
              selectedRateType={selectedRateType}
              type="single"
            />
          )}

          {activeTab === "fixed-berjenjang" && (
            <InterestRateTable
              data={data.fixedBerjenjang}
              selectedRateType={selectedRateType}
              type="berjenjang"
            />
          )}

          <div className="mt-5 border-t-2 border-dashed border-gray-200 pt-5 grid grid-cols-[150px_1fr] gap-2 text-sm">
            <strong className="font-semibold text-gray-600">
              Provisi
            </strong>
            <span>{data.fees.provisi}</span>
            <strong className="font-semibold text-gray-600">
              Administrasi
            </strong>
            <span>{data.fees.administrasi}</span>
          </div>
        </div>
        <div className="text-center mt-6">
          <button
            className="bg-none border-none text-[#007A70] font-semibold cursor-pointer text-sm inline-flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <IconInfo />
            Lihat Syarat & Ketentuan Suku Bunga
          </button>
        </div>
      </section>

      <InterestRateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};