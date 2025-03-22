"use client";

import React, { useState, useEffect } from "react";
import slugify from "slugify";
import { parse } from "node-html-parser";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface HeaderConfig {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface ProcessedContent {
  modifiedHtml: string;
  tableOfContents: TableOfContentsItem[];
}

export const processTableOfContents = (
  rawHtml: string,
  headerConfig: HeaderConfig
): ProcessedContent => {
  // Using node-html-parser to parse the HTML
  const root = parse(rawHtml);
  const headers = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const tableOfContents: TableOfContentsItem[] = [];
  const usedIds = new Set<string>();

  headers.forEach((header) => {
    const level = parseInt(header.tagName.charAt(1));
    if (headerConfig[`h${level}` as keyof HeaderConfig]) {
      const text = header.rawText || ""; // Changed to rawText for node-html-parser
      const id = slugify(text, { lower: true, strict: true });

      // Ensure unique IDs
      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter}`;
        counter++;
      }
      usedIds.add(uniqueId);

      header.setAttribute("id", uniqueId); // Changed to setAttribute for node-html-parser
      tableOfContents.push({
        id: uniqueId,
        text,
        level,
      });
    }
  });

  return {
    modifiedHtml: root.toString(), // Changed to toString() for node-html-parser
    tableOfContents,
  };
};

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>("");

  // Track the current active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Find all the section headings
      const headings = items.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(heading => heading.element !== null);

      if (headings.length === 0) return;

      // Find the heading that's currently at the top of the viewport
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i].element;
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  // Group TOC items into sections by their top-level parents
  const sections = items.reduce((acc, item) => {
    // Only consider h2s as section breaks
    if (item.level === 2) {
      acc.push({
        parent: item,
        children: []
      });
    } else if (item.level > 2 && acc.length > 0) {
      acc[acc.length - 1].children.push(item);
    } else if (acc.length === 0) {
      // If we start with h3+ without a parent h2
      acc.push({
        parent: null,
        children: [item]
      });
    }
    return acc;
  }, [] as { parent: TableOfContentsItem | null; children: TableOfContentsItem[] }[]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset to avoid header overlap
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 flex items-center border-b">
        <Badge variant="outline" className="mr-2 bg-primary/10">
          {items.length}
        </Badge>
        <h3 className="font-medium">Table of Contents</h3>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] max-h-96 p-4">
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <div key={index} className="space-y-1">
              {section.parent && (
                <button
                  onClick={() => scrollToSection(section.parent!.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    activeId === section.parent!.id ? "bg-accent text-accent-foreground font-medium" : "text-foreground/70"
                  )}
                >
                  <span className="truncate">{section.parent.text}</span>
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    section.children.some(child => activeId === child.id) && "rotate-90"
                  )} />
                </button>
              )}

              {section.children.length > 0 && (
                <div className="ml-4 border-l pl-2 space-y-1">
                  {section.children.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        activeId === item.id ? "bg-accent/50 text-accent-foreground font-medium" : "text-foreground/60",
                        `ml-${Math.min((item.level - 2) * 2, 6)}`
                      )}
                    >
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Fallback for flat structure if no h2s exist */}
          {sections.length === 0 && items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                activeId === item.id ? "bg-accent text-accent-foreground font-medium" : "text-foreground/70",
                `ml-${Math.min((item.level - 1) * 2, 8)}`
              )}
            >
              <span className="truncate">{item.text}</span>
            </button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};