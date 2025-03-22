"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen  w-full flex justify-center items-center overflow-hidden">
      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transform transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: "url('/pictures/sections-bck.jpg')",
          transform: scrolled ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

      {/* Subtle animated pattern overlay */}
      <div
        className="absolute inset-0 bg-green-900/10 opacity-30"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E\')',
        }}
      ></div>

      {/* Main content */}
      <div className="relative mt-[130px] xl:mt-0 flex flex-col md:flex-row w-11/12 lg:w-9/12 z-10">
        {/* Left Content with staggered animations */}
        <div className="flex-1  text-white space-y-6">
          <h1
            className={`font-extrabold tracking-tight leading-none transform transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <span className="text-5xl md:text-7xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">
              Green Usek
            </span>
          </h1>

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl transform transition-all duration-1000 delay-200 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            Cultivating a greener future through campus innovation and
            sustainability
          </h2>

          <p
            className={`text-lg md:text-xl text-gray-200 max-w-2xl transform transition-all duration-1000 delay-300 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            Together, we're transforming USEK into a model of environmental
            stewardship through student-led initiatives, community engagement,
            and innovative green solutions.
          </p>

          <div
            className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6 transform transition-all duration-1000 delay-400 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group">
              <span>Get Involved</span>
              <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Content with floating animation */}
        <div
          className={`flex-1 flex justify-center items-center pt-12 md:pt-0 transform transition-all duration-1000 delay-500 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Decorative floating circles */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-500/20 rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-green-500/20 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Floating logo with glow effect */}
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl transform scale-110"></div>
              <img
                src="/pictures/earth green_prev_ui.png"
                alt="Green USEK Logo"
                className="relative z-10 max-w-full  drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10  transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-white space-y-2">
          <span className="text-sm font-medium">Scroll Down</span>
          <ChevronDown className="h-6 w-6" />
        </div>
      </div>

      {/* Optional: Add a custom style for the floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
