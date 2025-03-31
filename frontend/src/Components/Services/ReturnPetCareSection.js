import React, { useState } from "react";
import returnPetCare from "./images/returnPetCare.png";
import './ServiceSections.css';

const ReturnPetCareSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !petName || !returnDate) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);
    setFormError(false);
    setEmailError(false);

    try {
      const response = await fetch("http://localhost:5002/return-pet-care", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          petName,
          returnDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setName("");
      setEmail("");
      setPhone("");
      setPetName("");
      setReturnDate("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="service-section">
      <h2>Return Pet Care</h2>
      <img src={returnPetCare} alt="Pet Return Service" />

      <p>
      Excited to reunite with your furry friend? Let us know your preferred pickup time, and we’ll ensure everything is perfectly prepared for a seamless homecoming!
      </p>

      <form onSubmit={handleSubmit} className="service-form">
        <div className="input-box">
          <label>Your Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="input-box">
          <label>Pet Name:</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Enter your pet's name"
          />
        </div>

        <div className="input-box">
          <label>Return Date:</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="input-box">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-box">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        {emailError && (
          <p className="error-message">Please provide a valid email address.</p>
        )}
        {formError && (
          <p className="error-message">Please fill out all required fields.</p>
        )}

        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Return Request"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Return Request Submitted!</h4>
              <p>We'll contact you shortly to confirm your pet's return.</p>
            </div>
            <button onClick={togglePopup} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default ReturnPetCareSection; 