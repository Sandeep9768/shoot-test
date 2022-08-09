import React from 'react';

import './styles.css';

const PageNavigation = (props) => {

  const {
    loading,
    showPrevLink,
    showNextLink,
    handlePrevClick, 
    handleNextClick
  } = props

  return (
    <div className="nav-link-container"> 
      <a 
        href="#" 
        alt="paginate prev"
        className={
          `nav-link ${ showPrevLink ? 'show' : 'hide' }
                    ${ loading ? 'greyed-out' : '' }`
                  }
        onClick={handlePrevClick}
      >
        Prev
      </a>
      <a 
        href="#" alt="paginate next"
        className={
          `nav-link ${ showNextLink ? 'show' : 'hide' }
          ${ loading ? 'greyed-out' : '' }`
        }
        onClick={handleNextClick}
      >
        Next
      </a>
    </div>
  )
}

export default PageNavigation;
