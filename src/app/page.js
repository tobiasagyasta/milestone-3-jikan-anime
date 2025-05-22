"use client"; // CSR

import { useState, useEffect } from "react";
import Head from "next/head";
import SearchBar from "../components/SearchBar";
import AnimeCard from "../components/AnimeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Navigation from "../components/Navigation";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnimeList, setTopAnimeList] = useState([]); // Add new state
  const [isLoading, setIsLoading] = useState(false);
  const [isTopLoading, setIsTopLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Add useEffect to fetch top anime when component mounts
  useEffect(() => {
    const fetchTopAnime = async () => {
      setIsTopLoading(true);
      try {
        const response = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=bypopularity&sfw=true&limit=25"
        );
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setTopAnimeList(data.data || []);
      } catch (err) {
        console.error("Error fetching top anime:", err);
      } finally {
        setIsTopLoading(false);
      }
    };

    fetchTopAnime();
  }, []);

  const searchAnime = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          query
        )}&sfw=true&type=tv`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setAnimeList(data.data || []);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setError("Failed to fetch anime. Please try again later.", err.message);
      setAnimeList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setAnimeList([]);
    setSearchPerformed(false);
    setError(null);
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>Anime Search App</title>
        <meta
          name="description"
          content="Search for your favorite anime shows, using Jikan API"
        />
      </Head>

      <Navigation />
      <main className="max-w-7xl mx-auto pt-4">
        <SearchBar onSearch={searchAnime} />

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400 py-4">
            {error}
          </div>
        ) : searchPerformed ? (
          <>
            {animeList.length === 0 ? (
              <div className="text-center py-4 dark:text-gray-300">
                No results found. Try a different search term.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animeList.map((anime, index) => (
                  <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
                ))}
              </div>
            )}
            <button
              onClick={resetSearch}
              className="mx-auto mt-6 block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Back to Top Anime
            </button>
          </>
        ) : (
          <>
            <h1 className="mx-auto text-center text-2xl font-bold mt-4 underline underline-offset-4 dark:text-white">
              Top Animes to watch!
            </h1>
            {isTopLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topAnimeList.map((anime, index) => (
                  <AnimeCard
                    key={`top-${anime.mal_id}-${index}`}
                    anime={anime}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
