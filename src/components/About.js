import React , {useState} from 'react';
import pestwatch from '../images/pestwatch.png';
import icpac from '../images/icpac.png';
import Footer from './Footer';
//import Sheader from './Nav';
import locust from '../images/desert_locust.jpg'

function About({setActiveComponent}) {
  const [activeTab, setActiveTab] = useState('map');


  const handleSetActiveComponent = (tabName) => {
    setActiveTab(tabName);
    setActiveComponent(tabName);
  };
  return (
    <div>
   {/* <Sheader />*/}
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
      <h1 className="text-base mt-28 mb-4 ml-20 font-sans">Home | About Page</h1>
      <p className="text-2xl text-gray-200 mb-6 ml-20">About Us</p>
      
    </div>
  </div>
    <div className="flex flex-col bg-white items-center p-6 space-y-10">
      {/* Section for East Africa Pests Watch */}
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg w-full">
        <div className="mx-20 my-10 flex flex-col items-start space-y-4">
          <h2 className="text-2xl font-bold font-serif">East Africa Pest Watch</h2>
          <p className="text-gray-700">
          East Africa Pest Watch is a near-real-time system leveraging Earth Observation and weather data to monitor drought conditions and key agricultural pests, including desert locusts, red palm weevils,
           army worms, and quelea birds. Serving the ICPAC region, we provide timely insights to support sustainable pest management and protect livelihoods across East Africa.
          </p>
          <button className="px-3 py-1 bg-neutral-50 border-2 border-green-600 text-green-600 hover:text-white  rounded-full hover:bg-green-600 transition duration-300" onClick={() => handleSetActiveComponent('contact')}>
            Contact Us
          </button>
        </div>
        <img src={pestwatch} alt="East Africa Drought Watch" className="w-full rounded-lg mx-20 my-10 md:w-1/3 animate-fade-in" />
      </div>

      {/* Section for ICPAC Climate Center */}
      <div className="flex flex-col md:flex-row items-center bg-white  mx-20 my-10 rounded-lg w-full">
        <img src={icpac} alt="ICPAC Climate Center" className="w-full md:w-1/3 mx-20 my-10 rounded-2xl animate-bounce-slow" />
        <div className="flex flex-col items-start mx-20 my-10 space-y-4">
          <h2 className="text-2xl font-bold">An East African Climate Center of Excellence</h2>
          <p className="text-gray-700">
            ICPAC is a Climate Center accredited by the World Meteorological Organization that provides Climate Services
            to 11 East African Countries. Our services aim at creating resilience in a region deeply affected by climate
            change and extreme weather.
          </p>
          <button className="px-3 py-1 bg-neutral-50 border-2 border-green-600 text-green-600 hover:text-white  rounded-full hover:bg-green-600 transition duration-300" onClick={() => handleSetActiveComponent('contact')}>
            Contact Us
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default About;
