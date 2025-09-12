import { Github, Star } from "lucide-react";
import { useEffect, useState } from "react";

export function GitHubStar({
  className = "",
  size = "default",
  showText = true,
}) {
  const [starCount, setStarCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ilijaleko/city-kebab"
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

  const handleGitHubClick = () => {
    window.open(
      "https://github.com/ilijaleko/city-kebab",
      "_blank",
      "noopener,noreferrer"
    );
  };

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

  const formatStarCount = (count) => {
    if (count === null) return "";
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  return (
    <button
      onClick={handleGitHubClick}
      className={`
        inline-flex items-center gap-2 font-medium rounded-md
        bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900/20
        text-orange-600 dark:text-orange-400
        border border-orange-300 dark:border-orange-600 hover:border-orange-400 dark:hover:border-orange-500
        shadow-sm hover:shadow-md
        transition-all duration-200 ease-in-out
        hover:scale-105
        active:scale-95
        ${sizeClasses[size]} ${className}
      `}
    >
      <div className="flex items-center gap-1.5">
        <Github
          className={`${iconSizes[size]} text-orange-600 dark:text-orange-400`}
        />
        <Star className={`${iconSizes[size]} text-orange-500`} />
      </div>
      {showText && (
        <span className="whitespace-nowrap">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {formatStarCount(starCount)}
              {starCount !== null && (
                <span className="ml-1 opacity-75">
                  {size === "sm" ? "" : "stars"}
                </span>
              )}
            </>
          )}
        </span>
      )}
    </button>
  );
}
