"use client";

import { useQuery } from "@tanstack/react-query";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { wisp } from "../lib/wisp";
import { MessageSquare, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CommentSectionProps {
  slug: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["comments", slug],
    queryFn: () => wisp.getComments({ slug, page: 1, limit: "all" }),
  });

  // Handle successful comment submission
  const handleCommentSuccess = () => {
    // Refetch comments after a small delay to allow for backend processing
    setTimeout(() => {
      refetch();
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  if (!data?.config.enabled) {
    return null;
  }

  const { comments, pagination, config } = data;
  const commentCount = pagination.totalComments;

  return (
    <div className="my-16">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          Comments {commentCount > 0 && <span className="text-muted-foreground font-normal text-base">({commentCount})</span>}
        </h2>
      </div>

      <div className="rounded-lg border bg-background/50">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Join the conversation</h3>
          <CommentForm
            slug={slug}
            config={config}
            onSuccess={handleCommentSuccess}
          />
        </div>

        {comments.length > 0 && (
          <>
            <Separator />
            <div className="p-6">
              <h3 className="text-lg font-medium mb-6">
                {commentCount === 1
                  ? "1 comment"
                  : `${commentCount} comments`}
              </h3>
              <CommentList
                comments={comments}
                pagination={pagination}
                config={config}
                isLoading={false}
              />
            </div>
          </>
        )}

        {comments.length === 0 && (
          <div className="border-t py-8 px-6 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}