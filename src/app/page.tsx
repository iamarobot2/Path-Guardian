import {
  Navbar,
  Hero,
  Stats,
  Features,
  InteractiveDemo,
  Technology,
  Benefits,
  Market,
  CTA,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <InteractiveDemo />
      <Technology />
      <Benefits />
      <Market />
      <CTA />
      <Footer />
    </div>
  );
}
