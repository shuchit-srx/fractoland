import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import LoginSelection from "@/components/landing/LoginSelection";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="investors">
          <LoginSelection />
        </section>
        <section id="trust">
          <TrustSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
