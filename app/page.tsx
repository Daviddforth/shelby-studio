import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import ProductPreview from "@/components/landing/ProductPreview";
import PlatformOverview from "@/components/landing/PlatformOverview";
import Workflow from "@/components/landing/Workflow";
import DeveloperPreview from "@/components/landing/DeveloperPreview";
import WhyShelbyStudio from "@/components/landing/WhyShelbyStudio";
import CTA from "@/components/landing/CTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />

      <Hero />

      <ProductPreview />

      <PlatformOverview />

      <Workflow />

      <DeveloperPreview />

      <WhyShelbyStudio />

      <CTA />

      <LandingFooter />
    </main>
  );
}
