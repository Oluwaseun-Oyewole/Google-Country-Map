import Sidebar from "@/components/sidebar";
import { dir } from "i18next";
import type { Metadata } from "next";
import Script from "next/script";
import { languages } from "../i18n/settings";
import { lato, poppins } from "./fonts";
import "./globals.css";
import Template from "./template";

export const metadata: Metadata = {
  title: "Weather",
  description: "Get weather details",
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
          className={`${lato.variable} font-lato grid grid-flow-col grid-cols-[max-content_auto] bg-dark overflow-hidden`}
        >
          <Sidebar />
          <div
            className={`${poppins.variable} font-poppins overflow-scroll lg:overflow-hidden h-screen w-full`}
          >
            <div>{children}</div>
          </div>

          <Script
            type="application/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBd0vAku9eywLaQkzxlE0iwFb8aSu9OEyI&libraries=places"
            strategy="beforeInteractive"
          />
        </body>
      </Template>
    </html>
  );
}
