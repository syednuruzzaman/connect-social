"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string;
  type: 'user' | 'post';
}

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
}

const SearchBox = ({ className = "", placeholder = "Search Connect..." }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Real search function that calls the API
  const searchUsers = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search API error:', error);
      // Fallback to mock data for development
      return [];
    }
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    
    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      
      try {
        const searchResults = await searchUsers(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear debounce on unmount
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className='flex p-2 bg-slate-100 items-center rounded-xl'>
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
          onFocus={() => query && setIsOpen(true)}
        />
        {isLoading ? (
          <div className="w-3.5 h-3.5 ml-2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        ) : (
          <Image src="/search.png" alt="Search" width={14} height={14} className="ml-2"/>
        )}
      </div>
      
      {/* Search Results Dropdown - Only render after mounting to prevent hydration issues */}
      {isMounted && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mr-2" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <Link
                key={result.id}
                href={`/profile/${result.username}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
              >
                <Image
                  src={result.avatar}
                  alt={result.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{result.name}</div>
                  <div className="text-xs text-gray-500">@{result.username}</div>
                </div>
              </Link>
            ))
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No users found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
