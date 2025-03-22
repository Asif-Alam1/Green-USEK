"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { wisp } from "@/lib/wisp";
import { useQuery } from "@tanstack/react-query";

export interface Tag {
  id: string;
  name: string;
  description: string | null;
  teamId: string;
}

export interface BlogNavigationBarProps {
  className?: string;
  active: string;
}

export const FilterBar = ({ className, active }: BlogNavigationBarProps) => {
  const param = useSearchParams();
  const [searchText, setSearchText] = useState<string>(
    param.get("query") || ""
  );
  const [isSearchActive, setIsSearchActive] = useState(
    param.get("query") !== null && param.get("query") !== ""
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch tags from Wisp CMS
  const { data: tagsData, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const tagResult = await wisp.getTags({ limit: "all" });
      return tagResult.tags;
    },
  });

  // Combine the "Latest" category with the fetched tags
  const categories = [
    { label: "Latest", tag: "latest" },
    ...(tagsData?.map(tag => ({ label: tag.name, tag: tag.name })) || [])
  ];

  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();
    }
  }, [isSearchActive]);

  const onHandleKey = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchText === "") {
        router.push("/");
      } else {
        const urlPath = `/?query=${encodeURIComponent(searchText)}`;
        router.push(urlPath);
      }
    }
    if (e.key === "Escape") {
      setIsSearchActive(false);
    }
  };

  const onClearSearch = () => {
    setIsSearchActive(false);
    if (
      searchText === "" &&
      !(param.get("query") === "" || param.get("query") === null)
    ) {
      router.push("/");
    }
  };

  return (
    <div className={cn("rounded-lg shadow-sm bg-white dark:bg-gray-800 px-4 py-3", className)}>
      {isSearchActive ? (
        <div className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-background px-1 py-1">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search articles..."
            className="w-full border-none bg-transparent px-1 py-1 focus-visible:outline-none"
            onKeyUp={(e) => onHandleKey(e)}
            onBlur={onClearSearch}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={onClearSearch}
            className="ml-2 rounded-full p-1 hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-3 whitespace-nowrap overflow-x-auto scrollbar-hide pb-1">
            {isLoading ? (
              <div className="py-1 px-3 text-muted-foreground animate-pulse">
                <div className="h-6 w-24 bg-muted rounded-full"></div>
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  href={
                    category.tag === "latest" ? `/` : `/category/${category.tag}`
                  }
                  key={category.tag}
                >
                  <div
                    className={cn(
                      "py-1.5 px-4 text-sm font-medium transition-all duration-200",
                      active === category.tag
                        ? "border-b-2 border-primary font-semibold"
                        : "text-muted-foreground hover:border-b-2 hover:border-gray-300 hover:text-primary"
                    )}
                  >
                    {category.label}
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={() => setIsSearchActive(true)}
              className="rounded-full p-2 bg-muted/50 hover:bg-muted transition-colors"
              aria-label="Search articles"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};