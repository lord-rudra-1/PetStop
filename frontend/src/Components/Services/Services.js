import React, { useState } from 'react'
import AdoptSection from './AdoptSection'
import PostPetSection from './PostPetSection'
import LeavePetCareSection from './LeavePetCareSection'
import ReturnPetCareSection from './ReturnPetCareSection'
import './Services.css'

const Services = () => {
  const [activeSection, setActiveSection] = useState('adopt')

  const renderSection = () => {
    switch (activeSection) {
      case 'adopt':
        return <AdoptSection />
      case 'post':
        return <PostPetSection />
      case 'leave':
        return <LeavePetCareSection />
      case 'return':
        return <ReturnPetCareSection />
      default:
        return <AdoptSection />
    }
  }

  return (
    <div className='services-container'>
      
      <div className='services-layout'>
        <nav className='services-sidebar'>
          <ul className='services-nav-list'>
            <li className='services-nav-item'>
              <a 
                className={`services-nav-link ${activeSection === 'adopt' ? 'active' : ''}`}
                onClick={() => setActiveSection('adopt')}
                href="#"
              >
                Adopt a Pet
              </a>
            </li>
            <li className='services-nav-item'>
              <a 
                className={`services-nav-link ${activeSection === 'post' ? 'active' : ''}`}
                onClick={() => setActiveSection('post')}
                href="#"
              >
                Leave Pet for Adoption
              </a>
            </li>
            <li className='services-nav-item'>
              <a 
                className={`services-nav-link ${activeSection === 'leave' ? 'active' : ''}`}
                onClick={() => setActiveSection('leave')}
                href="#"
              >
                Pet Boarding & Care
              </a>
            </li>
            <li className='services-nav-item'>
              <a 
                className={`services-nav-link ${activeSection === 'return' ? 'active' : ''}`}
                onClick={() => setActiveSection('return')}
                href="#"
              >
                Return Pet Care
              </a>
            </li>
          </ul>
        </nav>

        <div className='services-content'>
          {renderSection()}
        </div>
      </div>
    </div>
  )
}

export default Services
