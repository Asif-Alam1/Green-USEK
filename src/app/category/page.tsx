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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  },
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
  const sortedCategories = allCategories.sort(
    (a, b) => (b.postCount || 0) - (a.postCount || 0)
  );

  // Group categories by popularity
  const popularCategories = sortedCategories
    .filter((cat) => (cat.postCount || 0) > 0)
    .slice(0, 6);
  const otherCategories = sortedCategories.filter(
    (cat) => !popularCategories.includes(cat)
  );

  return (
    <div className="bg-gradient-to-b pt-[90px] md:pt-36 from-green-100 to-white">
      <div className="container mx-auto w-11/12 max-w-7xl">
        {/* Popular categories section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <FileBarChart2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Popular Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3"> {/* Keep grid for Popular Categories */}
            {popularCategories.map((category) => {
              // Get additional metadata from config if available
              const configCategory = config.categories.find(
                (c) => c.tag === category.name
              );
              const label = configCategory?.label || category.name;
              const description =
                configCategory?.description ||
                category.description ||
                `Posts tagged with ${category.name}`;

              return (
                <Card
                  key={category.id}
                  className="group overflow-hidden transition-all hover:shadow-md"
                >
                  <Link
                    href={`/category/${category.name}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Browse ${label} category`}
                  ></Link>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">
                        {category.postCount}{" "}
                        {category.postCount === 1 ? "post" : "posts"}
                      </Badge>
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {label}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">
                      {description}
                    </CardDescription>
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
                        <path d="m9 18 6-6-6-6" />
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
          <div className="flex items-center gap-2 mb-5">
            <Folder className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              All Categories
            </h2>
          </div>

          <Card>
            <CardContent className="p-2  md:p-6">
              <div className="flex flex-col space-y-3"> {/* flex-col for vertical stacking of rows */}
                {sortedCategories.map((category, index) => {
                  if (index % 3 === 0) {
                    const nextCategory = sortedCategories[index + 1];
                    const nextNextCategory = sortedCategories[index + 2];
                    return (
                      <div key={`row-${index / 3}`} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"> {/* Row container: flex-col by default, flex-row on sm+ */}
                        <div className=" flex-1 w-full sm:w-1/2 md:w-1/3"> {/* Item container: w-full default, sm:w-1/2, md:w-1/3 */}
                          <Link
                            key={category.id}
                            href={`/category/${category.name}`}
                            className="flex   w-fit items-center rounded-md hover:bg-muted transition-colors"
                          >
                            <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium mr-3">{
                              config.categories.find((c) => c.tag === category.name)?.label || category.name
                            }</span>
                            {category.postCount !== undefined && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {category.postCount}
                              </Badge>
                            )}
                          </Link>
                        </div>
                        {nextCategory && (
                          <div className="flex-1 w-full sm:w-1/2 md:w-1/3"> {/* Item container: w-full default, sm:w-1/2, md:w-1/3 */}
                            <Link
                              key={nextCategory.id}
                              href={`/category/${nextCategory.name}`}
                              className="flex   w-fit items-center rounded-md hover:bg-muted transition-colors"
                            >
                              <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium mr-3">{
                                config.categories.find((c) => c.tag === nextCategory.name)?.label || nextCategory.name
                              }</span>
                              {nextCategory.postCount !== undefined && (
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {nextCategory.postCount}
                                </Badge>
                              )}
                            </Link>
                          </div>
                        )}
                        {nextNextCategory && (
                          <div className=" flex-1 w-full md:w-1/3 sm:block hidden"> {/* Item container: w-full default, md:w-1/3, hidden below sm */}
                            <Link
                              key={nextNextCategory.id}
                              href={`/category/${nextNextCategory.name}`}
                              className="flex   w-fit items-center rounded-md hover:bg-muted transition-colors"
                            >
                              <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium mr-3">{
                                config.categories.find((c) => c.tag === nextNextCategory.name)?.label || nextNextCategory.name
                              }</span>
                              {nextNextCategory.postCount !== undefined && (
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {nextNextCategory.postCount}
                                </Badge>
                              )}
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {sortedCategories.length === 0 && (
                <div className="text-center py-8">
                  <FolderArchive className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-xl font-medium mb-2">
                    No categories found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    There are currently no content categories available.
                  </p>
                  <Link href="/">
                    <Button variant="outline">Back to homepage</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}