"use client";

import React, { useState, useRef, useEffect } from "react";

export const BniGriyaSection = () => {
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
        Fasilitas pembiayaan konsumtif beragunan properti rumah tinggal yang
        dapat digunakan untuk tujuan pembelian, pembangunan/renovasi, take over,
        refinancing, dan lain-lain. Fleksibilitas ini memungkinkan nasabah untuk
        memenuhi berbagai kebutuhan finansial dengan jaminan properti yang
        dimiliki.
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
