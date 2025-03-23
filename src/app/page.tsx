import React from "react";
import HeroSection from "@/components/landing page components/Hero";
import AboutUsSection from "@/components/landing page components/About";
import RecentBlogPosts from "@/components/landing page components/RecentBlogPosts";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <AboutUsSection />
      <RecentBlogPosts />
    </div>
  );
};

export default HomePage;