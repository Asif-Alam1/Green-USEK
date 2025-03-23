"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Author,
  GetRelatedPostsResult,
  TagInPost
} from "@wisp-cms/client";
import {
  Calendar,
  Clock,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  BookOpen,
  Link as LinkIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { FullWidthHeader } from "./FullWidthHeader";
import { RelatedPosts } from "./RelatedPosts";
import { processTableOfContents, TableOfContents } from "./TOC";
import { ContentWithCustomComponents } from "@wisp-cms/react-custom-component";
import { FAQ } from "./WispComponents/FAQ";
import { formatFullDate } from "@/lib/date";
import { CommentSection } from "./CommentSection";
import { cn } from "@/lib/utils";

export const BlogContent = ({
  post: { title, content, author, publishedAt, tags, slug, description },
  relatedPosts,
}: {
  post: {
    id: string;
    createdAt: Date;
    teamId: string;
    description: string | null;
    title: string;
    content: string;
    slug: string;
    image: string | null;
    authorId: string;
    updatedAt: Date;
    publishedAt: Date | null;
    tags: TagInPost[];
    author: Author;
  };
  relatedPosts: GetRelatedPostsResult["posts"];
}) => {
  // Process HTML content for table of contents
  const { modifiedHtml, tableOfContents } = processTableOfContents(content, {
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
  });

  // Calculate estimated reading time
  const calculateReadingTime = useCallback(() => {
    // Strip HTML tags and count words
    const textContent = modifiedHtml.replace(/<[^>]*>?/gm, '');
    const words = textContent.split(/\s+/).length;
    // Assuming 200 words per minute reading speed
    return Math.ceil(words / 200);
  }, [modifiedHtml]);

  const [readingTime, setReadingTime] = useState<number>(0);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);

  // Set reading time on component mount
  useEffect(() => {
    setReadingTime(calculateReadingTime());
  }, [calculateReadingTime]);

  // Copy URL to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could integrate this with a toast notification if available
      setShowShareOptions(false);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  // Share URLs
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`
  };

  return (
    <>


      <article className="container mx-auto pt-8 pb-16 px-4 max-w-6xl mt-28">
        <h1 className="text-4xl font-bold tracking-tight mb-6 lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-green-600">{title}</h1>
        {/* Author and metadata section */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border">
              <Image
                src={author.image || "/placeholder-avatar.jpg"}
                alt={author.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{author.name}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                {publishedAt ? formatFullDate(publishedAt) : "Draft"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1.5 h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>

              {showShareOptions && (
                <div className="absolute right-0 top-full mt-2 p-4 bg-background border rounded-lg shadow-md z-10 w-48">
                  <div className="text-sm font-medium mb-2">Share this article</div>
                  <div className="grid gap-2">
                    <a
                      href={shareUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                    <a
                      href={shareUrls.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                    <a
                      href={shareUrls.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-sm p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Copy link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags section - moved to top */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <Link
                href={`/category/${tag.name}`}
                key={tag.id}
                className="inline-flex items-center px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <Separator className="mb-8" />

        {/* Main content with TOC */}
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Main content column */}
          <div className="w-full lg:w-3/4 order-2 lg:order-1">
            {/* Mobile TOC accordion */}
            {tableOfContents.length > 0 && (
             <Accordion
                type="single"
                collapsible
                className="w-full not-prose my-6 block lg:hidden bg-muted/30 rounded-lg"
              >
                <AccordionItem value="toc" className="border-none">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Table of Contents
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <TableOfContents items={tableOfContents} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Main article content */}
            <div className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none w-full break-words blog-content">
              <ContentWithCustomComponents
                content={modifiedHtml}
                customComponents={{
                  FAQ,
                }}
              />
            </div>
          </div>

          {/* Table of contents sidebar */}
          {tableOfContents.length > 0 && (
            <div className="w-1/4 order-1 lg:order-2 hidden lg:block">
              <div className="sticky top-4 max-h-screen overflow-y-auto">

                <TableOfContents items={tableOfContents} />
              </div>
            </div>
          )}
        </div>

        <Separator className="my-12" />

        {/* Comments section */}
        <CommentSection slug={slug} />

        {/* Related posts */}
        <RelatedPosts posts={relatedPosts} className="mt-12" />
      </article>
    </>
  );
};