import axios from 'axios';

// TMDB API Configuration
const API_KEY = '7dc0a31bc3e4553975ab381799b771fe';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  },
  timeout: 10000, // 10 seconds timeout
});


// ==================== MOVIE DISCOVERY APIs ====================

/**
 * Get movies by category
 * @param {string} category - Movie category (now_playing, popular, top_rated, upcoming)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} API response with movie results
 */
export const getMoviesByCategory = async (category = 'now_playing', page=1) => {
  try {
    const response = await api.get(`/movie/${category}`, {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results || [],
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      currentPage: response.data.page
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get all popular movies
 * @param {number} page - Page number
 * @returns {Promise} API response with popular movies
 */
export const getAllPopularMovies = async (page = 1) => {
  return getMoviesByCategory('popular', page);
};

/**
 * Get all top rated movies
 * @param {number} page - Page number
 * @returns {Promise} API response with top rated movies
 */
export const getAllTopRatedMovies = async (page = 1) => {
  return getMoviesByCategory('top_rated', page);
};

/**
 * Get all now playing movies
 * @param {number} page - Page number
 * @returns {Promise} API response with now playing movies
 */
export const getAllNowPlayingMovies = async (page = 1) => {
  return getMoviesByCategory('now_playing', page);
};

/**
 * Get all upcoming movies
 * @param {number} page - Page number
 * @returns {Promise} API response with upcoming movies
 */
export const getAllUpcomingMovies = async (page = 1) => {
  return getMoviesByCategory('upcoming', page);
};

// ==================== SEARCH APIs ====================

/**
 * Search for movies
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @param {boolean} includeAdult - Include adult content (default: false)
 * @returns {Promise} API response with search results
 */
export const searchMovies = async (query, page = 1, includeAdult = false) => {
  if (!query || query.trim().length === 0) {
    return {
      success: false,
      error: 'Search query cannot be empty',
      data: []
    };
  }

  try {
    const response = await api.get('/search/movie', {
      params: {
        query: query.trim(),
        page,
        include_adult: includeAdult
      }
    });

    return {
      success: true,
      data: response.data.results || [],
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      currentPage: response.data.page,
      query: query.trim()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get search suggestions (limited results for autocomplete)
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results (default: 5)
 * @returns {Promise} API response with limited search results
 */
export const getSearchSuggestions = async (query, limit = 5) => {
  const result = await searchMovies(query, 1);
  if (result.success) {
    return {
      ...result,
      data: result.data.slice(0, limit)
    };
  }
  return result;
};

// ==================== MOVIE DETAILS APIs ====================

/**
 * Get detailed movie information
 * @param {number} movieId - Movie ID
 * @returns {Promise} API response with movie details
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar,reviews,images'
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Get movie credits (cast and crew)
 * @param {number} movieId - Movie ID
 * @returns {Promise} API response with movie credits
 */
export const getMovieCredits = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/credits`);
    return {
      success: true,
      data: {
        cast: response.data.cast || [],
        crew: response.data.crew || []
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: { cast: [], crew: [] }
    };
  }
};

/**
 * Get movie videos (trailers, teasers, etc.)
 * @param {number} movieId - Movie ID
 * @returns {Promise} API response with movie videos
 */
export const getMovieVideos = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`);
    return {
      success: true,
      data: response.data.results || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get similar movies
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number
 * @returns {Promise} API response with similar movies
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await api.get(`/movie/${movieId}/similar`, {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results || [],
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get movie reviews
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number
 * @returns {Promise} API response with movie reviews
 */
export const getMovieReviews = async (movieId, page = 1) => {
  try {
    const response = await api.get(`/movie/${movieId}/reviews`, {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results || [],
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};



// ==================== TRENDING APIs ====================

/**
 * Get trending movies
 * @param {string} timeWindow - Time window ('day' or 'week')
 * @returns {Promise} API response with trending movies
 */
export const getTrendingMovies = async (timeWindow = 'week') => {
  try {
    const response = await api.get(`/trending/movie/${timeWindow}`);
    return {
      success: true,
      data: response.data.results || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get full image URL
 * @param {string} imagePath - Image path from TMDB
 * @param {string} size - Image size (w92, w154, w185, w342, w500, w780, original)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath, size = 'w500') => {
  if (!imagePath) return null;
  return `${IMAGE_BASE_URL}/${size}${imagePath}`;
};

/**
 * Get placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string} Placeholder image URL
 */


/**
 * Get movie image with fallback
 * @param {Object} movie - Movie object
 * @param {string} type - Image type ('poster' or 'backdrop')
 * @param {string} size - Image size
 * @returns {string} Image URL with fallback
 */
export const getMovieImage = (movie, type = 'poster', size = 'w500') => {
//   if (!movie) return getPlaceholderUrl();
  
  const imagePath = type === 'backdrop' ? movie.backdrop_path : movie.poster_path;
  const fallbackPath = type === 'backdrop' ? movie.poster_path : movie.backdrop_path;
  
  if (imagePath) {
    return getImageUrl(imagePath, size);
  } else if (fallbackPath) {
    return getImageUrl(fallbackPath, size);
  } 

};

/**
 * Format movie release date
 * @param {string} dateString - Release date string
 * @returns {Object} Formatted date information
 */
export const formatReleaseDate = (dateString) => {
  if (!dateString) return { year: 'Unknown', formatted: 'Unknown' };
  
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    formatted: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
};

/**
 * Format movie rating
 * @param {number} rating - Vote average
 * @returns {string} Formatted rating
 */
export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'N/A';
  return rating.toFixed(1);
};

/**
 * Get genre names from genre IDs
 * @param {Array} genreIds - Array of genre IDs
 * @returns {Array} Array of genre names
 */
export const getGenreNames = (genreIds) => {
  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  if (!genreIds || !Array.isArray(genreIds)) return [];
  
  return genreIds.map(id => genreMap[id] || `Genre ${id}`);
};

// ==================== CONFIGURATION ====================




// Export API key and base URLs for direct use if needed
export { API_KEY, BASE_URL, IMAGE_BASE_URL };

// Export the axios instance for custom requests
export { api };

// Default export
export default {
  // Movie discovery
  getMoviesByCategory,
  getAllPopularMovies,
  getAllTopRatedMovies,
  getAllNowPlayingMovies,
  getAllUpcomingMovies,
  getTrendingMovies,
  
  // Search
  searchMovies,
  getSearchSuggestions,
  
  // Movie details
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getMovieReviews,
  
  
  // Utilities
  getImageUrl,
  getMovieImage,
  formatReleaseDate,
  formatRating,
  getGenreNames,
};