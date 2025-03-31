import React from 'react'
import AdoptSection from './AdoptSection'
import PostPetSection from './PostPetSection'
import LeavePetCareSection from './LeavePetCareSection'
import ReturnPetCareSection from './ReturnPetCareSection'
import './Services.css'

const Services = () => {
  return (
    <div className='services-container'>
      <h1 className="services-title">Our Services</h1>
      
      <div className='services-section'>
        <div className='adopt-pet'>
          <AdoptSection/>
        </div>
        
        <div className='post-pet'>
          <PostPetSection/>
        </div>
        
        <div className='leave-pet-care'>
          <LeavePetCareSection/>
        </div>
        
        <div className='return-pet-care'>
          <ReturnPetCareSection/>
        </div>
      </div>
    </div>
  )
}

export default Services
