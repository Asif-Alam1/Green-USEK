export const revalidate = 60; // 1 minute

import { BlogPostList } from "@/components/BlogPostList";
import { PostPagination } from "@/components/PostPagination";
import { wisp } from "@/lib/wisp";
import { FilterBar } from "../../../components/FilterBar";
import { FullWidthHeader } from "../../../components/FullWidthHeader";
import { config } from "../../../config";
import { Metadata } from "next";
import { getOgImageUrl } from "@/lib/ogImage";

export async function generateMetadata(
  props: {
    params: Promise<{ tag: string }>;
  }
): Promise<Metadata> {
  // Correctly await the params Promise
  const params = await props.params;
  const { tag } = params;

  return {
    title: `Blog posts tagged with #${tag}`,
    description: `List of all blog posts on ${config.organization} tagged with #${tag}`,
    openGraph: {
      title: `Blog posts tagged with #${tag}`,
      description: `List of all blog posts on ${config.organization} tagged with #${tag}`,
      images: [getOgImageUrl(`#${tag}`)],
    },
  };
}

export default async function Page(
  props: {
    searchParams?: Promise<{ query?: string; page?: string }>;
    params: Promise<{ tag: string }>;
  }
) {
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

  // Check if we have any posts
  const hasPosts = result.posts.length > 0;

  return (
    <>
      <FullWidthHeader
        title={label}
        description={description}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category/" },
          { label, href: `/category/${tag}` },
        ]}
      />
      <div className="container mx-auto max-w-6xl">
        <FilterBar active={tag} className="my-8" />

        {hasPosts ? (
          <BlogPostList posts={result.posts} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-4">No posts found</h3>
            <p className="text-muted-foreground">
              There are currently no blog posts tagged with "{tag}".
            </p>
          </div>
        )}

        {hasPosts && (
          <PostPagination
            pagination={result.pagination}
            className="my-16"
            query={searchParams.query}
            basePath={`/category/${tag}`}
          />
        )}
      </div>
    </>
  );
}