export const revalidate = 60; // 1 minute

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wisp } from "@/lib/wisp";
import { BlogContent } from "@/components/BlogContent";
import type { BlogPosting, BreadcrumbList, WithContext } from "schema-dts";
import { config } from "@/config";
import { getOgImageUrl } from "@/lib/ogImage";

interface Params {
  slug: string;
}

/**
 * Generate metadata for the blog post page
 * @param props - Object containing the slug parameter
 * @returns Metadata object for the page
 */
export async function generateMetadata(
  props: {
    params: Promise<Params>;
  }
): Promise<Metadata> {
  // Extract slug parameter
  const params = await props.params;
  const { slug } = params;

  try {
    // Fetch post data
    const result = await wisp.getPost(slug);

    // If post not found, return basic 404 metadata
    if (!result.post) {
      return {
        title: "Post Not Found | " + config.title,
        description: "The requested blog post could not be found.",
      };
    }

    // Destructure post data for metadata
    const { title, description, image, publishedAt, author } = result.post;

    // Calculate canonical URL
    const canonicalUrl = new URL(`/post/${slug}`, config.baseUrl).toString();

    // Return comprehensive metadata
    return {
      title: `${title} | ${config.title}`,
      description: description,
      authors: [{ name: author.name || "Unknown Author" }],
      openGraph: {
        title: title,
        description: description ?? "",
        url: canonicalUrl,
        type: "article",
        publishedTime: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        authors: author.name ? [author.name] : undefined,
        images: [
          {
            url: image || getOgImageUrl(title),
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        siteName: config.title,
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description ?? "",
        images: [image || getOgImageUrl(title)],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Return fallback metadata in case of error
    return {
      title: "Blog Post | " + config.title,
      description: config.description,
    };
  }
}

/**
 * Main blog post page component
 * Fetches post data and related posts, then renders the BlogContent component
 */
export default async function BlogPost(
  props: {
    params: Promise<Params>;
  }
) {
  // Extract slug parameter
  const params = await props.params;
  const { slug } = params;

  try {
    // Fetch post data and related posts in parallel
    const [result, related] = await Promise.all([
      wisp.getPost(slug),
      wisp.getRelatedPosts({ slug, limit: 4 }),
    ]);

    // Redirect to 404 if post not found
    if (!result.post) {
      notFound();
    }

    // Destructure post data for schema.org markup
    const { title, publishedAt, updatedAt, author, image, content } = result.post;

    // Calculate reading time (approximate 200 words per minute)
    const wordCount = content
      .replace(/<[^>]*>/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Generate canonical URL
    const canonicalUrl = new URL(`/post/${slug}`, config.baseUrl).toString();

    // Create JSON-LD schema for blog post
    const blogPostSchema: WithContext<BlogPosting> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      image: image ? image : undefined,
      datePublished: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      dateModified: new Date(updatedAt).toISOString(),
      author: {
        "@type": "Person",
        name: author.name ?? undefined,
        image: author.image ?? undefined,
      },
      publisher: {
        "@type": "Organization",
        name: config.organization,
        url: config.baseUrl,
        logo: {
          "@type": "ImageObject",
          url: config.logoUrl,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
    };

    // Create breadcrumb schema
    const breadcrumbSchema: WithContext<BreadcrumbList> = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: config.baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: new URL("/", config.baseUrl).toString(),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: canonicalUrl,
        },
      ],
    };

    return (
      <>
        {/* Inject schema.org JSON-LD metadata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Render the blog content component */}
        <BlogContent
          post={{
            ...result.post,
            readingTime: readingTime, // Pass calculated reading time to component
          }}
          relatedPosts={related.posts}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}