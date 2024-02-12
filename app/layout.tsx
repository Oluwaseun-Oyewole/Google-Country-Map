import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import type { Metadata } from "next";
import Script from "next/script";
import { lato, poppins } from "./fonts";
import "./globals.css";
import Template from "./template";

export const metadata: Metadata = {
  title: "Weather",
  description: "Get weather details",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Template>
        <body
          className={`${lato.variable} font-lato grid grid-flow-col grid-cols-[max-content_auto] items-start bg-dark  relative overflow-hidden`}
        >
          <Sidebar />
          <div className={`${poppins.variable} font-poppins`}>
            <Header /> <div>{children}</div>
          </div>

          <Script
            type="application/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXqsbttMeW0CjxvTvIzi3_z5wlq74MKyA&libraries=places"
            strategy="beforeInteractive"
          />
        </body>
      </Template>
    </html>
  );
}
