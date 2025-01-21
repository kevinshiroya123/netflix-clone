import React from 'react';
import './Jumbotron.css';

function Jumbotron({ title, description, image, reverse }) {
  return (
    <div className = "jumbotron-container" >
        <div className={`jumbotron-content ${reverse ? 'reverse' : ''}`}>
          
              <div className="text">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <img className="image" src={image} alt={title} />
      </div>
    </div>
  );
}

export default Jumbotron;
