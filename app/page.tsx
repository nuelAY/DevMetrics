import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { NeuralIndexing } from "@/components/NeuralIndexing";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <FeatureShowcase />
      <NeuralIndexing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
