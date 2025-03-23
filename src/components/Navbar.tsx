"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Home, BookOpen,
  MessageSquare, Leaf, ExternalLink,
  ArrowRight, Globe, Tag, Sparkles, FileBarChart2
} from "lucide-react";
import { config } from "@/config";
import { wisp } from "@/lib/wisp";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [popularCategories, setPopularCategories] = useState<{id: string; name: string; label: string; postCount: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const blogDropdownRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  // Fetch popular categories similar to categories page
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const tagsResult = await wisp.getTags();

        // Create a combined list with post counts
        const categoriesWithCounts = await Promise.all(
          tagsResult.tags.map(async (tag) => {
            try {
              // Get post count by fetching posts for this tag
              const postsResult = await wisp.getPosts({
                tags: [tag.name],
                limit: 1, // We only need count information
              });

              // Find matching config category for better labeling
              const configCategory = config.categories.find(c => c.tag === tag.name);

              return {
                id: tag.id,
                name: tag.name,
                label: configCategory?.label || tag.name,
                postCount: postsResult.pagination.totalPosts
              };
            } catch (error) {
              console.error(`Error fetching post count for ${tag.name}:`, error);
              return {
                id: tag.id,
                name: tag.name,
                label: tag.name,
                postCount: 0
              };
            }
          })
        );

        // Sort by post count and filter for popular ones
        const sorted = categoriesWithCounts
          .sort((a, b) => b.postCount - a.postCount)
          .filter(cat => cat.postCount > 0)
          .slice(0, 5);

        setPopularCategories(sorted);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle scroll event with enhanced threshold
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);

        // Apply parallax effect to navbar background
        if (navbarRef.current) {
          const parallaxValue = Math.min(30, offset * 0.05);
          navbarRef.current.style.backgroundPosition = `calc(50% + ${parallaxValue}px) 50%`;
        }
      } else {
        setScrolled(false);
        if (navbarRef.current) {
          navbarRef.current.style.backgroundPosition = '50% 50%';
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle blog dropdown toggle
  const toggleBlogDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBlogDropdownOpen(!blogDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        blogDropdownRef.current &&
        !blogDropdownRef.current.contains(event.target as Node)
      ) {
        setBlogDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu and dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setBlogDropdownOpen(false);
  }, [pathname]);

  // Smooth scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('recent-blogs-section')?.nextElementSibling;
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    } else if (pathname !== '/') {
      window.location.href = '/#contact';
    }
  };

  return (
    <header
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        ${scrolled
          ? "h-16 md:h-20"
          : "h-20 md:h-28"}
        bg-gradient-to-r from-green-900 via-green-700 to-green-800 before:absolute before:inset-0 before:bg-[url('/pictures/noise.png')] before:opacity-10 before:bg-repeat
      `}
      style={{ backgroundSize: '200% 200%' }}
    >
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic SVG wave background */}
        <div className="absolute inset-0 opacity-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full transform-gpu transition-all duration-1000"
            style={{
              transform: scrolled ? 'translateY(8%) scale(1.1)' : 'translateY(0) scale(1)',
            }}
          >
            <path
              fill="rgba(0, 255, 100, 0.2)"
              d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Glowing orb */}
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-green-300 opacity-20 blur-2xl"
          style={{
            transform: scrolled ? 'translateX(10px) scale(0.8)' : 'translateX(0) scale(1)',
            transition: 'transform 1s ease-out',
          }}
        />
      </div>

      <div className="relative h-full w-11/12 lg:w-10/12 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-3 relative z-10">
          <div
            className={`transform transition-all duration-500
              ${scrolled ? "scale-75" : "scale-100"}
            `}
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              {/* Animated ring around logo */}
              <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-300/20 animate-[spin_18s_linear_infinite_reverse]" />

              {/* Logo container with glow effect */}
              <div className="absolute inset-1 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/50 via-green-600/30 to-green-800/50 animate-pulse-slow" />
                <img
                  src="/pictures/usek logo_prev_ui.png"
                  alt="Green USEK logo"
                  className="relative w-full h-full object-cover p-0.5"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline">
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-100 to-green-300">
                GREEN <span className="text-white">USEK</span>
              </h1>
              <Sparkles className="h-3.5 w-3.5 ml-1 text-green-300 animate-pulse" />
            </div>
            <span className="text-green-100/60 text-xs tracking-wider uppercase">
              Sustainability Initiative
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/"
            onMouseEnter={() => setHoverIndex(0)}
            onMouseLeave={() => setHoverIndex(null)}
            className={`group relative px-5 py-2 text-white rounded-lg overflow-hidden transition-all duration-300
              ${pathname === '/' ? 'font-semibold' : 'font-medium'}
            `}
          >
            {/* Hover background effect */}
            <span
              className={`absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 transform transition-transform duration-300
                ${hoverIndex === 0 || pathname === '/' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
              `}
            />

            {/* Active indicator */}
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-300 to-green-400" />
            )}

            <span className="relative z-10 flex items-center space-x-1.5">
              <Home className={`transition-transform duration-300 ${hoverIndex === 0 ? 'scale-110' : 'scale-100'}`} />
              <span>Home</span>
            </span>
          </Link>

          {/* Blog dropdown */}
          <div
            className="relative"
            ref={blogDropdownRef}
            onMouseEnter={() => setHoverIndex(1)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <button
              onClick={toggleBlogDropdown}
              className={`group relative px-5 py-2 text-white rounded-lg overflow-hidden transition-all duration-300
                ${pathname.includes('/category') || pathname.includes('/post') ? 'font-semibold' : 'font-medium'}
              `}
            >
              {/* Hover background effect */}
              <span
                className={`absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 transform transition-transform duration-300
                  ${hoverIndex === 1 || blogDropdownOpen || pathname.includes('/category') || pathname.includes('/post')
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0'}
                `}
              />

              {/* Active indicator */}
              {(pathname.includes('/category') || pathname.includes('/post')) || pathname.includes('/blogs') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-300 to-green-400" />
              )}

              <span className="relative z-10 flex items-center space-x-1.5">
                <BookOpen className={`transition-transform duration-300 ${hoverIndex === 1 ? 'scale-110' : 'scale-100'}`} />
                <span>Blog</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${blogDropdownOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* Dropdown menu */}
            <div
              className={`absolute right-0 mt-2 w-72 transition-all duration-300 origin-top-right ease-out
                ${blogDropdownOpen
                  ? 'transform scale-100 opacity-100 translate-y-0'
                  : 'transform scale-95 opacity-0 translate-y-4 pointer-events-none'}
              `}
            >
              {/* Dropdown backdrop with blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-green-800/95 rounded-2xl backdrop-blur-xl border border-green-700/50 shadow-xl"></div>

              {/* Decorative elements */}
              <div className="absolute -top-1 right-6 w-2 h-2 rotate-45 bg-green-800 border-t border-l border-green-700/50"></div>
              <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>

              <div className="relative p-1 rounded-2xl overflow-hidden">
                {/* All blogs option */}
                <Link
                  href="/blogs"
                  className="flex items-center px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg p-2 mr-3">
                    <Leaf className="h-5 w-5 text-green-900" />
                  </div>
                  <div>
                    <div className="font-medium">All Blog Posts</div>
                    <div className="text-xs text-green-100/70">Browse our complete collection</div>
                  </div>
                </Link>

                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center space-x-2">
                    <FileBarChart2 className="h-3.5 w-3.5 text-green-300" />
                    <div className="text-xs font-medium text-green-300 uppercase tracking-wider">Popular Categories</div>
                  </div>
                </div>

                {/* Popular Categories from API */}
                <div className="px-3 pb-2">
                  {isLoading ? (
                    // Loading state for categories
                    <div className="grid grid-cols-2 gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="px-3 py-3 rounded-lg bg-white/5 animate-pulse"></div>
                      ))}
                    </div>
                  ) : popularCategories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1">
                      {popularCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.name}`}
                          className="px-3 py-2.5 text-sm rounded-lg text-green-50 hover:bg-white/10 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-2 text-green-300" />
                            <span>{category.label}</span>
                          </div>
                          <span className="text-xs bg-green-700/50 px-1.5 py-0.5 rounded-full text-green-100/80">
                            {category.postCount}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-sm text-green-100/50">
                      No categories found
                    </div>
                  )}
                </div>

                {/* Call to action */}
                <div className="mt-1 p-3">
                  <Link
                    href="/category"
                    className="flex items-center justify-between w-full px-4 py-2.5 bg-gradient-to-r from-green-700/50 to-green-600/50 hover:from-green-600/50 hover:to-green-500/50 rounded-lg text-sm font-medium text-white transition-colors"
                  >
                    <span>View All Categories</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* External Resources */}
          <a
            href="https://www.usek.edu.lb/en/home"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-5 py-2 text-white rounded-lg overflow-hidden transition-all duration-300"
            onMouseEnter={() => setHoverIndex(2)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Hover background effect */}
            <span
              className={`absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 transform transition-transform duration-300
                ${hoverIndex === 2 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
              `}
            />

            <span className="relative z-10 flex items-center space-x-1.5">
              <Globe className={`transition-transform duration-300 ${hoverIndex === 2 ? 'scale-110' : 'scale-100'}`} />
              <span>USEK Website</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </span>
          </a>
        </nav>

        {/* Contact Button */}
        <div className="hidden md:block">
          <button
            onClick={scrollToContact}
            className="relative overflow-hidden group px-6 py-2.5 rounded-full transition-all duration-300"
          >
            {/* Button background with animated gradient */}
            <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-gradient-x"></span>

            {/* Hover effect */}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            {/* Shadow effect */}
            <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)] animate-pulse-slow"></span>

            <span className="relative flex items-center space-x-2 font-semibold text-green-900">
              <MessageSquare className="h-4 w-4" />
              <span>Contact Us</span>
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="menu-toggle"
          className="md:hidden z-50 w-10 h-10 flex items-center justify-center rounded-full bg-green-600/30 backdrop-blur-sm text-white focus:outline-none border border-green-500/30"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute top-1 left-0 w-full h-0.5 bg-white rounded-full transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`absolute top-3 left-0 w-full h-0.5 bg-white rounded-full transform transition-all duration-200 ease-in-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute top-5 left-0 w-full h-0.5 bg-white rounded-full transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </div>
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out md:hidden
            ${isMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* Backdrop with animated gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-green-900 to-green-800 transform transition-transform duration-500 ease-in-out
              ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-[url('/pictures/noise.png')] opacity-5"></div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-400/10 blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-green-300/10 blur-3xl"></div>
          </div>

          {/* Content with slide in animation */}
          <div
            className={`relative h-full w-full flex flex-col p-8 transform transition-transform duration-500 ease-out delay-100
              ${isMenuOpen ? 'translate-x-0' : 'translate-x-24'}
            `}
          >
            {/* Logo area */}
            <div className="flex items-center mb-10">
              <div className="w-16 h-16 mr-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-[spin_12s_linear_infinite]" />
                <img
                  src="/pictures/usek logo_prev_ui.png"
                  alt="Green USEK logo"
                  className="w-full h-auto rounded-full"
                />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">Green USEK</h2>
                <p className="text-green-100/70 text-sm">Sustainability Initiative</p>
              </div>
            </div>

            {/* Navigation links with staggered animations */}
            <nav className="space-y-1">
              <Link
                href="/"
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-lg
                  ${pathname === '/'
                    ? 'bg-green-700/30 text-white font-semibold'
                    : 'text-green-50 hover:bg-green-700/20'}
                  transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                `}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="bg-green-700/30 p-2 rounded-lg">
                  <Home className="h-5 w-5 text-green-300" />
                </div>
                <span>Home</span>
              </Link>

              {/* Blog section */}
              <Link
                href="/blogs"
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-lg
                  ${pathname.includes('/category') || pathname.includes('/post') ||pathname.includes('/blogs')
                    ? 'bg-green-700/30 text-white font-semibold'
                    : 'text-green-50 hover:bg-green-700/20'}
                  transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                `}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="bg-green-700/30 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-300" />
                </div>
                <span>All Blog Posts</span>
              </Link>

              {/* Blog categories */}
              <div
                className={`ml-16 mt-1 space-y-1 transform transition-all duration-300
                  ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                `}
                style={{ transitionDelay: '250ms' }}
              >
                {isLoading ? (
                  // Loading state for categories
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-green-700/20 rounded-lg animate-pulse mb-1"></div>
                  ))
                ) : popularCategories.slice(0, 4).map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.name}`}
                    className="flex items-center justify-between text-green-100/80 hover:text-white px-4 py-2.5 rounded-lg text-base hover:bg-green-700/20"
                  >
                    <div className="flex items-center">
                      <Tag className="h-3.5 w-3.5 mr-2.5 text-green-400/70" />
                      {category.label}
                    </div>
                    <span className="text-xs bg-green-700/50 px-1.5 py-0.5 rounded-full text-green-100/80">
                      {category.postCount}
                    </span>
                  </Link>
                ))}

                <Link
                  href="/category"
                  className="flex items-center text-green-200 px-4 py-3 mt-1 rounded-lg text-sm font-medium hover:bg-green-700/20"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2" />
                  View all categories
                </Link>
              </div>

              {/* External link */}
              <a
                href="https://www.usek.edu.lb/en/home"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-lg text-green-50 hover:bg-green-700/20
                  transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                `}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="bg-green-700/30 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-green-300" />
                </div>
                <span>USEK Website</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70 ml-1" />
              </a>
            </nav>

            {/* Bottom action buttons */}
            <div
              className={`mt-auto transform transition-all duration-300
                ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
              style={{ transitionDelay: '350ms' }}
            >
              <button
                onClick={scrollToContact}
                className="w-full relative overflow-hidden py-4 rounded-xl font-semibold text-green-900 text-lg shadow-lg"
              >
                {/* Button background with animated gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 animate-gradient-x"></span>

                {/* Shadow effect */}
                <span className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)]"></span>

                <span className="relative flex items-center justify-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Contact Us</span>
                </span>
              </button>

              <div className="mt-8 text-center text-green-100/50 text-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Leaf className="h-4 w-4 text-green-400/80" />
                  <span>Creating a sustainable campus</span>
                </div>
                <p>© {new Date().getFullYear()} Green USEK Initiative</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};