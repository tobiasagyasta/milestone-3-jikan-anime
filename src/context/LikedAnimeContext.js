"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";


// Create context
const LikedAnimeContext = createContext();

// Create provider component
export function LikedAnimeProvider({ children }) {
  const { data: session, status } = useSession();
  const [likedAnime, setLikedAnime] = useState([]);
  const [numberOfLikes, setNumberOfLikes] = useState(0);

  // Load liked anime from localStorage on initial render
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === 'customer') {
      const storedLikedAnime = localStorage.getItem(`likedAnime_${session.user.id}`);
      if (storedLikedAnime) {
        try {
          const parsed = JSON.parse(storedLikedAnime);
          setLikedAnime(parsed);
          setNumberOfLikes(parsed.length);
        } catch (error) {
          console.error('Error parsing stored likes:', error);
          setLikedAnime([]);
        }
      }
    } else {
      setLikedAnime([]);
      setNumberOfLikes(0);
    }
  }, [session, status]);

  // Save to localStorage whenever likedAnime changes
  useEffect(() => {
    if (session?.user?.id && session?.user?.role === 'customer') {
      try {
        localStorage.setItem(`likedAnime_${session.user.id}`, JSON.stringify(likedAnime));
        setNumberOfLikes(likedAnime.length);
      } catch (error) {
        console.error('Error saving likes:', error);
      }
    }
  }, [likedAnime, session]);

  // Toggle like status for an anime
  const toggleLike = (anime) => {
    if (!session?.user?.id || session?.user?.role !== 'customer') {
      console.log('Only logged-in customers can like anime');
      return;
    }

    setLikedAnime((prevLikedAnime) => {
      const isLiked = prevLikedAnime.some(
        (item) => item.mal_id === anime.mal_id
      );

      if (isLiked) {
        return prevLikedAnime.filter((item) => item.mal_id !== anime.mal_id);
      } else {
        return [...prevLikedAnime, anime];
      }
    });
  };

  // Check if an anime is liked
  const isAnimeLiked = (animeId) => {
    if (!session?.user?.id || session?.user?.role !== 'customer') return false;
    return likedAnime.some((anime) => anime.mal_id === animeId);
  };

  // Get all liked anime
  const getAllLikedAnime = () => {
    if (!session?.user?.id || session?.user?.role !== 'customer') return [];
    return likedAnime;
  };

  // Context value
  const value = {
    likedAnime,
    toggleLike,
    isAnimeLiked,
    getAllLikedAnime,
    numberOfLikes: likedAnime.length,
    isCustomer: session?.user?.role === 'customer',
    userId: session?.user?.id
  };

  return (
    <LikedAnimeContext.Provider value={value}>
      {children}
    </LikedAnimeContext.Provider>
  );
}

// Custom hook to use the context
export function useLikedAnime() {
  const context = useContext(LikedAnimeContext);
  if (context === undefined) {
    throw new Error("useLikedAnime must be used within a LikedAnimeProvider");
  }
  return context;
}
