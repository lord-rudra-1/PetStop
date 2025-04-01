import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { formatDistanceToNow } from 'date-fns';
import AdoptForm from '../AdoptForm/AdoptForm';
import '../AdoptForm/AdoptForm.css'; // Import the AdoptForm CSS

// PetsViewer component
const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatTimeAgo = (updatedAt) => {
    // Handle missing updatedAt value
    if (!updatedAt) {
      return "Recently added";
    }
    try {
      const date = new Date(updatedAt);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.log("Date formatting error:", error);
      return "Recently added";
    }
  };

  // Render the adoption form in a portal
  const renderAdoptFormPortal = () => {
    if (!showPopup) return null;
    
    return ReactDOM.createPortal(
      <div className="popup" onClick={togglePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <AdoptForm closeForm={togglePopup} pet={props.pet} />
          <button onClick={togglePopup} className="close-btn">Close</button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className='pet-view-card'>
      <div className='pet-card-details'>
        <h2>{props.pet.name}</h2>
        <p><b>Type:</b> {props.pet.type}</p>
        <p><b>Age:</b> {props.pet.age}</p>
        <p><b>Location:</b> {props.pet.area || props.pet.breed}</p>
        {/* Only show time if updatedAt exists */}
        {props.pet.updatedAt && <p>{formatTimeAgo(props.pet.updatedAt)}</p>}
      </div>
      <div className='show-interest-btn'>
        <button onClick={togglePopup}>Show Interest <i className="fa fa-paw"></i></button>
      </div>
      
      {/* Render the popup via portal */}
      {renderAdoptFormPortal()}
    </div>
  );
};

// Main Pets component
const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5002/approvedPets')
        if (!response.ok) {
          throw new Error('An error occurred')
        }
        const data = await response.json()
        setPetsData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests();
  }, [])

  const filteredPets = petsData.filter((pet) => {
    if (filter === "all") {
      return true;
    }
    return pet.type === filter;
  });

  return (
    <>
      <div className="filter-selection">
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All Pets</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Rabbit">Rabbits</option>
          <option value="Bird">Birds</option>
          <option value="Fish">Fishs</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="pet-container">
        {loading ?
          <p>Loading</p> : ((filteredPets.length > 0 ) ? (
            filteredPets.map((petDetail, index) => (
              <PetsViewer pet={petDetail} key={index} />
            ))
          ) : (
            <p className="oops-msg">Oops!... No pets available</p>
          )
          )
        }
      </div>
    </>
  );
};

export default Pets;
