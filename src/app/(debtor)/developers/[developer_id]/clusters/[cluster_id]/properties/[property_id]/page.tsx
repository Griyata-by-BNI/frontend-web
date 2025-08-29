"use client";

import { useAuth } from "@/contexts/authContext";
import { usePropertyById } from "@/services/propertyServices";
import { axiosInstance } from "@/utils/axios";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useClusterById } from "@/services";
import { useDetailDeveloper } from "@/services/developerServices";
import PropertyDetailSkeleton from "../_components/PropertyDetailSkeleton";
import PropertyHero from "../_components/PropertyHero";
import PropertyImageSlider from "../_components/PropertyImageSlider";
import PropertyDescription from "../_components/PropertyDescription";
import PropertySpecifications from "../_components/PropertySpecifications";
import PropertyKPRSimulator from "../_components/PropertyKPRSimulator";
import PropertyLocation from "../_components/PropertyLocation";
import PropertySidebar from "../_components/PropertySidebar";

export default function DetailPropertyPage() {
  const { user } = useAuth();
  const params = useParams();
  const propertyId = Number(params.property_id);
  const clusterId = String(params.cluster_id);
  const developerId = Number(params.developer_id);

  const { data, isLoading, error } = usePropertyById(propertyId);
  const {
    data: dataCluster,
    isLoading: clusterLoading,
    error: clusterError,
  } = useClusterById(clusterId, true);

  const {
    data: dataDeveloper,
    isLoading: developerLoading,
    error: developerError,
  } = useDetailDeveloper(developerId);

  const cluster = useMemo(() => {
    return dataCluster?.data?.clusters?.[0];
  }, [dataCluster]);

  const developer = useMemo(() => {
    return dataDeveloper?.data?.developer;
  }, [dataDeveloper]);

  const property = useMemo(() => {
    return data?.data;
  }, [data]);

  useEffect(() => {
    if (user && propertyId) {
      axiosInstance
        .post("/properties/recently-viewed-properties", {
          userId: parseInt(user.userId),
          propertyId,
        })
        .catch(console.error);
    }
  }, [user, propertyId]);

  if (isLoading || clusterLoading || developerLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return notFound();
  }

  const developerLogo =
    developer?.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Logo";

  return (
    <div className="min-h-screen">
      <main className="px-4 pt-6 pb-20 md:!px-0 custom-container">
        <PropertyHero
          property={property}
          developer={developer}
          cluster={cluster}
          developerId={developerId}
          clusterId={clusterId}
        />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <PropertyImageSlider
              urls={property.property_photo_urls || []}
              altText={property.name}
            />

            <PropertyDescription description={property.description} />

            <PropertySpecifications property={property} />

            <PropertyKPRSimulator propertyPrice={Number(property.price)} />

            <PropertyLocation property={property} cluster={cluster} />
          </div>

          <PropertySidebar
            property={property}
            propertyId={propertyId}
            userId={user?.userId ? Number(user.userId) : undefined}
            developerLogo={developerLogo}
          />
        </div>
      </main>
    </div>
  );
}
