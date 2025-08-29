"use client";

import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { useDetailDeveloper } from "@/services/developerServices";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import KprToolsSection from "../../_components/KprToolsSection";
import ClusterSearchWrapper from "./_components/ClusterSearchWrapper";
import DeveloperDetailSkeleton from "./_components/DetailDeveloperSkeleton";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = params.developer_id;
  const { data: developerData, isLoading: isDeveloperLoading } =
    useDetailDeveloper(Number(developerId));

  if (isDeveloperLoading) {
    return <DeveloperDetailSkeleton />;
  }

  // ===== Not Found =====
  if (!developerData?.data?.developer) {
    return notFound();
  }

  const developer = developerData.data.developer;
  const logoUrl =
    developer.developerPhotoUrl ||
    "https://via.placeholder.com/250x125.png?text=Developer+Logo";

  return (
    <div className="custom-container min-h-screen py-8">
      <CustomBreadcrumb
        className="mb-3"
        items={[
          { label: " Partner Developer", href: " /developers" },
          {
            label: developer.name,
          },
        ]}
      />

      {/* ===== Hero / Header ===== */}
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br
      from-teal-50 via-white to-indigo-50 shadow-lg shadow-gray-500/10 border border-gray-200 p-6 md:p-10"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Logo card */}

          <Image
            src={logoUrl}
            alt={`${developer.name} logo`}
            width={250}
            height={125}
            className="object-contain"
          />

          {/* Title + About + CTA */}
          <div className="w-full md:max-w-2/3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {developer.name}
            </h1>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {developer.description ||
                "Belum ada deskripsi untuk developer ini."}
            </p>
          </div>
        </div>

        {/* Decorative blob */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-teal-300 to-indigo-300" />
      </div>

      {/* ===== Projects Section ===== */}
      <section id="proyek" className="mt-12">
        <ClusterSearchWrapper
          developerName={developer.name}
          developerId={developer.id}
        />
      </section>

      <section id="tools" className="mt-12">
        <KprToolsSection className="bg-primary-tosca/10" />
      </section>
    </div>
  );
}
