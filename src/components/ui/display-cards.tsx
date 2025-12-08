"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  coverImage?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-gray-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "bg-gray-900",
  titleClassName,
  coverImage,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-60 w-[36rem] -skew-y-[8deg] select-none rounded-xl border-2 overflow-hidden transition-all duration-700 hover:border-white/20 bg-white/90 backdrop-blur-sm cursor-pointer group",
        className
      )}
    >
      {/* Gradient overlay (after pseudo-element replacement) */}
      <div className="absolute -right-1 top-[-5%] h-[110%] w-[28rem] bg-gradient-to-l from-background to-transparent z-[1]"></div>
      
      {/* Content */}
      <div className="relative z-10 px-8 py-6 flex items-center gap-6 h-full w-full">
        {/* Cover Image Square */}
        {coverImage && (
          <div className="relative w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        )}
        
        {/* Text Content */}
        <div className="flex flex-col justify-between h-full flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("relative inline-block rounded-full p-2 flex-shrink-0", iconClassName)}>
              {icon}
            </span>
            <p className={cn("text-2xl font-semibold text-gray-900 group-hover:text-[#FF6B00] transition-colors duration-300", titleClassName)}>{title}</p>
          </div>
          <p className="text-xl text-gray-700">{description}</p>
          <p className="text-gray-500 text-base">{date}</p>
        </div>
      </div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      icon: <Sparkles className="size-4 text-gray-300" />,
      title: "Featured",
      description: "Discover amazing content",
      date: "Just now",
      iconClassName: "bg-gray-900",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="size-4 text-gray-300" />,
      title: "Popular",
      description: "Trending this week",
      date: "2 days ago",
      iconClassName: "bg-gray-900",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="size-4 text-gray-300" />,
      title: "New",
      description: "Latest updates and features",
      date: "Today",
      iconClassName: "bg-gray-900",
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 -ml-12">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
