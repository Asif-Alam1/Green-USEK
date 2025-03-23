export const dynamic = "force-dynamic";
export const revalidate = 60;

import { wisp } from "@/lib/wisp";
import Link from "next/link";
import { FullWidthHeader } from "../../components/FullWidthHeader";
import { Metadata } from "next";
import { config } from "@/config";
import { getOgImageUrl } from "@/lib/ogImage";
import { Hash, Folder, FolderArchive, FileBarChart2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Categories | ${config.title}`,
  description: `Browse all content categories on ${config.organization}`,
  openGraph: {
    title: `Categories | ${config.title}`,
    description: `Browse all content categories on ${config.organization}`,
    images: [getOgImageUrl(`Content Categories`)],
    type: "website",
  },
  alternates: {
    canonical: new URL("/category", config.baseUrl).toString(),
  }
};

type CategoryData = {
  id: string;
  name: string;
  description: string | null;
  postCount?: number;
};

export default async function CategoriesPage() {
  // Fetch all tags and post counts
  const tagsResult = await wisp.getTags();

  // Get post counts for each tag (if available in API response)
  const tagPostCounts: Record<string, number> = {};

  // Create a combined list of API tags and config categories
  const allCategories: CategoryData[] = await Promise.all(
    tagsResult.tags.map(async (tag) => {
      // Get post count for this tag
      let postCount = tagPostCounts[tag.name] || 0;

      // If post count is not directly available, we can fetch it
      if (postCount === 0) {
        try {
          const postsResult = await wisp.getPosts({
            tags: [tag.name],
            limit: 1, // We only need count information, not actual posts
          });
          postCount = postsResult.pagination.totalPosts;
        } catch (error) {
          console.error(`Error fetching post count for ${tag.name}:`, error);
        }
      }

      return {
        id: tag.id,
        name: tag.name,
        description: tag.description,
        postCount,
      };
    })
  );

  // Sort categories by post count (descending)
  const sortedCategories = allCategories.sort((a, b) =>
    (b.postCount || 0) - (a.postCount || 0)
  );

  // Group categories by popularity
  const popularCategories = sortedCategories.filter(cat => (cat.postCount || 0) > 0).slice(0, 6);
  const otherCategories = sortedCategories.filter(cat => !popularCategories.includes(cat));

  return (
    <>


      <div className="container mx-auto px-4 py-12 max-w-6xl mt-28">
        {/* Popular categories section */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <FileBarChart2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Popular Categories</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {popularCategories.map((category) => {
              // Get additional metadata from config if available
              const configCategory = config.categories.find(c => c.tag === category.name);
              const label = configCategory?.label || category.name;
              const description = configCategory?.description || category.description || `Posts tagged with ${category.name}`;

              return (
                <Card key={category.id} className="group overflow-hidden transition-all hover:shadow-md">
                  <Link href={`/category/${category.name}`} className="absolute inset-0 z-10" aria-label={`Browse ${label} category`}></Link>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{category.postCount} {category.postCount === 1 ? 'post' : 'posts'}</Badge>
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{label}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">{description}</CardDescription>
                    <div className="flex items-center text-sm text-primary font-medium">
                      Browse category
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 transition-transform group-hover:translate-x-0.5"
                      >
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* All categories section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Folder className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">All Categories</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                {sortedCategories.map((category) => {
                  // Get additional metadata from config if available
                  const configCategory = config.categories.find(c => c.tag === category.name);
                  const label = configCategory?.label || category.name;

                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.name}`}
                      className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{label}</span>
                      {category.postCount !== undefined && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {category.postCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {sortedCategories.length === 0 && (
                <div className="text-center py-8">
                  <FolderArchive className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-xl font-medium mb-2">No categories found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    There are currently no content categories available.
                  </p>
                  <Link href="/">
                    <Button variant="outline">
                      Back to homepage
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}