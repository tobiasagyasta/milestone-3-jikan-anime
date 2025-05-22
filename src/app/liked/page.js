"use client";

import { useState, useEffect } from "react";
import { useLikedAnime } from "@/context/LikedAnimeContext";
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LikedAnimePage() {
  const { getAllLikedAnime } = useLikedAnime();
  const [likedAnime, setLikedAnime] = useState([]);

  useEffect(() => {
    // Get all liked anime from context
    const liked = getAllLikedAnime();
    setLikedAnime(liked);
  }, [getAllLikedAnime]);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href={"/"}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          Your Liked Anime
        </h1>

        {likedAnime.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              You haven't liked any anime yet.
            </p>
            <Link
              href={"/"}
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Discover Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
