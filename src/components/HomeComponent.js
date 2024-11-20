// components/Home.js
import React from 'react';
import locust from '../images/locustsdevas.jpg';
import locust2 from '../images/deset_locust2.webp';
import birds from '../images/quelea_birds2.jpg';
import weevils from '../images/redpalmweevils2.jpg';
import worm from '../images/armyworm.jpeg';
import africa from '../images/german.png'
import eu from "../images/icipe.png"
import met from "../images/world_bank.svg"
import nasa from "../images/tmg.png"
import norcap from "../images/dlco.png"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Footer from './Footer';
//import Sheader from './Nav';


const HomeComponent = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000, // Change every 2 seconds
        fade: true // Adds a fade effect
      };
    return (
        <div className=''>
        {/*<Sheader />*/}
        <Slider {...settings}>
        {/* Slide 1 with background image */}
        <div>
          <div
            style={{
              backgroundImage: `url(${locust})`,
              width: '100%',
              height: '70vh', // Make sure the background covers the full height of the parent div
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="text-white flex flex-col justify-center h-full">
              <h1 className="text-4xl font-bold mb-4 ml-20 font-sans">East Africa Pests Watch</h1>
              <p className="text-2xl text-gray-200 mb-6 ml-20">Monitor pests condition in East Africa</p>
              <button className="bg-green-500 hover:bg-green-700 text-white w-40 py-2 px-6 mt-20 ml-20 rounded-2xl">
                Explore Map
              </button>
            </div>
          </div>
        </div>

        {/* Slide 2 with background image */}
        <div >
          <div
            style={{
              backgroundImage: `url(${worm})`,
              width: '100%',
              height: '70vh', // Make sure the background covers the full height of the parent div
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="text-white flex flex-col justify-center h-full">
              <h1 className="text-4xl font-bold mb-4 ml-20 font-sans">East Africa Pests Watch</h1>
              <p className="text-2xl text-gray-200 mb-6 ml-20">Monitor pests condition in East Africa</p>
              <button className="bg-green-500 hover:bg-green-700 text-white py-2 w-40 px-6 mt-20 ml-20 rounded-2xl">
              Explore Map
            </button>
            </div>
          </div>
        </div>
        <div >
        <div
          style={{
            backgroundImage: `url(${locust2})`,
            width: '100%',
            height: '70vh', // Make sure the background covers the full height of the parent div
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="text-white flex flex-col justify-center h-full">
            <h1 className="text-4xl font-bold mb-4 ml-20 font-sans">East Africa Pests Watch</h1>
            <p className="text-2xl text-gray-200 mb-6 ml-20">Monitor pests condition in East Africa</p>
            <button className="bg-green-500 hover:bg-green-700 text-white py-2 w-40 px-6 mt-20 ml-20 rounded-2xl">
            Explore Map
          </button>
          </div>
        </div>
      </div>
      <div >
      <div
        style={{
          backgroundImage: `url(${weevils})`,
          width: '100%',
          height: '70vh', // Make sure the background covers the full height of the parent div
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="text-white flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold mb-4 ml-20 font-sans">East Africa Pests Watch</h1>
          <p className="text-2xl text-gray-200 mb-6 ml-20">Monitor pests condition in East Africa</p>
          <button className="bg-green-500 hover:bg-green-700 text-white py-2 w-40 px-6 mt-20 ml-20 rounded-2xl">
          Explore Map
        </button>
        </div>
      </div>
    </div>
    <div >
    <div
      style={{
        backgroundImage: `url(${birds})`,
        width: '100%',
        height: '70vh', // Make sure the background covers the full height of the parent div
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-white flex flex-col justify-center h-full">
        <h1 className="text-4xl font-bold mb-4 ml-20 font-sans">East Africa Pests Watch</h1>
        <p className="text-2xl text-gray-200 mb-6 ml-20">Monitor pests condition in East Africa</p>
        <button className="bg-green-500 hover:bg-green-700 text-white py-2 w-40 px-6 mt-20 ml-20 rounded-2xl">
        Explore Map
      </button>
      </div>
    </div>
  </div>
      </Slider>
            
                <div className='text-center md:text-5xl text-3xl font-serif text-gray-600 mt-5 '>Our Patners</div>

                <div className='flex flex-row justify-evenly flex-wrap mt-16 gap-4'>
                    <img src={eu} alt='eu' className='grayscale hover:grayscale-0 transition duration-200 w-28 h-16 md:w-36 md:h-20'/>
                    <img src={africa} alt='africa' className='grayscale hover:grayscale-0 transition duration-200 w-28 h-16 md:w-36 md:h-20'/>
                    <img src={norcap} alt='norcap' className='grayscale hover:grayscale-0 transition duration-200 w-36 h-16 md:w-36 md:h-20'/>
                    <img src={nasa} alt='nasa' className='grayscale hover:grayscale-0 transition duration-200 w-24 h-16 md:w-36 md:h-20'/>
                    <img src={met} alt='nasa' className='grayscale hover:grayscale-0 transition duration-200 w-24 h-16 md:w-36 md:h-20'/>

                </div>
                
                <div className='text-center text-xl font-bold mt-4 mb-8'>
                    <a href='/patners' className='text-yellow-400  no-underline'>
                        More partners <FontAwesomeIcon icon={faArrowRight} beat style={{ color: "#FFD43B", marginLeft: '2px' }} />
                    </a>
                </div>
            <Footer />
        </div>
    );
};

export default HomeComponent;
