import React from 'react'
import Footer from './Footer';
//import Sheader from './Nav';
import locust from '../images/deset_locust2.webp'
import pestwatch from '../images/pestwatch.png';
import africa from '../images/german.png'
import eu from "../images/icipe.png"
import met from "../images/world_bank.svg"
import nasa from "../images/tmg.png"
import norcap from "../images/dlco.png"
function Patners() {
  return (
    <div>
   {/*<Sheader /> */}
    <div
    style={{
      backgroundImage: `url(${locust})`,
      width: '100%',
      height: '40vh', // Make sure the background covers the full height of the parent div
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <div className="text-white flex flex-col justify-center h-full">
      <h1 className="text-base mt-28 mb-4 ml-20 font-sans">Home | Our Patners</h1>
      <p className="text-2xl text-gray-200 mb-6 ml-20">Our Patners</p>
      
    </div>
  </div>
  <div className="flex flex-col bg-white items-center p-6 space-y-10">
     
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg w-full">
        <div className="mx-20 my-10 flex flex-col items-start space-y-4">
          <h2 className="text-2xl font-bold font-serif">East Africa Pest Watch</h2>
          <p className="text-gray-700">
            East Africa Pest Watch is a near-real time system that uses Earth Observation and Weather Information
            to monitor pests conditions in the East Africa region. 
          </p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300">
            Contact Us
          </button>
        </div>
        <img src={pestwatch} alt="East Africa Pest Watch" className="w-full rounded-lg mx-20 my-10 md:w-1/3 animate-bounce-slow" />
      </div>
      </div>

      <div className='text-center md:text-5xl text-3xl font-serif text-gray-600 mt-5 '>Our Patners</div>

                <div className='flex flex-row justify-evenly flex-wrap mt-16 gap-4 mb-20'>
                    <img src={eu} alt='eu' className='grayscale hover:grayscale-0 transition duration-200 w-28 h-16 md:w-36 md:h-20'/>
                    <img src={africa} alt='africa' className='grayscale hover:grayscale-0 transition duration-200 w-28 h-16 md:w-36 md:h-20'/>
                    <img src={norcap} alt='norcap' className='grayscale hover:grayscale-0 transition duration-200 w-32 h-16 md:w-36 md:h-20'/>
                    <img src={nasa} alt='nasa' className='grayscale hover:grayscale-0 transition duration-200 w-24 h-16 md:w-36 md:h-20'/>
                    <img src={met} alt='nasa' className='grayscale hover:grayscale-0 transition duration-200 w-24 h-16 md:w-36 md:h-20'/>

                </div>
    <Footer />
    </div>
  )
}

export default Patners