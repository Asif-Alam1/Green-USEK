import React from "react";
import HeroSection from "@/components/landing page components/Hero";
import AboutUsSection from "@/components/landing page components/About";
import RecentBlogPosts from "@/components/landing page components/RecentBlogPosts";
import ContactFormSection from "@/components/landing page components/ContactFormSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <AboutUsSection />
      <RecentBlogPosts />
      <ContactFormSection />
    </div>
  );
};

export default HomePage;