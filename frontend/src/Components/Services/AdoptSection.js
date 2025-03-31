import React from "react";
import adoptPet from "./images/adoptPet.png";
import { Link } from "react-router-dom";
import './ServiceSections.css';

const AdoptSection = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="service-section">
      <h2>Adopt a Pet</h2>
      <img src={adoptPet} alt="Happy Pet" />

      <p> 
        Welcome to our pet adoption program! Adopting a pet is a wonderful way
        to bring joy and companionship into your life.
      </p>

      <h3>Benefits of Pet Adoption</h3>
      <ul>
        <li>Provide a loving home to a pet in need</li>
        <li>Experience the unconditional love of a pet</li>
        <li>Create lasting memories and cherished moments</li>
        <li>Save a life and make a difference</li>
        <li>Get a pre-screened, healthy companion</li>
      </ul>

      <h3>Adoption Process</h3>
      <ol>
        <li>Browse our available pets</li>
        <li>Fill out an adoption application</li>
        <li>Meet potential pets in person</li>
        <li>Complete the necessary paperwork</li>
        <li>Take your new friend home!</li>
      </ol>

      <h3>Responsibilities</h3>
      <p>
        Adopting a pet comes with responsibilities, including:
      </p>
      <ul>
        <li>Regular feeding and fresh water</li>
        <li>Daily exercise and playtime</li>
        <li>Regular veterinary care</li>
        <li>Grooming and hygiene</li>
        <li>Training and socialization</li>
        <li>Lots of love and attention</li>
      </ul>

      <Link to="/pets">
        <button className="cta-button" onClick={scrollToTop}>
          Find Your Perfect Pet
        </button>
      </Link>
    </section>
  );
};

export default AdoptSection;
