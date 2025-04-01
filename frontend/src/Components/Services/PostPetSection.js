import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import postPet from "./images/postPet.png";
import './ServiceSections.css';

const PostPetSection = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [justification, setJustification] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isTypeSelected, setIsTypeSelected] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setAgeError(false);
      setFormError(false);
      setSubmitError("");
    }
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !age ||
      !area ||
      !justification ||
      !email ||
      !phone ||
      type === "None"
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setIsTypeSelected(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("area", area);
    formData.append("justification", justification);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);

    if (picture) {
      formData.append("image", picture);
    }

    try {
      console.log("Submitting form to:", "http://localhost:5002/post-pet");
      const response = await fetch("http://localhost:5002/post-pet", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error submitting form");
      }

      const data = await response.json();
      console.log("Form submitted successfully", data);

      setEmailError(false);
      setFormError(false);
      setName("");
      setAge("");
      setArea("");
      setJustification("");
      setEmail("");
      setPhone("");
      setPicture(null);
      setFileName("");
      setType("None");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a portal for the success popup
  const renderSuccessPopup = () => {
    if (!showPopup) return null;
    
    return ReactDOM.createPortal(
      <div className="popup" onClick={togglePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <h4>Application Submitted!</h4>
          <p>We'll review your pet for adoption soon.</p>
          <button onClick={togglePopup} className="close-btn">
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <section className="service-section">
      <h2>Leave a Pet for Adoption</h2>
      <img src={postPet} alt="Pet Looking for a Home" />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="service-form">
        <div className="input-box">
          <label>Pet Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your pet's name"
          />
        </div>

        <div className="input-box">
          <label>Pet Age:</label>
          <input
            type="text"
            value={age}
            onChange={(e) => {setAge(e.target.value);}}
            placeholder="Enter your pet's age"
          />
        </div>

        

        <div className="input-box">
          <label>Breed/Location:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter breed or location"
          />
        </div>

        <div className="filter-selection-service">
          <label>Pet Type:</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            required
            disabled={isTypeSelected}
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
          <label>Pet Description:</label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Describe your pet and why you're giving it up for adoption"
          ></textarea>
        </div>

        <h3>Contact Information</h3>

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
        {submitError && (
          <p className="error-message">{submitError}</p>
        )}

        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Your Pet"}
        </button>
      </form>
      
      {/* Render the popup using portal */}
      {renderSuccessPopup()}
    </section>
  );
};

export default PostPetSection;
