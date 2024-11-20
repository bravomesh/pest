import React from 'react';
import '../css/Popup.css';

const Popup = ({ layerName, onClose }) => {
  const layerInfo = {
    "Bands": [
      "Desert Locust Bands represent groups of wingless nymphs or larvae that move together on the ground.",
      "Monitoring band formation is crucial for early detection and control of locust outbreaks.",
      "Bands typically form in areas with suitable vegetation and soil moisture conditions.",
      "Understanding band behavior helps in predicting potential swarm formation and migration patterns.",
      "Early intervention at the band stage can prevent the development of more destructive swarms.",
      "Learn more about locust band monitoring: http://www.fao.org/ag/locusts/en/info/info/index.html"
    ],
    "Swarms": [
      "Desert Locust Swarms are groups of adult locusts capable of long-distance migration.",
      "Swarms can cover vast areas and cause significant damage to crops and vegetation.",
      "Monitoring swarm movement is essential for regional and international coordination in locust control.",
      "Factors influencing swarm formation include temperature, rainfall, and wind patterns.",
      "Advanced technologies like remote sensing and GIS are used to track and predict swarm movements.",
      "Explore FAO's Locust Watch for real-time swarm tracking: http://www.fao.org/ag/locusts/en/activ/DLIS/satel/index.html"
    ],
    "Hoppers": [
      "Desert Locust Hoppers are the immature, wingless stages of locusts before they become adults.",
      "Hopper development is closely tied to environmental conditions, especially soil moisture and vegetation.",
      "Monitoring hopper populations helps in predicting potential band formation and subsequent swarms.",
      "Effective control at the hopper stage can significantly reduce the risk of large-scale infestations.",
      "Understanding hopper ecology is crucial for developing targeted control strategies.",
      "Learn about hopper control methods: http://www.fao.org/ag/locusts/en/info/info/index.html"
    ],
    "Monthly Precipitation (CHIRPS)": [
      "CHIRPS data provides crucial information on rainfall patterns relevant to desert locust breeding and migration.",
      "Monthly precipitation data helps in identifying potential locust breeding sites and predicting population dynamics.",
      "This information is essential for planning locust surveys and control operations.",
      "CHIRPS combines satellite imagery with ground station data for improved accuracy in arid and semi-arid regions.",
      "Long-term precipitation trends from CHIRPS can indicate changing locust habitat suitability.",
      "Access CHIRPS data: https://data.chc.ucsb.edu/products/CHIRPS-2.0/"
    ],
    "Monthly Soil Moisture Anomaly": [
      "Soil moisture anomalies are critical indicators of potential locust breeding conditions.",
      "Above-average soil moisture can create favorable conditions for egg-laying and nymph development.",
      "Monitoring soil moisture helps in identifying areas at risk of locust population increase.",
      "This data is used in conjunction with vegetation indices to assess locust habitat suitability.",
      "Understanding soil moisture patterns aids in predicting locust movement and concentration areas.",
      "Explore soil moisture data relevant to locust monitoring: https://www.esa-soilmoisture-cci.org/"
    ],
    "Monthly Temperature Anomaly": [
      "Temperature anomalies significantly influence locust development rates and behavior.",
      "Warmer than average temperatures can accelerate locust development and increase outbreak risks.",
      "Temperature data is crucial for predicting locust maturation, breeding cycles, and potential swarm formation.",
      "Extreme temperature events can trigger locust migration or alter their distribution patterns.",
      "Long-term temperature trends help in assessing the impact of climate change on locust dynamics.",
      "Access global temperature data: https://data.giss.nasa.gov/gistemp/"
    ],
    "Monthly Soil Temperature Anomaly": [
      "Soil temperature anomalies affect locust egg development and soil moisture retention.",
      "Higher soil temperatures can accelerate egg hatching and nymph development.",
      "This data helps in predicting the timing of locust emergence and potential outbreak areas.",
      "Soil temperature information is crucial for planning timely control interventions.",
      "Understanding soil temperature patterns aids in assessing long-term changes in locust breeding habitats.",
      "Learn about soil temperature monitoring: https://www.fao.org/3/cb0525en/cb0525en.pdf"
    ],
    "Wind Speed": [
      "Wind speed and direction are crucial factors in locust swarm movement and migration.",
      "Strong winds can facilitate long-distance travel of locust swarms, affecting new areas.",
      "Wind data is essential for predicting potential invasion areas and planning control operations.",
      "Understanding wind patterns helps in assessing the risk of cross-border locust movements.",
      "Wind speed information is used in models to forecast locust spread and concentration areas.",
      "Explore wind data for locust monitoring: https://www.fao.org/ag/locusts/en/activ/DLIS/satel/index.html"
    ],
    "Outbreak Probability": [
      "Desert Locust Risk maps integrate various environmental factors to assess potential outbreak areas.",
      "These risk assessments combine data on vegetation, soil moisture, temperature, and historical locust presence.",
      "High-risk areas are prioritized for surveillance and early intervention measures.",
      "Risk maps are crucial tools for resource allocation in locust monitoring and control programs.",
      "Regular updates of risk assessments help in adaptive management of locust control strategies.",
      "Access FAO's Desert Locust risk assessment tools: http://www.fao.org/ag/locusts/en/activ/DLIS/eL3suite/index.html"
    ],
    "IGAD Boundary": [
      "IGAD (Intergovernmental Authority on Development) is a regional organization in East Africa.",
      "IGAD countries collaborate on desert locust monitoring and control as part of regional food security efforts.",
      "The IGAD boundary layer helps in coordinating cross-border locust management strategies.",
      "This regional approach is crucial for effective early warning and rapid response to locust threats.",
      "IGAD facilitates information sharing and joint planning among member countries for locust control.",
      "Learn more about IGAD's role in locust management: https://igad.int/divisions/agriculture-and-environment"
    ],
	"Breeding Sites": [
      "IGAD (Intergovernmental Authority on Development) is a regional organization in East Africa.",
      "IGAD countries collaborate on desert locust monitoring and control as part of regional food security efforts.",
      "The IGAD boundary layer helps in coordinating cross-border locust management strategies.",
      "This regional approach is crucial for effective early warning and rapid response to locust threats.",
      "IGAD facilitates information sharing and joint planning among member countries for locust control.",
      "Learn more about IGAD's role in locust management: https://igad.int/divisions/agriculture-and-environment"
    ]
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>X</button>
        <h2 className="popup-heading">{layerName}</h2>
        <hr className="popup-divider" />
        {layerInfo[layerName].map((text, index) => (
          <p key={index}>
            {text.startsWith("http") ? (
              <a href={text} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            ) : (
              text
            )}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Popup;
