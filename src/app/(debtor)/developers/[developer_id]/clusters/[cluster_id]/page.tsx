"use client";

import { useClusterById } from "@/services/clusterServices";
import { useClusterTypes } from "@/services/clusterTypeServices";
import { useDetailDeveloper } from "@/services/developerServices";
import { notFound, useParams } from "next/navigation";
import formatPrice from "@/utils/formatPrice";
import StickyCard from "../_components/StickyCard";
import ClusterHero from "../_components/ClusterHero";
import ClusterImageSlider from "../_components/ClusterImageSlider";
import ClusterDescription from "../_components/ClusterDescription";
import PropertyTypesList from "../_components/PropertyTypesList";
import ClusterFacilities from "../_components/ClusterFacilities";
import ClusterMap from "../_components/ClusterMap";
import ClusterDetailSkeleton from "../_components/ClusterDetailSkeleton";

export default function HousingDetailPage() {
  const params = useParams();
  const developerId = params.developer_id as string;
  const clusterId = params.cluster_id as string;

  const {
    data: cluster,
    isLoading: clusterLoading,
    error: clusterError,
  } = useClusterById(clusterId, true);

  const { data: clusterTypesData, isLoading: typesLoading } = useClusterTypes(
    clusterId,
    !!cluster
  );

  const { data: developer, isLoading: developerLoading } = useDetailDeveloper(
    Number(developerId)
  );

  const clusterDetail = cluster?.data?.clusters?.[0];
  const propertyTypes = clusterTypesData?.data?.clusterTypes || [];

  if (clusterLoading || typesLoading || developerLoading) {
    return <ClusterDetailSkeleton />;
  }

  if (clusterError || !clusterDetail || !developer) {
    return notFound();
  }

  const developerLogo =
    developer?.data?.developer?.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Logo";

  return (
    <div className="min-h-screen">
      <main className="px-4 pt-6 pb-12 md:!px-0 custom-container">
        <ClusterHero
          clusterDetail={clusterDetail}
          propertyTypesCount={propertyTypes.length}
          developerLogo={developerLogo}
          developerId={developerId}
        />

        {/* ===== Konten Utama ===== */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <ClusterImageSlider
              urls={clusterDetail.cluster_photo_urls}
              altText={clusterDetail.name}
            />

            <ClusterDescription description={clusterDetail.description} />

            <div className="mb-6">
              <PropertyTypesList
                propertyTypes={propertyTypes}
                clusterDetail={clusterDetail}
              />
            </div>

            <ClusterFacilities facilities={clusterDetail.facilities} />

            <ClusterMap clusterDetail={clusterDetail} />
          </div>

          {/* Kanan (Sticky) */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-20 lg:space-y-4">
              <StickyCard
                priceLabel="Harga mulai dari"
                price={`Rp ${formatPrice(
                  clusterDetail.minPrice
                )} - Rp ${formatPrice(clusterDetail.maxPrice)}`}
                minPrice={clusterDetail.minPrice}
                developerName={clusterDetail.developerName}
                location={clusterDetail.address || "Alamat tidak tersedia"}
                developerPhotoUrl={developerLogo}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
