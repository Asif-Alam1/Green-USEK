import { config } from "@/config";
import { Button } from "./ui/button";
import { Rss } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full flex bg-green-300 py-16 justify-center">
      <div className="w-9/12 items-center flex justify-between">
        <div className="">
          © {config.organization} {new Date().getFullYear()}
        </div>
        <div className="flex flex-row gap-5">
          <div>instagram</div>
          <div>Linkedin</div>
        </div>
        {/* <div className="text-xs text-muted-foreground hidden lg:block">
          <Link
            href={`https://wisp.blog/?utm_source=next-js-template&utm_medium=web&utm_campaign=${config.baseUrl}`}
          >
            Blog powered by wisp
          </Link>
        </div>
        <Link href="/rss">
          <Button variant="ghost">
            <Rss className="w-4 h-4" />
          </Button>
        </Link> */}
      </div>
    </div>
  );
};
