"use client";
import Image from "next/image";
import Link from "next/link";
import type { GetPostsResult } from "@wisp-cms/client";
import { formatFullDate } from "@/lib/date";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogPostListProps {
  posts: GetPostsResult["posts"];
  className?: string;
  variant?: "grid" | "list";
}

export const BlogPostList = ({
  posts,
  className,
  variant = "grid",
}: BlogPostListProps) => {
  // Function to estimate reading time based on description length
  const estimateReadTime = (text: string | null): number => {
    if (!text) return 1;
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Generate initials for fallback avatar
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a consistent color based on a string
  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <div
      className={cn(
        variant === "grid"
          ? "grid grid-cols-1 gap-8 sm:gap-4 md:grid-cols-2 lg:gap-6"
          : "space-y-12",
        className
      )}
    >
      {posts.map((post) => (
        <article
          className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all duration-200 hover:shadow-md"
          key={post.id}
        >
          {/* Featured Image */}
          <Link
            href={`/post/${post.slug}`}
            className="overflow-hidden"
            aria-label={post.title}
          >
            <div className="aspect-[16/9] relative bg-muted">
              <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
              {post.image ? (
                <Image
                  alt={post.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src={post.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.previousElementSibling?.classList.add("hidden");
                  }}
                />
              ) : (
                <Image
                  src="/placeholder.jpg"
                  alt="placeholder"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.previousElementSibling?.classList.add("hidden");
                  }}
                />
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6">
            {/* Post Metadata (top) */}
            <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time
                  dateTime={new Date(
                    post.publishedAt || post.createdAt
                  ).toISOString()}
                >
                  {formatFullDate(post.publishedAt || post.createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{estimateReadTime(post.description)} min read</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-3 font-sans font-semibold tracking-tight text-2xl group-hover:text-primary transition-colors duration-200">
              <Link
                href={`/post/${post.slug}`}
                className="after:absolute after:inset-0"
              >
                {post.title}
              </Link>
            </h2>

            {/* Description */}
            {post.description && (
              <div className="mb-5 line-clamp-3 text-muted-foreground">
                {post.description}
              </div>
            )}

            {/* Author Information */}
            <div className="mt-auto flex items-center gap-3 pt-4 border-t">
              <div className="flex-shrink-0">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || ""}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: stringToColor(
                        post.author.name || "Unknown"
                      ),
                    }}
                    aria-label={post.author.name || "Unknown author"}
                  >
                    {getInitials(post.author.name || "Unknown")}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="font-medium truncate">
                  {post.author.name || "Unknown author"}
                </p>
              </div>
              <span className="text-xs flex items-center text-primary font-medium">
                Read more
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
