import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube, faSquareXTwitter, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import Footer from './Footer';
//import Sheader from './Nav';
import bird from '../images/redpalmweevils2.jpg'

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we use mailto to send an email when the form is submitted
    const email = 'disaster-risk-management@igad.int';
    const subject = 'Contact Form Submission';
    const message = `
      First Name: ${e.target.firstName.value}
      Email: ${e.target.email.value}
      Phone Number: ${e.target.phone.value}
      Message: ${e.target.message.value}
    `;
    window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div>
    {/*<Sheader/> */}
    <div
            style={{
              backgroundImage: `url(${bird})`,
              width: '100%',
              height: '40vh', // Make sure the background covers the full height of the parent div
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="text-white flex flex-col justify-center h-full">
              <h1 className="text-base mt-28 mb-4 ml-20 font-sans">Home | Contact Page</h1>
              <p className="text-2xl text-gray-200 mb-6 ml-20">Contact Page</p>
              
            </div>
          </div>

    <div className="flex flex-col md:flex-row bg-green-700 p-8 text-white rounded-lg">
      {/* Contact Form Section */}
      <div className="md:w-1/2 p-6 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="message"
            placeholder="What do you have in mind?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full p-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Contact Information Section */}
      <div className="md:w-1/2 p-6 flex flex-col items-center md:items-start md:ml-6 mt-8 md:mt-0">
        <h2 className="text-2xl font-bold mb-4">Reach us at</h2>
        <p>IGAD Climate Prediction and Applications Centre (ICPAC)</p>
        <p>Ngong Town, Kibiko A Road</p>
        <p>P.O BOX 10304-00100</p>
        <div className="flex space-x-4 mt-4">
        <a href="https://www.facebook.com/ICPACigad/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} size="lg" />
        </a>
        <a href="https://www.youtube.com/@igad_climate_prediction" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faYoutube} size="lg" />
        </a>
        <a href="https://x.com/IGAD_CPAC" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faSquareXTwitter} size="lg" />
        </a>
        <a href="https://www.instagram.com/icpac_climatecenter/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </a>
        <a href="https://ke.linkedin.com/company/igad-climate-prediction-and-aplication-center-icpac-" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a href="https://github.com/icpac-igad" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
        <a href="mailto:disaster-risk-management@igad.int">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </a>
      </div>
      

        {/* Map Section */}

      <div className="w-full h-64 mt-6">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d378.4727174429168!2d36.644433!3d-1.34096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f35!3m3!1m2!1s0x182f1df47571afd1%3A0x7651c2bbab0be92b!2sICPAC%20Headquarters!5e0!3m2!1sen!2sus!4v1697820867890!5m2!1sen!2sus"
    width="100%"
    height="100%"
    allowFullScreen=""
    loading="lazy"
    title="ICPAC Headquarters"
    className="rounded-lg shadow-lg"
  ></iframe>
</div>




      
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default Contact;
   