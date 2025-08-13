import React from "react";
import Image from "next/image";
import Link from "next/link";

interface JenisFiturItem {
  type: string;
  description: string;
  imageUrl: string;
  link: string | null;
}

interface JenisFiturSectionProps {
  items: JenisFiturItem[];
}

export const JenisFiturSection = ({ items }: JenisFiturSectionProps) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
      Jenis dan Fitur
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, index) => (
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
);
