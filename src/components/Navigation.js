"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useLikedAnime } from "@/context/LikedAnimeContext";
import { Sun, Moon, Heart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { numberOfLikes } = useLikedAnime();

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
      <div>
        <Link
          href={"/"}
          className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Toby's Anime List
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
        {session?.user?.role === "customer" && (
          <Link
            href={"/liked"}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>Liked Anime</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">
              {numberOfLikes}
            </span>
          </Link>
        )}

        <Link
          href={"/about"}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          About
        </Link>

        {status === "authenticated" && session?.user?.role === "admin" && (
          <Link
            href={session?.user?.role === "admin" ? "/dashboard" : "/profile"}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {session?.user?.role === "admin" ? "Dashboard" : "Profile"}
          </Link>
        )}
        {status === "authenticated" ? (
          <>
            {" "}
            <button
              onClick={() => signOut()}
              className="text-gray-700 cursor-pointer dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Sign out"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            {" "}
            <Link
              href={"/login"}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
