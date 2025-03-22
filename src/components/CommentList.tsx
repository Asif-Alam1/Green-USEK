"use client";

import { format } from "date-fns";
import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentListProps {
  comments: {
    id: string;
    author: string;
    content: string;
    url?: string | null;
    createdAt: Date;
    parent?: {
      id: string;
      author: string;
      content: string;
      url?: string | null;
      createdAt: Date;
    } | null;
  }[];
  pagination: {
    page: number;
    limit: number | "all";
    totalPages: number;
    totalComments: number;
  };
  config: {
    enabled: boolean;
    allowUrls: boolean;
    allowNested: boolean;
  };
  isLoading?: boolean;
}

// Helper function to create avatar from initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Generate a consistent color based on a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`;
};

export function CommentList({ comments, config, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4 bg-background/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-muted"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
              <div className="ml-auto h-3 w-24 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
              <div className="h-3 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-lg border bg-background/50 p-8 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium mb-2">No comments yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Be the first to share your thoughts on this post!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border bg-background/50 p-5 transition-all hover:shadow-sm"
        >
          {comment.parent && (
            <div className="mb-4 rounded-md bg-muted/50 p-3 text-sm">
              <div className="text-muted-foreground text-xs mb-1 font-medium">
                In reply to <span className="font-semibold">{comment.parent.author}</span>
              </div>
              <div className="text-muted-foreground line-clamp-3">
                {comment.parent.content}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: stringToColor(comment.author) }}
            >
              {getInitials(comment.author)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
                <div className="flex items-center gap-1.5">
                  {config.allowUrls && comment.url ? (
                    <Link
                      href={comment.url}
                      target="_blank"
                      className="font-medium hover:underline inline-flex items-center group"
                    >
                      {comment.author}
                      <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ) : (
                    <span className="font-medium">{comment.author}</span>
                  )}
                </div>
                <time
                  dateTime={new Date(comment.createdAt).toISOString()}
                  className="text-xs text-muted-foreground whitespace-nowrap"
                >
                  {format(new Date(comment.createdAt), "PPp")}
                </time>
              </div>
              <div className="text-sm whitespace-pre-line leading-relaxed">
                {comment.content}
              </div>
            </div>
          </div>
        </div>
      ))}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="text-xs text-muted-foreground">
            Showing {comments.length} of {pagination.totalComments} comments
          </div>
        </div>
      )}
    </div>
  );
}