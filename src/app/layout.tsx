// app/layout.tsx
import "@ant-design/v5-patch-for-react-19";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/queryClient";
import ProgressProvider from "@/providers/progressProvider";
import { AuthProvider } from "@/contexts/authContext";
import QueryProgress from "@/components/QueryProgress";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Griyata by BNI",
  description:
    "Griyata by BNI adalah solusi digital inovatif yang memudahkan masyarakat Indonesia dalam mencari, memilih, dan mengajukan KPR untuk properti impian. Dengan dukungan teknologi terdepan dan pengalaman BNI sebagai bank terpercaya, kami hadir untuk mewujudkan mimpi memiliki rumah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
      >
        <QueryProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#30a5a2",
                fontFamily: "var(--font-jakarta), sans-serif",
              },
              components: {
                Table: {
                  headerBg: "#efefef",
                  borderColor: "#dfdfdf",
                },
              },
            }}
          >
            <AntdRegistry>
              <App>
                <ProgressProvider>
                  <AuthProvider>
                    {children}

                    <QueryProgress />
                  </AuthProvider>
                </ProgressProvider>
              </App>
            </AntdRegistry>
          </ConfigProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
