import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./AdoptForm.css";

function AdoptForm(props) {
  const [adopter_name, setAdopterName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ErrPopup, setErrPopup] = useState(false);
  const [SuccPopup, setSuccPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Connection Error. Please try again.");

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setFormError(false);
    setErrorMessage("Connection Error. Please try again.");

    if (
      !adopter_name ||
      !email ||
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting adoption request for pet:', props.pet.id);

      const response = await fetch('http://localhost:5002/adopt-pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          petId: props.pet.id,
          adopterName: adopter_name,
          adopterEmail: email,
          adopterPhone: phoneNo,
          livingSituation,
          previousExperience,
          familyComposition
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Adoption form submission failed:', responseData);
        setErrorMessage(responseData.message || "Connection Error. Please try again.");
        setErrPopup(true);
        return;
      } else {
        console.log('Adoption success response:', responseData);
        setSuccPopup(true);
      }
    }
    catch (err) {
      console.error('Error submitting adoption form:', err);
      setErrPopup(true);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setAdopterName("");
    setEmail("");
    setPhoneNo("");
    setLivingSituation("");
    setPreviousExperience("");
    setFamilyComposition("");
  };

  // Create portals for the error and success popups to render them at the document body level
  const renderErrorPopup = () => {
    if (!ErrPopup) return null;
    
    return ReactDOM.createPortal(
      <div className="popup">
        <div className="popup-content">
          <h4>{errorMessage}</h4>
          <button onClick={() => setErrPopup(false)} className="close-btn">
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      </div>,
      document.body
    );
  };

  const renderSuccessPopup = () => {
    if (!SuccPopup) return null;
    
    return ReactDOM.createPortal(
      <div className="popup">
        <div className="popup-content">
          <h4>
            Thank you {adopter_name}! Your adoption request for {props.pet.name} has been submitted. We'll get in touch with you soon.
          </h4>
          <button
            onClick={() => {
              setSuccPopup(false);
              props.closeForm();
            }}
            className="close-btn"
          >
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="custom-adopt-form-container">
      <h2 className="custom-form-heading">Pet Adoption Application</h2>
      <div className="form-pet-container">
        <div className="pet-details">
          <div className="pet-info">
            <h2>{props.pet.name}</h2>
            <p>
              <b>Type:</b> {props.pet.type}
            </p>
            <p>
              <b>Age:</b> {props.pet.age}
            </p>
            <p>
              <b>Location:</b> {props.pet.area || props.pet.breed}
            </p>
          </div>
        </div>
        <div className="form-div">
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="custom-input-box">
              <label className="custom-label">Your Name:</label>
              <input
                type="text"
                value={adopter_name}
                onChange={(e) => setAdopterName(e.target.value)}
                className="custom-input"
                placeholder="Enter your full name"
              />
            </div>
            <div className="custom-input-box">
              <div className="email-not-valid">
                <label className="custom-label">Email:</label>
                {emailError && (
                  <p>Please provide valid email address.</p>
                )}
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
                placeholder="Enter your email address"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Phone No.</label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="custom-input"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Pet Living Situation:</label>
              <input
                type="text"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
                className="custom-input"
                placeholder="Describe where the pet will live"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Previous Pet Experience:</label>
              <input
                type="text"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                className="custom-input"
                placeholder="Describe your experience with pets"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Any Other Pets:</label>
              <input
                type="text"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
                className="custom-input"
                placeholder="Do you have other pets? Please describe"
              />
            </div>
            {formError && (
              <p className="error-message">Please fill out all fields.</p>
            )}
            <button disabled={isSubmitting} type="submit" className="custom-cta-button custom-m-b">
              {isSubmitting ? 'Submitting' : 'Submit Adoption Request'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Render popups using portals */}
      {renderErrorPopup()}
      {renderSuccessPopup()}
    </div>
  );
}

export default AdoptForm;
