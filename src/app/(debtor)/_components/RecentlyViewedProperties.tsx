import { useAuth } from "@/contexts/authContext";
import { axiosInstance } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Grid, Row } from "antd";
import Carousel, { CarouselRef } from "antd/es/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import LatestClusterCardSkeleton from "./latestCluster/LatestClusterCardSkeleton";
import PropertyCard from "../search/_components/PropertyCard";
import { ExploreProperty } from "@/types/explore";
import {
  RecentlyViewedPropertiesResponse,
  RecentlyViewedProperty,
} from "@/types/property";
import RecentlyViewedCard from "./RecentlyViewedCard";

const { useBreakpoint } = Grid;

export default function RecentlyViewedProperties() {
  const { user, token } = useAuth();

  const {
    data: properties = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recently-viewed-properties", user?.userId],
    enabled: !!user?.userId && !!token, // hanya fetch jika user & token ada
    queryFn: async () => {
      const res = await axiosInstance.get<RecentlyViewedPropertiesResponse>(
        "/properties/recently-viewed-properties",
        {
          params: { userId: user!.userId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data.recentlyViewedProperties ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const screens = useBreakpoint();
  const isMobile = !screens.md; // < md = mobile
  const SKELETON_COUNT = 4;

  // Carousel ref untuk kontrol panah
  const carouselRef = useRef<CarouselRef | null>(null);

  const slidesLength = isLoading ? SKELETON_COUNT : properties.length;
  const showArrows = isMobile && slidesLength > 1;

  if (properties?.length === 0) {
    return <></>;
  }

  return (
    <>
      <section className="space-y-4 mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary-black">
          Properti yang Baru Saja dilihat
        </h2>

        {/* Mobile: Slider + arrows */}
        {isMobile ? (
          <div className="relative">
            {showArrows && (
              <>
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  onClick={() => carouselRef.current?.prev()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2 hover:shadow-md transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Berikutnya"
                  onClick={() => carouselRef.current?.next()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2 hover:shadow-md transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {isLoading ? (
              <Carousel
                ref={carouselRef}
                dots
                draggable
                infinite={SKELETON_COUNT > 1}
                className="overflow-hidden"
              >
                {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                  <div key={`skeleton-slide-${idx}`} className="px-1">
                    <LatestClusterCardSkeleton />
                  </div>
                ))}
              </Carousel>
            ) : slidesLength > 0 ? (
              <Carousel
                ref={carouselRef}
                dots
                draggable
                infinite={slidesLength > 1}
                className="overflow-hidden"
              >
                {properties.map((property: RecentlyViewedProperty) => (
                  <div key={property.id} className="px-1">
                    <RecentlyViewedCard property={property} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <Empty description="Belum ada data cluster" />
            )}
          </div>
        ) : (
          // Desktop: Grid
          <Row gutter={[24, 24]}>
            {isLoading ? (
              Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <Col key={`skeleton-${idx}`} xs={24} md={8} lg={6}>
                  <LatestClusterCardSkeleton />
                </Col>
              ))
            ) : properties.length > 0 ? (
              properties.map((property: RecentlyViewedProperty) => (
                <Col key={property.id} xs={24} md={8} lg={6}>
                  <RecentlyViewedCard property={property} />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Empty description="Belum ada data cluster" />
              </Col>
            )}
          </Row>
        )}
      </section>
    </>
  );
}
