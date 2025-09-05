import React, { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_icon from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'

const Navbar = () => {
  const navRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  return (
    <div 
      className={`w-full px-6 py-5 flex justify-between items-center fixed top-0 text-sm text-gray-200 z-10 transition-all duration-300 max-md:px-4 ${
        isScrolled 
          ? 'bg-[#141414]' 
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
      ref={navRef}
    >
      <div className="flex items-center gap-12">
        <img src={logo} alt="" className='w-24 max-md:h-6 max-sm:h-5' />
        <ul className='flex list-none gap-5 max-md:hidden'>
          <li className='cursor-pointer hover:text-white transition-colors'>Home</li>
          <li className='cursor-pointer hover:text-white transition-colors'>Tv Shows</li>
          <li className='cursor-pointer hover:text-white transition-colors'>Movies</li>
          <li className='cursor-pointer hover:text-white transition-colors'>New & Popular</li>
          <li className='cursor-pointer hover:text-white transition-colors'>My list</li>
          <li className='cursor-pointer hover:text-white transition-colors'>Browse by Languages</li>
        </ul>
      </div>
      
      <div className="flex gap-5 items-center max-sm:gap-2">
        <img src={search_icon} alt="" className='w-5 cursor-pointer hover:opacity-80 transition-opacity'/>
        <p className='hover:text-white transition-colors cursor-pointer'>Children</p>
        <img src={bell_icon} alt="" className='w-5 cursor-pointer hover:opacity-80 transition-opacity'/>
        
        <div className="flex items-center gap-2 relative group">
          <img src={profile_icon} alt="" className='rounded w-9 cursor-pointer'/>
          <img src={caret_icon} alt="" className='cursor-pointer transition-transform group-hover:rotate-180' />
          
          <div className="absolute top-full right-0 w-max bg-[#191919] px-6 py-4 rounded-sm z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <p className='text-xs cursor-pointer underline hover:text-white transition-colors'>
              Sign Out of Netflix
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar