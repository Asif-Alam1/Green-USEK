export const revalidate = 60; // 1 minute

import { BlogPostList } from "@/components/BlogPostList";
import { PostPagination } from "@/components/PostPagination";
import { wisp } from "@/lib/wisp";
import { FilterBar } from "../../../components/FilterBar";
import { FullWidthHeader } from "../../../components/FullWidthHeader";
import { config } from "../../../config";
import { Metadata } from "next";
import { getOgImageUrl } from "@/lib/ogImage";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Hash, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryParams {
  tag: string;
}

export async function generateMetadata(
  props: {
    params: Promise<CategoryParams>;
  }
): Promise<Metadata> {
  try {
    // Correctly await the params Promise
    const params = await props.params;
    const { tag } = params;

    // Find category from config for better SEO data if available
    const category = config.categories.find((c) => c.tag === tag);
    const label = category?.label || `#${tag}`;
    const description = category?.description || `Blog posts tagged with #${tag}`;

    // Construct canonical URL
    const canonicalUrl = new URL(`/category/${tag}`, config.baseUrl).toString();

    return {
      title: `${label} | ${config.title}`,
      description: description,
      openGraph: {
        title: `${label} | ${config.title}`,
        description: description,
        url: canonicalUrl,
        type: "website",
        images: [{
          url: getOgImageUrl(`${label}`),
          width: 1200,
          height: 630,
          alt: `${label} - ${config.title}`
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${label} | ${config.title}`,
        description: description,
        images: [getOgImageUrl(`${label}`)],
      },
      alternates: {
        canonical: canonicalUrl,
      }
    };
  } catch (error) {
    console.error("Error generating category metadata:", error);
    return {
      title: "Category | " + config.title,
      description: config.description,
    };
  }
}

export default async function CategoryPage(
  props: {
    searchParams?: Promise<{ query?: string; page?: string }>;
    params: Promise<CategoryParams>;
  }
) {
  try {
    // Correctly await the Promises
    const params = await props.params;
    const { tag } = params;

    const searchParams = await props.searchParams || {};

    // Find matching category from config if it exists
    const category = config.categories.find((c) => c.tag === tag);
    const { label, description } = category || {
      label: `#${tag}`,
      description: `Blog posts tagged with #${tag}`,
    };

    // Parse page parameter or default to 1
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    // Fetch posts with the specified tag
    const result = await wisp.getPosts({
      limit: 6,
      tags: [tag],
      query: searchParams.query,
      page,
    });

    // Create breadcrumb data
    const breadcrumb = [
      { label: "Home", href: "/" },
      { label: "Categories", href: "/category/" },
      { label, href: `/category/${tag}` },
    ];

    // Check if we have any posts
    const hasPosts = result.posts.length > 0;

    return (
      <>

        <div className="container mx-auto max-w-6xl px-4 pb-16">
          {/* Category metadata display */}

          {/* Filter bar for this category */}
          <div className="bg-muted/20 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between gap-4 mb-3">

              {searchParams.query && (
                <Link href={`/category/${tag}`}>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Clear filters
                  </Button>
                </Link>
              )}
            </div>
            <FilterBar active={tag} className="mt-28 " />
          </div>

          {/* Post listing section */}
          {hasPosts ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  {searchParams.query
                    ? `Results for "${searchParams.query}" in ${label}`
                    : `All posts in ${label}`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {result.posts.length} of {result.pagination.totalPosts} posts
                </p>
              </div>

              <BlogPostList posts={result.posts} />

              <PostPagination
                pagination={result.pagination}
                className="my-12"
                query={searchParams.query}
                basePath={`/category/${tag}`}
              />
            </>
          ) : (
            <div className="bg-muted/20 border rounded-lg p-8 text-center">
              <Hash className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-xl font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchParams.query
                  ? `No results found for "${searchParams.query}" in the ${label} category.`
                  : `There are currently no blog posts tagged with "${tag}".`}
              </p>
              {searchParams.query ? (
                <Link href={`/category/${tag}`}>
                  <Button variant="outline">
                    View all posts in this category
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Check out some of our other categories instead:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md">
                    {config.categories.slice(0, 5).map((otherCategory) => (
                      otherCategory.tag !== tag && (
                        <Link
                          key={otherCategory.tag}
                          href={`/category/${otherCategory.tag}`}
                        >
                          <Badge variant="secondary" className="cursor-pointer">
                            {otherCategory.label}
                          </Badge>
                        </Link>
                      )
                    ))}
                    <Link href="/category">
                      <Badge variant="outline" className="cursor-pointer">
                        View all
                      </Badge>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}