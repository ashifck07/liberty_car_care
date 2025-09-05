import React, { useEffect, useRef, useState } from 'react'
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom';

const TitleCards = ({ title, cateogry }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTYzMzc4Y2E3MTYyOGViNjVkOGRhNmE1ZTZiZDFmYyIsIm5iZiI6MTcyMTkxMTA1MC4wMDc2OTcsInN1YiI6IjY2YTI0NTUwZjE0MzlkOTg1MWEwY2QxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rXL3wPZaUVFINIspwxI-_GfcAoGCTntHX_040qDEwp4'
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY
  }

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${cateogry ? cateogry : "now_playing"}?language=en-US&page=1`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results))
      .catch(err => console.error(err));
    
    if (cardsRef.current) {
      cardsRef.current.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (cardsRef.current) {
        cardsRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className='mt-12 mb-8 max-md:mt-5 max-md:mb-0'>
      <h2 className='m-2 max-md:text-xl max-sm:text-base'>
        {title ? title : "Popular on Netflix"}
      </h2>
      <div 
        className="flex gap-2 overflow-x-scroll scrollbar-hide" 
        ref={cardsRef}
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none'  /* Internet Explorer 10+ */
        }}
      >
        {apiData.map((card, index) => {
          return (
            <Link 
              to={`/player/${card.id}`} 
              className='relative flex-shrink-0' 
              key={index}
            >
              <img 
                src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} 
                alt="" 
                className='w-60 rounded cursor-pointer max-md:w-50 max-sm:w-[165px]'
              />
              <p className='absolute bottom-2 right-2 text-white max-md:text-xs max-sm:text-[10px]'>
                {card.original_title}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TitleCards