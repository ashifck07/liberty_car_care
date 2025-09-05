import React from 'react'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'

const Footer = () => {
  return (
    <div className='py-8 px-[4%] max-w-[1000px] mx-auto'>
      <div className="flex gap-5 my-10 max-md:gap-4">
        <img src={facebook_icon} alt="" className='w-8 cursor-pointer max-md:w-6' />
        <img src={instagram_icon} alt="" className='w-8 cursor-pointer max-md:w-6' />
        <img src={youtube_icon} alt="" className='w-8 cursor-pointer max-md:w-6' />
        <img src={twitter_icon} alt="" className='w-8 cursor-pointer max-md:w-6' />
      </div>
      <ul className='grid grid-cols-4 gap-4 mb-8 list-none max-md:grid-cols-2 max-md:gap-2 max-md:text-sm'>
        <li>Audio Description</li>
        <li>Help Center</li>
        <li>Gift Cards</li>
        <li>Media Center</li>
        <li>Investor Relation</li>
        <li>Jobs</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
        <li>Legal Notices</li>
        <li>Cookie Preferences</li>
        <li>Corporate Information</li>
        <li>Contact Us</li>
      </ul>
      <p className='text-gray-500 text-sm'>&copy; 1997-2023 Netflix,Inc</p>
    </div>
  )
}

export default Footer