import React, { useEffect, useState } from 'react';
import { 
  getMovieImage, 
  formatReleaseDate, 
  formatRating, 
  getGenreNames,
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies
} from '../../Api/api';

const MovieModal = ({ movie, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [movieVideos, setMovieVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Fetch additional movie data when modal opens
  useEffect(() => {
    if (isOpen && movie && movie.id) {
      fetchMovieData();
    }
  }, [isOpen, movie]);

  const fetchMovieData = async () => {
    if (!movie?.id) return;

    setLoading(true);
    try {
      // Fetch detailed movie information
      const detailsResult = await getMovieDetails(movie.id);
      if (detailsResult.success) {
        setMovieDetails(detailsResult.data);
      }

      // Fetch movie videos (trailers, etc.)
      const videosResult = await getMovieVideos(movie.id);
      if (videosResult.success) {
        // Filter for trailers and teasers
        const trailers = videosResult.data.filter(
          video => video.type === 'Trailer' || video.type === 'Teaser'
        );
        setMovieVideos(trailers.slice(0, 3)); // Limit to 3 videos
      }

      // Fetch similar movies
      const similarResult = await getSimilarMovies(movie.id);
      if (similarResult.success) {
        setSimilarMovies(similarResult.data.slice(0, 6)); // Limit to 6 similar movies
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setMovieDetails(null);
    setMovieVideos([]);
    setSimilarMovies([]);
    setActiveTab('overview');
    onClose();
  };

  if (!isOpen || !movie) {
    return null;
  }

  // Use detailed movie data if available, otherwise use basic movie data
  const displayMovie = movieDetails || movie;
  const releaseInfo = formatReleaseDate(displayMovie.release_date);
  const rating = formatRating(displayMovie.vote_average);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in fade-in duration-300">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 pb-6">
          {/* Hero Section */}
          <div className="mb-6 relative">
            <img
              src={getMovieImage(displayMovie, 'backdrop', 'w780')}
              alt={displayMovie.title}
              className="w-full h-60 md:h-80 object-cover rounded-lg"
              loading="lazy"
            />
            
            {/* Overlay with basic info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 rounded-b-lg">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {displayMovie.title || displayMovie.original_title}
              </h2>
              
              <div className="flex items-center gap-4 text-white/90 flex-wrap">
                <span className="text-lg">{releaseInfo.year}</span>
                
                {displayMovie.vote_average > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-xl">{rating}/10</span>
                    <span className="text-sm text-gray-300">
                      ({displayMovie.vote_count?.toLocaleString() || 0} votes)
                    </span>
                  </div>
                )}

                {displayMovie.runtime && (
                  <span className="text-sm bg-gray-700/70 px-3 py-1 rounded-full">
                    {Math.floor(displayMovie.runtime / 60)}h {displayMovie.runtime % 60}m
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play Now
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              My List
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Like
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-700">
            {['overview', 'details', 'videos', 'similar'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-white">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {displayMovie.overview && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Overview</h3>
                    <p className="text-gray-300 leading-relaxed text-base">
                      {displayMovie.overview}
                    </p>
                  </div>
                )}

                {/* Genres */}
                {(displayMovie.genres || displayMovie.genre_ids) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {displayMovie.genres 
                        ? displayMovie.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-300 transition-colors"
                            >
                              {genre.name}
                            </span>
                          ))
                        : getGenreNames(displayMovie.genre_ids).map((genreName, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-300 transition-colors"
                            >
                              {genreName}
                            </span>
                          ))
                      }
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {displayMovie.release_date && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Release Date</span>
                      <span className="text-gray-300">{releaseInfo.formatted}</span>
                    </div>
                  )}
                  
                  {displayMovie.original_language && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Original Language</span>
                      <span className="text-gray-300">
                        {displayMovie.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {displayMovie.budget && displayMovie.budget > 0 && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Budget</span>
                      <span className="text-gray-300">
                        ${displayMovie.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {displayMovie.revenue && displayMovie.revenue > 0 && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Revenue</span>
                      <span className="text-gray-300">
                        ${displayMovie.revenue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {displayMovie.popularity && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Popularity Score</span>
                      <span className="text-gray-300">{Math.round(displayMovie.popularity)}</span>
                    </div>
                  )}
                  
                  {displayMovie.production_companies && displayMovie.production_companies.length > 0 && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Production Companies</span>
                      <div className="text-gray-300">
                        {displayMovie.production_companies.map(company => company.name).join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {displayMovie.adult !== undefined && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Content Rating</span>
                      <span className="text-gray-300">
                        {displayMovie.adult ? 'Adults Only' : 'Family Friendly'}
                      </span>
                    </div>
                  )}
                  
                  {displayMovie.status && (
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Status</span>
                      <span className="text-gray-300">{displayMovie.status}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-400">Loading videos...</p>
                  </div>
                ) : movieVideos.length > 0 ? (
                  <div className="space-y-4">
                    {movieVideos.map((video) => (
                      <div key={video.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-white">{video.name}</h4>
                            <p className="text-sm text-gray-400">{video.type} • {video.site}</p>
                          </div>
                          <a
                            href={`https://www.youtube.com/watch?v=${video.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                          >
                            Watch
                          </a>
                        </div>
                        {video.site === 'YouTube' && (
                          <div className="aspect-video bg-gray-700 rounded">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.key}`}
                              title={video.name}
                              className="w-full h-full rounded"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No videos available</p>
                  </div>
                )}
              </div>
            )}

            {/* Similar Movies Tab */}
            {activeTab === 'similar' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-400">Loading similar movies...</p>
                  </div>
                ) : similarMovies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {similarMovies.map((similarMovie) => (
                      <div key={similarMovie.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
                        <img
                          src={getMovieImage(similarMovie, 'poster', 'w342')}
                          alt={similarMovie.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <div className="p-3">
                          <h4 className="font-medium text-white text-sm truncate mb-1">
                            {similarMovie.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>
                              {similarMovie.release_date
                                ? new Date(similarMovie.release_date).getFullYear()
                                : 'N/A'}
                            </span>
                            {similarMovie.vote_average > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{formatRating(similarMovie.vote_average)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No similar movies found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;