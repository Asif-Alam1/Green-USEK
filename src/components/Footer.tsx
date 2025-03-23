import { config } from "@/config";
import { Button } from "./ui/button";
import { Rss } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="container mx-auto my-4 px-4 max-w-6xl">
      <div className="flex justify-between items-center">
        <div className="text-sm mt-4">
          © {config.organization} {new Date().getFullYear()}
        </div>
        <Link href="/rss">
          <Button variant="ghost">
            <Rss className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
