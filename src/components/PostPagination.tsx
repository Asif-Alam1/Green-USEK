import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const constructPath = ({
  basePath,
  page,
  query,
}: {
  basePath: string;
  page?: string;
  query?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (page) searchParams.append("page", page);
  if (query) searchParams.append("query", query);
  return `${basePath}?${searchParams.toString()}`;
};

export const PostPagination = ({
  pagination,
  basePath = "/",
  query,
  numSiblingPages = 2,
  className,
}: {
  className?: string;
  basePath?: string;
  query?: string;
  numSiblingPages?: number;
  pagination: {
    page: number;
    limit: number | "all";
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}) => {
  const buildPath = (page: number) =>
    constructPath({ basePath, page: page.toString(), query });

  // Don't render pagination if there's only one page
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("w-full flex flex-col items-center gap-2", className)}>
      <Pagination className=" backdrop-blur-sm p-1 ">
        <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-0">
          {pagination.prevPage && (
            <PaginationItem>
              <PaginationPrevious
                href={buildPath(pagination.prevPage)}
                className="group transition-all duration-200 hover:scale-105 hover:bg-primary/5"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </PaginationPrevious>
            </PaginationItem>
          )}

          <div className="hidden md:flex items-center">
            {pagination.page > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href={buildPath(1)}
                    className="hover:bg-primary/5 hover:scale-105 transition-all duration-200"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis className="mx-1" />
              </>
            )}

            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  Math.abs(pagination.page - pageNumber) <= numSiblingPages
              )
              .map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={buildPath(pageNumber)}
                    isActive={pageNumber === pagination.page}
                    className={cn(
                      "transition-all duration-200 min-w-9 hover:scale-105",
                      pageNumber === pagination.page
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm"
                        : "hover:bg-primary/5"
                    )}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {pagination.page < pagination.totalPages - 2 && (
              <>
                <PaginationEllipsis className="mx-1" />
                <PaginationItem>
                  <PaginationLink
                    href={buildPath(pagination.totalPages)}
                    className="hover:bg-primary/5 hover:scale-105 transition-all duration-200"
                  >
                    {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
          </div>

          {/* Mobile optimized page indicator */}
          <div className="md:hidden flex items-center mx-2">
            <span className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>

          {pagination.nextPage && (
            <PaginationItem>
              <PaginationNext
                href={buildPath(pagination.nextPage)}
                className="group transition-all duration-200 hover:scale-105 hover:bg-primary/5"
                aria-label="Go to next page"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>


    </div>
  );
};