import React, { useEffect, useRef, useState } from 'react';
import { getMoviesByCategory, getMovieImage } from '../../Api/api'; // Updated import
import MovieModal from '../modal/MovieModal';

const TitleCards = ({ title, category }) => { // Fixed typo: cateogry -> category
  const [apiData, setApiData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef();

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMoviesByCategory(category || 'now_playing',);
      
      if (result.success) {
        setApiData(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    fetchMovies();
  }, [category]);

  // Show error state
  if (error) {
    return (
      <div className="mt-5 mb-5">
        <h2 className='m-2 text-white text-xl '>
          {title || 'Popular Movies'}
        </h2>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-300 mb-2">Error loading movies</p>
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchMovies}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  // Show empty state
  if (apiData.length === 0) {
    return (
      <div className="mt-5 mb-5">
        <h2 className='m-2 text-white text-xl '>
          {title || 'Popular Movies'}
        </h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V4zM7 4H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">No movies found</p>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='mt-1 mb-8'>
        <h2 className='m-2 text-white text-xl mb-4'>
          {title || 'Popular Movies'} 
        </h2>

        <div
          className="flex gap-2 overflow-x-scroll scrollbar-hide pb-2"
          ref={cardsRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {apiData.map((movie, index) => {
            const imageUrl = getMovieImage(movie, 'backdrop', 'w500');

            return (
              <div 
                key={movie.id || index} 
                className='flex-shrink-0 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 group'
                onClick={() => handleMovieClick(movie)}
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-gray-800">
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={movie.title || 'Movie'}
                    className='w-60 h-36 object-cover bg-gray-600 transition-transform duration-300 group-hover:scale-110'
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = getMovieImage(null, 'backdrop', 'w500');
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>


                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-lg">
                    <div className="text-sm font-medium text-white truncate mb-1">
                      {movie.title || movie.original_title || 'Untitled'}
                    </div>
                    <div className="text-xs text-gray-300 flex items-center justify-between">
                      <span>
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-4 gap-1">
          {[...Array(Math.min(5, Math.ceil(apiData.length / 6)))].map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-600 opacity-50"
            />
          ))}
        </div>
      </div>

      {/* Movie Modal */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={showModal}
        onClose={closeModal}
      />
    </>
  );
};

export default TitleCards;