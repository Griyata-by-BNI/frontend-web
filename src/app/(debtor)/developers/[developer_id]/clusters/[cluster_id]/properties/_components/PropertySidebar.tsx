"use client";

import Link from "next/link";
import StickyCard from "../../../_components/StickyCard";
import FavoriteButton from "@/components/FavoriteButton";
import { useAuth } from "@/contexts/authContext";

interface PropertySidebarProps {
  property: any;
  propertyId: number;
  userId?: number;
  developerLogo: string;
}

export default function PropertySidebar({
  property,
  propertyId,
  userId,
  developerLogo,
}: PropertySidebarProps) {
  const { user } = useAuth();
  const applyHref = `/kpr-apply?property_id=${propertyId}`;

  return (
    <aside className="lg:col-span-1 mt-8 lg:mt-0">
      {/* Desktop: sidebar sticky */}
      <div className="lg:sticky lg:top-20 lg:space-y-4">
        <StickyCard
          priceLabel="Harga"
          price={`Rp ${Intl.NumberFormat("id-ID").format(
            Number(property.price) || 0
          )}`}
          minPrice={property.price}
          stock={property.stock}
          developerName={property.developerName}
          location={property.collateralAddress || "Alamat tidak tersedia"}
          developerPhotoUrl={developerLogo}
        />

        {/* CTA di dalam sidebar hanya ditampilkan di desktop */}

        <div className="hidden lg:flex gap-3">
          <Link
            href={user ? applyHref : "/redirect"}
            className="flex-1 cursor-pointer"
            aria-label="Ajukan KPR"
          >
            <button className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-lg font-semibold rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg">
              Ajukan KPR
            </button>
          </Link>

          {user ? (
            <FavoriteButton propertyId={property.id} userId={userId} />
          ) : (
            <Link href="/redirect" className="cursor-pointer">
              <FavoriteButton propertyId={property.id} userId={userId} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile: floating action bar di bawah */}

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="px-6 py-3 flex items-center gap-3">
          <Link
            href={user ? applyHref : "/redirect"}
            className="flex-1"
            aria-label="Ajukan KPR"
          >
            <button className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg">
              Ajukan KPR
            </button>
          </Link>

          {user ? (
            <FavoriteButton propertyId={property.id} userId={userId} />
          ) : (
            <Link href="/redirect" className="cursor-pointer">
              <FavoriteButton propertyId={property.id} userId={userId} />
            </Link>
          )}
        </div>
      </div>

      {/* Spacer agar konten tidak ketutup floating bar di mobile */}
      <div className="h-16 lg:hidden" />
    </aside>
  );
}
