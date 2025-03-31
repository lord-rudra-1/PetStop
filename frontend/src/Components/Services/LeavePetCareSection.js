import React, { useState, useEffect } from "react";
import petCareImg from "./images/petCare.png";

// DEV_MODE - set to false in production
const DEV_MODE = true;

const LeavePetCareSection = () => {
  const [petId, setPetId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePets, setAvailablePets] = useState([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    // Fetch available pets
    const fetchAvailablePets = async () => {
      try {
        console.log("Fetching available pets...");
        setFetchError("");
        const response = await fetch("http://localhost:5002/available-pets");
        console.log("Response status:", response.status);
        
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log("Available pets data:", data);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          setFetchError("Invalid response format");
          return;
        }
        
        if (response.ok) {
          if (Array.isArray(data)) {
            if (data.length === 0) {
              console.log("No pets available");
              setFetchError("No pets available for care service");
            } else {
              setAvailablePets(data);
            }
          } else {
            console.error("Unexpected data format:", data);
            setFetchError("Unexpected data format from server");
          }
        } else {
          console.error("Failed to fetch available pets:", data);
          setFetchError(`Error fetching pets: ${data.message || response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching available pets:", error);
        setFetchError(`Error: ${error.message}`);
      }
    };

    fetchAvailablePets();
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setFormError(false);
    }
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !petId ||
      !ownerName ||
      !ownerEmail ||
      !ownerPhone ||
      !startDate
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(ownerEmail)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);

    const petCareData = {
      petId,
      ownerName,
      ownerEmail,
      ownerPhone,
      startDate,
      endDate: endDate || null,
      notes
    };

    console.log("Submitting pet care data:", petCareData);

    try {
      const response = await fetch("http://localhost:5002/care/leave-pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petCareData),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit pet care request");
      }

      setEmailError(false);
      setFormError(false);
      setPetId("");
      setOwnerName("");
      setOwnerEmail("");
      setOwnerPhone("");
      setStartDate("");
      setEndDate("");
      setNotes("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to create a test pet for development purposes
  const createTestPet = async () => {
    try {
      const testPet = {
        name: "Test Pet " + Math.floor(Math.random() * 1000),
        type: "Dog",
        breed: "Mixed",
        age: "2 years",
        description: "Test pet for development",
        email: "test@example.com",
        phone: "1234567890"
      };
      
      const response = await fetch("http://localhost:5002/post-pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testPet)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Test pet created:", data);
        alert("Test pet created! Now you need to approve it from the admin panel.");
        return data.pet.id;
      } else {
        console.error("Failed to create test pet:", data);
        alert("Failed to create test pet: " + data.message);
        return null;
      }
    } catch (error) {
      console.error("Error creating test pet:", error);
      alert("Error creating test pet: " + error.message);
      return null;
    }
  };

  // Add a function to approve the test pet
  const approveTestPet = async (petId) => {
    try {
      const response = await fetch(`http://localhost:5002/admin/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Approved" })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Test pet approved:", data);
        alert("Test pet approved and now available for care!");
        // Refresh the list of available pets
        window.location.reload();
      } else {
        console.error("Failed to approve test pet:", data);
        alert("Failed to approve test pet: " + data.message);
      }
    } catch (error) {
      console.error("Error approving test pet:", error);
      alert("Error approving test pet: " + error.message);
    }
  };

  return (
    <section className="pet-care-section">
      <h2>Leave Your Pet in Our Care</h2>
      <img src={petCareImg} alt="Pet Care" />

      <p>
        Going out of town? Let us take care of your furry friend! Our 
        pet care service ensures your pet gets all the attention and care 
        they need while you're away.
      </p>

      <h3>Our Care Services Include:</h3>
      <ul>
        <li>Daily feeding and exercise</li>
        <li>Comfortable housing</li>
        <li>Health monitoring</li>
        <li>Grooming services</li>
        <li>Play time and socialization</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <label>Select Your Pet:</label>
          {fetchError && <p className="error-message">{fetchError}</p>}
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            required
          >
            <option value="">Select a pet</option>
            {Array.isArray(availablePets) && availablePets.length > 0 ? (
              availablePets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.type})
                </option>
              ))
            ) : (
              <option value="" disabled>No pets available</option>
            )}
          </select>
          <p className="info-text">
            {Array.isArray(availablePets) && availablePets.length === 0 ? 
              "No pets available. Please ensure you have pets with 'available' status." : 
              "Select your pet from the dropdown"}
          </p>
        </div>

        <div className="input-box">
          <label>Your Name:</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <label>Email:</label>
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="input-box">
          <label>Expected End Date (Optional):</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="input-box">
          <label>Special Notes or Instructions:</label>
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {emailError && (
          <p className="error-message">Please provide a valid email address.</p>
        )}
        {formError && (
          <p className="error-message">Please fill out all required fields.</p>
        )}

        <button type="submit" className="cta-button" disabled={isSubmitting || availablePets.length === 0}>
          {isSubmitting ? "Submitting..." : "Leave Pet in Care"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Your pet has been successfully registered for care. We'll take good care of them!</h4>
            </div>
            <button onClick={togglePopup} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {DEV_MODE && (
          <div className="dev-tools">
            <hr />
            <h4>Development Tools</h4>
            <button
              type="button"
              className="dev-button"
              onClick={async () => {
                const petId = await createTestPet();
                if (petId) {
                  await approveTestPet(petId);
                }
              }}
            >
              Create & Approve Test Pet
            </button>
            <p className="dev-note">Note: This button is only visible in development mode.</p>
          </div>
        )}
      </form>
    </section>
  );
};

export default LeavePetCareSection; 