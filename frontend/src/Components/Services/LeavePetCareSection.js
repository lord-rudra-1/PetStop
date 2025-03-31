import React, { useState } from "react";
import leavePetCare from "./images/leavePetCare.png";
import './ServiceSections.css';

const LeavePetCareSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("None");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
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

    if (!name || !email || !phone || !petName || !startDate || !endDate) {
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
      const response = await fetch("http://localhost:5002/leave-pet-care", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          petName,
          petType,
          startDate,
          endDate,
          specialInstructions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setName("");
      setEmail("");
      setPhone("");
      setPetName("");
      setPetType("None");
      setStartDate("");
      setEndDate("");
      setSpecialInstructions("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="service-section">
      <h2>Leave Your Pet in Our Care</h2>
      <img src={leavePetCare} alt="Pet Care Service" />

      <p>
        Going away? Let us take care of your beloved pet while you're gone. Our experienced
        staff will provide the best care and attention your pet deserves.
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

        <div className="filter-selection-service">
          <label>Pet Type:</label>
          <select
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            required
          >
            <option value="None" disabled>Select Pet Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-box">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="input-box">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
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

        <div className="input-box">
          <label>Special Instructions:</label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special care instructions for your pet?"
          ></textarea>
        </div>

        {emailError && (
          <p className="error-message">Please provide a valid email address.</p>
        )}
        {formError && (
          <p className="error-message">Please fill out all required fields.</p>
        )}

        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Request Submitted!</h4>
              <p>We'll contact you shortly to confirm your pet's stay.</p>
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

export default LeavePetCareSection; 