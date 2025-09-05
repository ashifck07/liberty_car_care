import React from 'react'
import Navbar from '../../componets/Navbar/NavBar' 
import hero_banner from '../../assets/hero_banner.jpg'
import hero_title from '../../assets/hero_title.png'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../componets/TitleCards/TitleCard' 
import Footer from '../../componets/footer/Footer' 

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <div className="relative">
        <img 
          src={hero_banner} 
          alt="" 
          className='w-full'
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 75%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 75%)'
          }}
        />
        <div className="absolute w-full pl-6 bottom-0 max-md:pl-4">
          <img 
            src={hero_title} 
            alt="" 
            className='w-[90%] max-w-[420px] mb-8 max-md:mb-2 max-md:w-2/5 max-sm:hidden' 
          />
          <p className='max-w-[700px] text-[17px] mb-5 max-md:text-xs max-md:mb-2'>
            Discovring his ties to a secret ancient order,a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy
          </p>
          <div className="flex gap-2 mb-12 max-lg:mb-8">
            <button className='border-0 outline-0 px-5 py-2 inline-flex items-center gap-2 text-[15px] font-semibold bg-white rounded cursor-pointer hover:bg-white/75 transition-colors max-sm:px-2 max-sm:py-1 max-sm:gap-1 max-sm:text-[10px]'>
              <img src={play_icon} alt="" className='w-6 max-md:w-5 max-sm:w-4' />
              Play
            </button>
            <button className='border-0 outline-0 px-5 py-2 inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-[#6d6d6eb3] rounded cursor-pointer hover:bg-[#6d6d6e66] transition-colors max-sm:px-2 max-sm:py-1 max-sm:gap-1 max-sm:text-[10px]'>
              <img src={info_icon} alt="" className='w-6 max-md:w-5 max-sm:w-4' />
              More Info
            </button>
          </div>
          <div className="max-lg:hidden">
            <TitleCards />
          </div>
        </div>
      </div>
      <div className="pl-6 max-md:pl-4">
        <TitleCards title={"Blockbuster Movies"} cateogry={"top_rated"} />
        <TitleCards title={"Only on Neftlix"} cateogry={"popular"} />
        <TitleCards title={"Upcoming"} cateogry={"upcoming"} />
        <TitleCards title={"Top Pics for You"} cateogry={"now_playing"} />
      </div>
      <Footer />
    </div>
  )
}

export default Home