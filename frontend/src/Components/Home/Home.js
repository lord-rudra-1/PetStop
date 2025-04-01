import React from "react";
import HomeDarkCardLeftPic from "./images/HomeDarkCardLeftPic.png";
import HomeDarkCardRightPic from "./images/HomeDarkCardRightPic.png";
import girlHoldingADog from "./images/girlHoldingADog.png";

// Card component
const Card = ({ imgSrc, title, content }) => {
  return (
    <div className="home-card">
      <img src={imgSrc} alt={title} />
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

// Home Landing Container component
const HomeLandingContainer = ({ description }) => {
  return (
    <div className="home-landing-container">
      <div className="landing-content">
        <h1>Give Love, Get Love - Adopt a Pet Today!</h1>
          <p style={{fontSize: "25px"}}>Ensure you are fully prepared to provide proper care and attention to your pet before welcoming them into your home.</p>
        <div className="buttons-container">
          <button className="primary-btn">Adopt Now</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
      <div className="landing-image">
        <img src={girlHoldingADog} alt="Happy pet with owner" />
      </div>
    </div>
  );
};

// Card Below Home component
const CardBelowHome = () => {
  const formatNumber = (number) => {
    const suffixes = ['', 'k', 'M', 'B', 'T'];
    const suffixNum = Math.floor(('' + number).length / 3);
    const shortNumber = parseFloat((number / Math.pow(1000, suffixNum)).toFixed(1));
    return shortNumber >= 1 ? `${shortNumber}${suffixes[suffixNum]}${"+"}` : number.toString();
  };

  const adoptedPets = formatNumber(1212);
  
  return (
    <div className='dark-grey-container'>
      <div className='left-pic'><img src={HomeDarkCardLeftPic} alt="Dog with toy"/></div>
      <div className='left-para'><p><p className='adopted-pets-num'>{adoptedPets}</p> Furry Friends<br/>Living Their Best Lives</p></div>
      <div className='right-pic'><img src={HomeDarkCardRightPic} alt="Dog pic" /></div>
      <div className='right-para'><p className='we-do'>WHAT WE DO?</p>With a focus on matching the right pet with the right family, PetStop makes it easy to adopt love and foster happiness.</div>
    </div>
  );
};

// Planning To Adopt A Pet component
const PlanningToAdoptAPet = () => {
  return (
    <div className="planning-container">
      <h2>Planning to Adopt a Pet?</h2>
      <div className="planning-content">
        <p className="ensure_you">
          Welcoming a pet into your home is a big decision. Before you adopt, consider if you can commit to caring for a pet for its entire life, provide proper nutrition, veterinary care, and adequate exercise.
        </p>
      </div>
    </div>
  );
};

// Main Home component
const Home = (props) => {
  return (
    <>
      <HomeLandingContainer description={props.description} />
      <CardBelowHome />
      <PlanningToAdoptAPet />
    </>
  );
};

export default Home;
