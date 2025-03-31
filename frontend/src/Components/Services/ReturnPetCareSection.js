import React, { useState, useEffect } from "react";
import returnPetImg from "./images/returnPet.png";

const ReturnPetCareSection = () => {
  const [petsInCare, setPetsInCare] = useState([]);
  const [selectedPetCare, setSelectedPetCare] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    fetchPetsInCare();
  }, []);

  const fetchPetsInCare = async () => {
    try {
      const response = await fetch("http://localhost:5002/care/pets-in-care");
      if (response.ok) {
        const data = await response.json();
        setPetsInCare(data);
      } else {
        console.error("Failed to fetch pets in care");
      }
    } catch (error) {
      console.error("Error fetching pets in care:", error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPetCare) {
      setFormError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5002/care/return-pet/${selectedPetCare}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Pet returned successfully");
      setFormError(false);
      setSelectedPetCare("");
      togglePopup();
      // Refresh the list after successful return
      fetchPetsInCare();
    } catch (error) {
      console.error("Error returning pet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="return-pet-care-section">
      <h2>Take Your Pet Back from Care</h2>
      <img src={returnPetImg} alt="Return Pet from Care" />

      <p>
        Ready to reunite with your furry friend? We've taken good care of them,
        and they're excited to see you again!
      </p>

      {petsInCare.length === 0 ? (
        <div className="no-pets-message">
          <h3>No pets are currently in our care.</h3>
          <p>If you need pet care services, please use our "Leave in Our Care" service.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Select Your Pet to Return:</label>
            <select
              value={selectedPetCare}
              onChange={(e) => setSelectedPetCare(e.target.value)}
              required
            >
              <option value="">Select a pet</option>
              {petsInCare.map((petCare) => (
                <option key={petCare.id} value={petCare.id}>
                  {petCare.pet.name} ({petCare.pet.type}) - Left on {new Date(petCare.startDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {formError && (
            <p className="error-message">Please select a pet to return from care.</p>
          )}

          <button type="submit" className="cta-button" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Return Pet from Care"}
          </button>

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h4>Your pet has been successfully returned from our care. We hope they enjoyed their stay!</h4>
              </div>
              <button onClick={togglePopup} className="close-btn">
                Close <i className="fa fa-times"></i>
              </button>
            </div>
          )}
        </form>
      )}
    </section>
  );
};

export default ReturnPetCareSection; 