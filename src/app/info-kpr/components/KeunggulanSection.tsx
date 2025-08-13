import React from "react";
import { FeatureIconWrapper } from "./FeatureIconWrapper";
import { WalletIcon, TimeIcon, EasyProcessIcon } from "./Icons";

export const KeunggulanSection = () => (
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
);
