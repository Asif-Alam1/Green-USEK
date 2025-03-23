import React from "react";
import HeroSection from "@/components/landing page components/Hero";
import AboutUsSection from "@/components/landing page components/About";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <AboutUsSection />
    </div>
  );
};

export default HomePage;
