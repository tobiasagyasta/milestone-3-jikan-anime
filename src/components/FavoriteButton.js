"use client";
import { Heart } from "lucide-react";
import { useLikedAnime } from "@/context/LikedAnimeContext";
import { useSession } from "next-auth/react";

const FavoriteButton = ({ anime }) => {
  const { toggleLike, isAnimeLiked, isCustomer } = useLikedAnime();
  const { data: session, status } = useSession();
  const isFavorited = anime ? isAnimeLiked(anime.mal_id) : false;

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session || !isCustomer || !anime) return;
    toggleLike(anime);
  };

  if (status === "loading") {
    return (
      <button disabled className="flex items-center gap-2 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 opacity-50">
        <Heart className="w-6 h-6 stroke-gray-400" />
        <span className="text-gray-500">Loading...</span>
      </button>
    );
  }

  if (!session || !isCustomer) {
    return (
      <button
        disabled
        className="flex items-center gap-2 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 cursor-not-allowed opacity-70"
      >
        <Heart className="w-6 h-6 stroke-gray-400 dark:stroke-gray-500" />
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {!session ? "Login to like" : "Customers only"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleLike}
      className={`flex items-center gap-2 p-2 rounded-full transition-all duration-200 ${
        isFavorited
          ? "bg-red-50 dark:bg-red-900/20"
          : "bg-white/80 dark:bg-zinc-800/80 hover:bg-gray-100 dark:hover:bg-zinc-700"
      }`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`w-6 h-6 transition-colors duration-200 ${
          isFavorited
            ? "fill-red-500 stroke-red-500"
            : "stroke-gray-600 dark:stroke-gray-300"
        }`}
      />
      <span className={`font-medium transition-colors duration-200 ${
        isFavorited
          ? "text-red-500 dark:text-red-400"
          : "text-gray-700 dark:text-gray-200"
      }`}>
        {isFavorited ? "Liked!" : "Like this anime!"}
      </span>
    </button>
  );
};

export default FavoriteButton;
