export const revalidate = 60; // 1 minute

import { BlogPostList } from "@/components/BlogPostList";
import { PostPagination } from "@/components/PostPagination";
import { getOgImageUrl } from "@/lib/ogImage";
import { wisp } from "@/lib/wisp";
import { Metadata } from "next";
import { FilterBar } from "../components/FilterBar";
import { FullWidthHeader } from "../components/FullWidthHeader";
import { config } from "../config";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { formatFullDate } from "@/lib/date";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const { title, description } = config;

export const metadata: Metadata = {
  title: `${title}`,
  description,
  openGraph: {
    title: `${title}`,
    description,
    images: [getOgImageUrl(title)],
  },
};

// Estimate reading time based on description length
function estimateReadTime(text: string | null): number {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const wordCount = text?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default async function Page(
  props: {
    searchParams?: Promise<{ query: string; page: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  // Fetch one additional post if on first page for the featured post
  const postsToFetch = page === 1 ? 7 : 6;

  const result = await wisp.getPosts({
    limit: postsToFetch,
    query: searchParams?.query,
    page,
  });

  // Extract the featured post from the first position if on page 1 and no search query
  let featuredPost = null;
  let postList = [...result.posts];

  if (page === 1 && !searchParams?.query && postList.length > 0) {
    featuredPost = postList.shift(); // Remove the first post for featured display
  }

  return (
    <main>
      <FullWidthHeader title={title} description={description} />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Category Filter */}
        <FilterBar active="latest" className="my-8" />

        {/* Featured Post Section */}
        {featuredPost && (
          <section className="mb-16">
            <h2 className="sr-only">Featured Post</h2>
            <div className="rounded-xl overflow-hidden border shadow-sm bg-background/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Featured Image */}
                <div className="lg:col-span-7 relative">
                  <div className="aspect-[16/9] lg:aspect-auto lg:h-full relative">
                    <Image
                      src={featuredPost.image || "/placeholder.jpg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                      priority={true}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 text-sm font-medium rounded-full">
                      Newest
                    </div>
                  </div>
                </div>

                {/* Featured Content */}
                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={new Date(featuredPost.publishedAt || featuredPost.createdAt).toISOString()}>
                      {formatFullDate(featuredPost.publishedAt || featuredPost.createdAt)}
                    </time>
                    <span className="mx-2">•</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{estimateReadTime(featuredPost.description)} min read</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                    <Link
                      href={`/post/${featuredPost.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  {featuredPost.description && (
                    <p className="line-clamp-3 md:line-clamp-4 lg:line-clamp-6 text-muted-foreground mb-6">
                      {featuredPost.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={featuredPost.author.image || "/placeholder-avatar.jpg"}
                        alt={featuredPost.author.name || ""}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                      <span className="font-medium text-sm">
                        {featuredPost.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/post/${featuredPost.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Read more
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {searchParams?.query
                ? `Search results for "${searchParams.query}"`
                : "Latest Posts"}
            </h2>

            {result.pagination.totalPages > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {postList.length} of {result.pagination.totalPosts} posts
              </p>
            )}
          </div>

          {/* If no posts found, show message */}
          {postList.length === 0 ? (
            <div className="py-12 text-center border rounded-lg bg-muted/20">
              <p className="text-lg font-medium mb-2">No posts found</p>
              <p className="text-muted-foreground mb-6">
                {searchParams?.query
                  ? `No results matching "${searchParams.query}"`
                  : "There are no posts published yet"}
              </p>
              {searchParams?.query && (
                <Link
                  href="/"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  View all posts
                </Link>
              )}
            </div>
          ) : (
            <BlogPostList posts={postList} />
          )}
        </section>

        {/* Pagination */}
        <PostPagination
          pagination={result.pagination}
          className="my-16"
          query={searchParams?.query}
        />

        {/* Newsletter Section */}
        {!searchParams?.query && page === 1 && (
          <section className="my-16">
            <div className="rounded-xl bg-muted/30 border p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Subscribe to our newsletter
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Stay updated with our latest articles, news, and insights. We'll send you a curated selection of our best content, delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}