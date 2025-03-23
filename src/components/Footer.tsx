'use client'
import { config } from "@/config";
import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Mail,
  MapPin,
  Phone,
  Heart,
  ArrowUp,
  Globe,
  Leaf,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState, FormEvent } from "react";

export const Footer = () => {
  const [email, setEmail] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset any previous status
    setFormStatus('submitting');

    try {
      // Send request to the API route
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Parse the response
      const data = await response.json();

      // Handle the response
      if (data.success) {
        setFormStatus('success');
        setStatusMessage(data.message);
        setEmail(''); // Clear the input field
      } else {
        setFormStatus('error');
        setStatusMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setFormStatus('error');
      setStatusMessage('Connection error. Please try again later.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="w-full">
      {/* Mountain image separator - background image implementation */}
      <div
        className="w-full h-24 md:h-32 lg:h-40 relative"
        style={{
          backgroundImage: "url('/Mountain.png')",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom center",
          backgroundSize: "auto 100%",
          filter: "drop-shadow(0 5px 15px rgba(0,100,0,0.15))"
        }}
      >
        {/* Add a 1px pseudo-element to ensure seamless connection with footer */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"></div>
      </div>

      {/* Main footer content */}
      <div className="bg-gradient-to-b from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Section 1: About */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/pictures/usek logo_prev_ui.png"
                  alt="Green USEK Logo"
                  className="w-10 h-10 rounded-full"
                />
                <h3 className="text-xl font-bold">Green USEK</h3>
              </div>
              <p className="text-green-100/80 text-sm">
                Green USEK is a student-led environmental initiative dedicated to transforming our campus into a sustainable ecosystem and inspiring eco-conscious communities.
              </p>
              <div className="flex space-x-3 pt-2">
        <a
                  href="https://www.instagram.com/green.usek/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-700/50 p-2 rounded-full hover:bg-green-500/50 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Section 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-green-500/30 pb-2">Quick Links</h3>
              <nav className="grid grid-cols-1 gap-2">
                <Link
                  href="/"
                  className="text-green-100 hover:text-white transition-colors flex items-center"
                >
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/blogs"
                  className="text-green-100 hover:text-white transition-colors flex items-center"
                >
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>Blog</span>
                </Link>
                <Link
                  href="/category"
                  className="text-green-100 hover:text-white transition-colors flex items-center"
                >
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>Categories</span>
                </Link>
              <a
                  href="https://www.usek.edu.lb/en/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-100 hover:text-white transition-colors flex items-center"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>USEK Website</span>
                </a>
              </nav>
            </div>

            {/* Section 3: Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-green-500/30 pb-2">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Holy Spirit University of Kaslik (USEK), Jounieh, Lebanon</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  <a href="mailto:green@usek.edu.lb" className="hover:underline">
                    green@usek.edu.lb
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  <a href="tel:+9619600920" className="hover:underline">+961 9 600 920/1</a>
                </div>
              </div>
            </div>

            {/* Section 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-green-500/30 pb-2">Stay Updated</h3>
              <p className="text-sm text-green-100/80">
                Subscribe to our newsletter for the latest sustainability news and campus initiatives.
              </p>

              {formStatus === 'success' ? (
                <div className="mt-4 bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-sm">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Successfully subscribed!</p>
                      <p className="text-green-100/80 mt-1">{statusMessage}</p>
                    </div>
                  </div>
                </div>
              ) : formStatus === 'error' ? (
                <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-sm">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-300 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Subscription failed</p>
                      <p className="text-red-100/80 mt-1">{statusMessage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="mt-2 flex flex-col space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-2 bg-green-700/50 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-green-100/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={formStatus === 'submitting'}
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-400 text-green-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : 'Subscribe'}
                  </button>
                </form>
              )}

              {/* Option to subscribe again after success */}
              {formStatus === 'success' && (
                <button
                  onClick={() => setFormStatus('idle')}
                  className="text-green-300 hover:text-white text-sm mt-2 underline"
                >
                  Subscribe another email
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-green-900 text-green-100/70 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <span>© {config.organization} {new Date().getFullYear()}</span>
            <span className="mx-2">|</span>
            <span className="flex items-center">
              Made with <Heart className="h-3 w-3 text-red-400 mx-1" /> for a greener planet
            </span>
          </div>

          <div className="flex items-center">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};