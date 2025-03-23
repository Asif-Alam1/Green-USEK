"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Shield, Send, Loader2, User, Mail, Link as LinkIcon, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { wisp } from "../lib/wisp";

const formSchema = z.object({
  author: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  url: z
    .union([z.string().url("Please enter a valid URL"), z.string().max(0)])
    .optional(),
  content: z.string().min(1, "Comment cannot be empty"),
  allowEmailUsage: z.boolean(),
});

interface CommentFormProps {
  slug: string;
  config: {
    enabled: boolean;
    allowUrls: boolean;
    allowNested: boolean;
    signUpMessage: string | null;
  };
  parentId?: string;
  onSuccess?: () => void;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}

interface CreateCommentRequest {
  slug: string;
  author: string;
  email: string;
  url?: string;
  content: string;
  allowEmailUsage: boolean;
  parentId?: string;
}

export function CommentForm({ slug, config, parentId, onSuccess }: CommentFormProps) {
  const { toast } = useToast();
  const { mutateAsync: createComment, data, isLoading } = useMutation({
    mutationFn: async (input: CreateCommentRequest) => {
      try {
        return await wisp.createComment(input);
      } catch (e) {
        if (e instanceof AxiosError) {
          const errorData = e.response?.data as ErrorResponse | undefined;
          if (errorData?.error?.message) {
            throw new Error(errorData.error.message);
          }
        }
        throw e;
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      email: "",
      url: "",
      content: "",
      allowEmailUsage: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createComment({
        ...values,
        slug,
        parentId,
      });
      if (onSuccess) {
        onSuccess();
      }
      form.reset();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Error posting comment",
          description: e.message,
          variant: "destructive",
        });
      }
    }
  };

  if (data && data.success) {
    return (
      <Alert className="bg-primary/5 border-primary/20">
        <AlertDescription className="space-y-4 text-center">
          <Shield className="text-primary mx-auto h-12 w-12 opacity-80" />
          <div className="font-medium text-lg">Verification email sent</div>
          <div className="text-muted-foreground m-auto max-w-lg text-balance">
            Thanks for your comment! Please check your email to verify and publish your comment.
            If you don't see it in your inbox within a few minutes, please check your spam folder.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className="focus-visible:ring-1 focus-visible:ring-inset transition-shadow"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="focus-visible:ring-1 focus-visible:ring-inset transition-shadow"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {config.allowUrls && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Website (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    className="focus-visible:ring-1 focus-visible:ring-inset transition-shadow"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                Your comment
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts..."
                  className="min-h-[120px] resize-y focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-offset-0 transition-shadow"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {config.signUpMessage && (
          <FormField
            control={form.control}
            name="allowEmailUsage"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0 rounded-md p-4 border bg-muted/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal leading-relaxed">
                    {config.signUpMessage}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading || form.formState.isSubmitting}
            className="relative group"
          >
            {(isLoading || form.formState.isSubmitting) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Post Comment
                <Send className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}