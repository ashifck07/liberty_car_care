import React, { useEffect, useRef, useState } from 'react';
import { getSearchSuggestions, getMovieImage, formatRating } from '../../Api/api';
import MovieModal from '../modal/MovieModal';
import search_icon from '../../assets/search_icon.svg';

const MovieSearch = ({ showSearch, onSearchToggle }) => {
  const searchRef = useRef();
  const dropdownRef = useRef();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // Auto-focus when search input appears
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [showSearch]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 1) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('movieSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 5)); // Limit to 5 recent searches
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save search to history
  const saveToHistory = (query) => {
    try {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('movieSearchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowDropdown(true);
    setError(null);

    try {
      const result = await getSearchSuggestions(query, 5);
      
      if (result.success) {
        setSearchResults(result.data || []);
        if (result.data.length === 0) {
          setError('No movies found for your search');
        }
      } else {
        setError(result.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToHistory(searchQuery.trim());
      performSearch(searchQuery);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    setShowDropdown(false);
    onSearchToggle(); // Close search input
    setSearchQuery('');
  };

  const handleHistoryClick = (historyQuery) => {
    setSearchQuery(historyQuery);
    performSearch(historyQuery);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('movieSearchHistory');
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleSearchIconClick = () => {
    onSearchToggle();
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
      setError(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showModal) {
          closeModal();
        } else if (showSearch) {
          onSearchToggle();
          setSearchQuery('');
          setShowDropdown(false);
          setError(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showModal, showSearch, onSearchToggle]);

  return (
    <>
      {/* Search Section */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center">
          {/* Search Input - appears when showSearch is true */}
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="mr-3">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.length > 2 || searchHistory.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="Search movies..."
                  className="w-64 max-md:w-48 max-sm:w-32 px-4 py-2 pr-10 bg-black/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          )}
          
          {/* Search Icon */}
          <img 
            src={search_icon} 
            alt="Search" 
            className='w-5 cursor-pointer hover:opacity-80 transition-opacity'
            onClick={handleSearchIconClick}
          />
        </div>

        {/* Search Dropdown */}
        {showDropdown && showSearch && (
          <div className="absolute top-12 right-0 w-80 max-md:w-72 max-sm:w-64 bg-black/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
            
            {/* Search History */}
            {searchHistory.length > 0 && searchQuery.length <= 2 && !isSearching && (
              <div className="border-b border-gray-800/30">
                <div className="flex items-center justify-between p-3 bg-gray-800/30">
                  <span className="text-xs text-gray-400 font-medium">Recent Searches</span>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {searchHistory.map((historyQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyQuery)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300 text-sm">{historyQuery}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Loading State */}
            {isSearching && (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Searching...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isSearching && (
              <div className="p-4 text-center">
                <div className="text-red-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-400 text-sm mb-2">Search Error</p>
                <p className="text-red-300 text-xs">{error}</p>
                <button
                  onClick={() => performSearch(searchQuery)}
                  className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && !isSearching && !error && (
              <div className="overflow-y-auto max-h-80">
                <div className="px-3 py-2 bg-gray-800/30 border-b border-gray-800/30">
                  <span className="text-xs text-gray-400 font-medium">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {searchResults.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleMovieClick(movie)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors text-left border-b border-gray-800/30 last:border-b-0"
                  >
                    <img
                      src={getMovieImage(movie, 'poster', 'w92')}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <span>
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                        </span>
                        {movie.vote_average > 0 && (
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{formatRating(movie.vote_average)}</span>
                          </div>
                        )}
                        {movie.popularity && (
                          <span className="text-xs bg-gray-700/70 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      {movie.overview && (
                        <p className="text-xs text-gray-500 truncate">
                          {movie.overview.length > 60 
                            ? `${movie.overview.substring(0, 60)}...` 
                            : movie.overview
                          }
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchQuery.length > 2 && !isSearching && searchResults.length === 0 && !error && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mb-1">No movies found</p>
                <p className="text-gray-500 text-xs">Try a different search term</p>
              </div>
            )}

            {/* Empty state when no search query and no history */}
            {searchQuery.length <= 2 && searchHistory.length === 0 && !isSearching && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mb-1">Start typing to search</p>
                <p className="text-gray-500 text-xs">Find your favorite movies</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Movie Modal - Use the updated MovieModal component */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={showModal}
        onClose={closeModal}
      />
    </>
  );
};

export default MovieSearch;