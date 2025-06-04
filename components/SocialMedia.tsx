import { Facebook, Github, Instagram, Linkedin, Slack, Youtube } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { siteConfig } from "@/constants/data";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

// Function to get icon component by name
const getIconByName = (iconName: string) => {
  switch (iconName) {
    case "Youtube":
      return <Youtube className="w-5 h-5" />;
    case "Github":
      return <Github className="w-5 h-5" />;
    case "Linkedin":
      return <Linkedin className="w-5 h-5" />;
    case "Facebook":
      return <Facebook className="w-5 h-5" />;
    case "Instagram":
      return <Instagram className="w-5 h-5" />;
    case "Slack":
      return <Slack className="w-5 h-5" />;
    default:
      return <></>;
  }
};

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {siteConfig.socialMedia.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <Link
                key={item.title}
                target="_blank"
                rel="noopener noreferrer"
                href={item.href}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect",
                  iconClassName
                )}
              >
                {getIconByName(item.icon)}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
