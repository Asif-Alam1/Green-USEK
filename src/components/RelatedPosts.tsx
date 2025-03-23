"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import type { GetRelatedPostsResult } from "@wisp-cms/client";
import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import { ArrowRight, Clock, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export const RelatedPosts: FunctionComponent<{
  posts: GetRelatedPostsResult["posts"];
  className?: string;
}> = ({ posts, className }) => {
  if (posts.length === 0) {
    return null;
  }

  // Function to estimate reading time based on description length
  const estimateReadTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <div className={cn("my-12", className)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">
            Related Posts
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <div
            key={post.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
          >
            <Link
              href={`/post/${post.slug}`}
              className="absolute inset-0 z-10"
              aria-label={post.title}
            />

            <div className="relative overflow-hidden">
              <AspectRatio ratio={16 / 9} className="w-full bg-muted">
                <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                <Image
                  src={post.image || "/placeholder.jpg"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center transition-all duration-300 group-hover:scale-105"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.previousElementSibling?.classList.add('hidden');
                  }}
                />
              </AspectRatio>
            </div>

            <div className="flex flex-col flex-grow space-y-2.5 p-4">
              <h3 className="line-clamp-2 text-base font-medium leading-tight">
                {post.title}
              </h3>

              {post.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
              )}

              <div className="mt-auto pt-3 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1.5 h-3 w-3" />
                  <span>{estimateReadTime(post.description || "")} min read</span>
                </div>

                <span className="text-xs font-medium text-primary inline-flex items-center transition-all group-hover:translate-x-0.5">
                  Read more
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};