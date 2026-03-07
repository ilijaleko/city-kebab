"use client";

import { Github, Star } from "lucide-react";
import { useEffect, useState } from "react";

type GitHubStarProps = {
  className?: string;
  size?: "sm" | "default" | "lg";
  showText?: boolean;
};

export function GitHubStar({
  className = "",
  size = "default",
  showText = true,
}: GitHubStarProps) {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ilijaleko/city-kebab",
        );
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.log("Failed to fetch star count:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStarCount();
  }, []);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const formatStarCount = (count: number | null) => {
    if (count === null) return "";
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  return (
    <a
      href="https://github.com/ilijaleko/city-kebab"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 font-medium rounded-md
        bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800
        text-stone-600 dark:text-stone-300
        border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600
        shadow-sm hover:shadow-md
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        ${sizeClasses[size]} ${className}
      `}
    >
      <div className="flex items-center gap-1.5">
        <Github
          className={`${iconSizes[size]} text-stone-600 dark:text-stone-300`}
        />
        <Star className={`${iconSizes[size]} text-yellow-500`} />
      </div>
      {showText && (
        <span className="whitespace-nowrap">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {formatStarCount(starCount)}
              {starCount !== null && size !== "sm" && (
                <span className="ml-1 opacity-75">stars</span>
              )}
            </>
          )}
        </span>
      )}
    </a>
  );
}
