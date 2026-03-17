import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GlacierRoute — Every Thread of Your Journey, Perfectly Woven",
  description: "AI-powered trip planning with 8 specialist agents. Plan your perfect Indian or international trip with real-time AI coordination, smart budgeting, and personalized itineraries.",
  keywords: ["trip planner", "AI travel", "India travel", "budget travel", "itinerary planner"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 72px)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
