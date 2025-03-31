import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";

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

  return (
    <section className="post-pet-section">
      <h2>Post a Pet for Adoption</h2>
      <img src={postPet} alt="Pet Looking for a Home" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input-box">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-box">
          <label>Pet Age:</label>
          <input
            type="text"
            value={age}
            onChange={(e) => {setAge(e.target.value);}}
          />
        </div>

        <div className="input-box">
          <label>Picture:</label>
          <label className="file-input-label">
            <span className="file-input-text">
              {fileName || "Choose a Picture"}
            </span>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="input-box">
          <label>Breed/Location:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div className="filter-selection-service">
          <label>Type:</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="None">Select Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-box">
          <h3>Pet Description</h3>
          <textarea
            rows="4"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Describe your pet and why you're giving it up for adoption"
          ></textarea>
        </div>

        <h3>Contact Information</h3>

        <div className="input-box">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Application Submitted! We'll review your pet for adoption soon.</h4>
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

export default PostPetSection;
