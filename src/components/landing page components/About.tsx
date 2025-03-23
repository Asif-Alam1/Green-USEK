"use client";

import React, { useState, useEffect } from "react";
import {
  Leaf,
  Users,
  Lightbulb,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const AboutUsSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0); // State to track scroll position

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveSlide((prev) =>
        prev === teamMembers.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll); // Clean up event listener
    };
  }, []);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Environmental Coordinator",
      image:
        "https://www.edarabia.com/wp-content/uploads/2013/07/holy-spirit-university-of-kaslik-lebanon-logo.jpg",
      quote:
        "Sustainability isn't just a goal, it's our way of life at Green USEK.",
    },
    {
      name: "Michael Chen",
      role: "Community Outreach Director",
      image:
        "https://www.edarabia.com/wp-content/uploads/2013/07/holy-spirit-university-of-kaslik-lebanon-logo.jpg",
      quote:
        "Together we create a greener campus and a more sustainable future.",
    },
    {
      name: "Leila Kassab",
      role: "Student Initiative Leader",
      image:
        "https://www.edarabia.com/wp-content/uploads/2013/07/holy-spirit-university-of-kaslik-lebanon-logo.jpg",
      quote:
        "Every small action contributes to our collective impact on campus.",
    },
  ];

  const initiatives = [
    {
      title: "Campus Recycling Program",
      description:
        "Implemented comprehensive waste separation systems across all university facilities",
      icon: <Leaf className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Solar Panel Installation",
      description:
        "Reduced carbon footprint by 45% through renewable energy infrastructure",
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: "Community Garden",
      description:
        "Student-managed organic garden providing fresh produce to campus kitchens",
      icon: <Heart className="h-8 w-8 text-red-500" />,
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const parallaxFactor = 0.1; // Adjust this value to control the parallax intensity

  return (
    <div className="py-16 w-full flex justify-center bg-gradient-to-t from-green-100 to-green-50">
      <div className="flex flex-col justify-center w-11/12 lg:w-9/12 space-y-16">
        {/* Header with animated reveal */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl font-bold text-center text-green-800 mb-4">
            Take a minute to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">get to know us</span>
              <span className=" hidden md:block absolute -bottom-1 left-0 w-full h-2 bg-green-200 -z-0"></span>
            </span>
          </h1>

          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Green USEK is a student-led environmental initiative dedicated to
            transforming our campus into a sustainable ecosystem and inspiring
            eco-conscious communities.
          </p>
        </div>

        {/* Mission Statement with Parallax-like effect */}
        <div className="relative overflow-hidden rounded-2xl bg-green-700 text-white p-12 shadow-xl">
          <div
            className="absolute -top-16 right-0 -mt-8 -mr-8 h-32 w-32 bg-green-500 rounded-full opacity-50"
            style={{
              transform: `translateY(${scrollPosition * parallaxFactor}px)`,
            }} // Parallax effect for top-right circle
          ></div>
          <div
            className="absolute -bottom-20 left-0 -mb-8 -ml-8 h-32 w-32 bg-green-500 rounded-full opacity-50"
            style={{
              transform: `translateY(-${scrollPosition * parallaxFactor}px)`,
            }} // Parallax effect for bottom-left circle
          ></div>

          <h2 className="text-3xl font-bold mb-6 relative z-10">Our Mission</h2>
          <p className="text-lg mb-8 max-w-3xl relative z-10">
            We strive to create a sustainable campus environment through
            innovative green initiatives, education, and community engagement.
            Our goal is to reduce our ecological footprint while fostering a
            culture of environmental responsibility among students, faculty, and
            staff.
          </p>
          <div className="flex items-center space-x-4 relative z-10">
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">
              Join over 1,500 students in our green movement
            </span>
          </div>
        </div>

        {/* Key Initiatives Section with Animated Cards */}
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Our Initiatives
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-green-400"
              >
                <div className="mb-4 bg-green-50 rounded-full w-16 h-16 flex items-center justify-center">
                  {initiative.icon}
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {initiative.title}
                </h3>
                <p className="text-gray-600">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Carousel */}
        <div
          className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Meet Our Team
          </h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {teamMembers.map((member, index) => (
                  <div key={index} className="min-w-full">
                    <div className="flex flex-col md:flex-row items-center bg-white rounded-xl overflow-hidden shadow-l">
                      <div className="md:w-1/3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-64 md:h-80 object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-8">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-green-700">
                            {member.name}
                          </h3>
                          <p className="text-green-500 font-medium">
                            {member.role}
                          </p>
                        </div>
                        <p className="text-xl italic text-gray-600 mb-6">
                          "{member.quote}"
                        </p>
                        <div className="hidden md:block">
                          <p className="text-gray-600">
                            Passionate about environmental sustainability and
                            community engagement, {member.name.split(" ")[0]}{" "}
                            leads initiatives that have transformed our campus
                            and inspired countless students to join our cause.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-green-50 transition-colors duration-300"
            >
              <ChevronLeft className="h-6 w-6 text-green-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-green-50 transition-colors duration-300"
            >
              <ChevronRight className="h-6 w-6 text-green-700" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                    activeSlide === index ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-800 rounded-2xl p-10 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-6">
            Join The Green Movement Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're passionate about climate action, sustainability, or
            simply want to make a difference, there's a place for you in our
            community.
          </p>
          <Link href='/#contact' className="bg-white text-green-800 hover:bg-green-100 font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg transform hover:scale-105">
            Get Involved
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
