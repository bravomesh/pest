import React from 'react'
import igad from '../images/igad_green.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faFacebook, faYoutube, faSquareXTwitter, faInstagram, faLinkedin, faGithub} from "@fortawesome/free-brands-svg-icons"

function Footer() {
  
  return (
    <div className="bg-gray-100  py-8">
      <div className="">
        <div className="flex flex-col lg:flex-row mx-20 justify-between gap-8 2xl:mx-40">
          <div>
            <img src={igad} alt="IGAD Logo" className="my-4 h-48 mx-auto" />
          </div>
          <div className="max-w-md text-center lg:text-left">
            <h4 className="text-3xl font-bold font-serif text-green-600">EAST AFRICA PEST WATCH</h4>
            <p className="mt-2 text-left">
            IGAD Climate Prediction and Applications Centre (ICPAC)
            <br />
            Ngong Town, Kibiko A Road
            <br />
            P.O BOX 10304-00100
          </p>
          </div>
          <div className="max-w-xs text-left">
            <h4 className="text-xl font-bold text-green-600 text-center ">Get In Touch</h4>
            <p className="mt-2 ">
              Questions, comments or feedbacks ?
            </p>
            <button className="bg-green-700 text-white  font-bold py-2 px-4 mt-4 rounded">Give Us Feedback</button>
            <div className="mt-4 gap-3 flex justify-around">
  <a
    href="https://www.facebook.com/ICPACigad/"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faFacebook} />
  </a>
  <a
    href="https://www.youtube.com/@igad_climate_prediction"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faYoutube} />
  </a>
  <a
    href="https://x.com/IGAD_CPAC"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faSquareXTwitter} />
  </a>
  <a
    href="mailto:disaster-risk-management@igad.int"
    className="bg-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faEnvelope} />
  </a>
  <a
    href="https://github.com/icpac-igad"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faGithub} />
  </a>
  <a
    href="https://www.instagram.com/icpac_climatecenter/"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faInstagram} />
  </a>
  <a
    href="https://ke.linkedin.com/company/igad-climate-prediction-and-aplication-center-icpac-"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-teal-green-700 p-2 rounded-full"
  >
    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faLinkedin} />
  </a>
</div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
