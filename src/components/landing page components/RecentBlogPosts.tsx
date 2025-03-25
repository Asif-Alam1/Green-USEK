"use client";

import React, { useState, useEffect } from "react";
import { wisp } from "@/lib/wisp";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatFullDate } from "@/lib/date";

const RecentBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await wisp.getPosts({ limit: 3 });
        setPosts(result.posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    // Set up intersection observer for fade-in animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("recent-blogs-section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Function to estimate reading time based on description length
  const estimateReadTime = (text: string | null): number => {
    if (!text) return 1;
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <div
      id="recent-blogs-section"
      className="py-16 w-full flex justify-center bg-gradient-to-b from-white to-green-100"
    >
      <div className="flex flex-col justify-center w-11/12 lg:w-9/12 space-y-12">
        {/* Header with animated reveal */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold text-center text-green-800 mb-4">
            Latest{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Insights</span>
              <span className="hidden md:block absolute -bottom-1 left-0 w-full h-2 bg-green-200 -z-0"></span>
            </span>
          </h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Stay informed with our latest updates, stories, and sustainability initiatives
          </p>
        </div>

        {/* Blog posts grid */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {posts.map((post, index) => (
              <Link
              href={`/post/${post.slug}`}
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div  className="block relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.previousElementSibling?.classList.add('hidden');
                      }}
                    />
                  ) : (
                   <Image
                      src='/placeholder.jpg'
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.previousElementSibling?.classList.add('hidden');
                      }}
                    />
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
                        {formatFullDate(post.publishedAt || post.createdAt)}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{estimateReadTime(post.description)} min read</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-green-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {post.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  )}

                  <p

                    className="inline-flex items-center text-green-700 font-medium group-hover:text-green-500 transition-colors duration-300"
                  >
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View all blogs button */}
        <div
          className={`flex justify-center transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link
            href="/blogs"
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentBlogPosts;