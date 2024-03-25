import { languages } from "@/app/i18n/settings";
import { dir } from "i18next";
import type { Metadata } from "next";
import Script from "next/script";
import { poppins } from "../fonts";
import "../globals.css";
import Template from "../template";

export const metadata: Metadata = {
  title: "Weather",
  description: "Get weather details",
  // manifest: "/manifest.json",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: {
    lng: string;
  };
}>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <Template>
        <body
          className={`${poppins.variable} font-poppins h-[100vh] overflow-hidden`}
        >
          {children}

          <Script
            type="application/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`}
            strategy="beforeInteractive"
          />
        </body>
      </Template>
    </html>
  );
}
