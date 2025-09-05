import React, { useEffect, useState } from 'react'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from 'react-router-dom'

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: ""
  });

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTYzMzc4Y2E3MTYyOGViNjVkOGRhNmE1ZTZiZDFmYyIsIm5iZiI6MTcyMTkxMTA1MC4wMDc2OTcsInN1YiI6IjY2YTI0NTUwZjE0MzlkOTg1MWEwY2QxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rXL3wPZaUVFINIspwxI-_GfcAoGCTntHX_040qDEwp4'
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results[0]))
      .catch(err => console.error(err));
  }, [])

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <img 
        src={back_arrow_icon} 
        alt="" 
        onClick={() => { navigate(-2) }} 
        className='absolute top-5 left-5 w-12 cursor-pointer'
      />
      <iframe 
        src={`https://www.youtube.com/embed/${apiData.key}`} 
        frameBorder="0" 
        width='90%' 
        height='90%'
        title='trailer' 
        allowFullScreen
        className='rounded-lg'
      ></iframe>
      <div className="flex items-center justify-between w-[90%]">
        <p>{apiData.published_at.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  )
}

export default Player