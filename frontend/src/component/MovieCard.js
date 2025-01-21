import React, { useState } from "react";
import "./MovieCard.css"; // Import CSS
import MoviePopup from "./MoviePopup"; // Import Popup Component

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup

  return (
    <>
      <div
        className="movie-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowPopup(true)} // Open popup on click
      >
        {/* Movie Poster */}
        <div
          className="movie-poster"
          style={{
            backgroundImage: `url(${movie.poster || "https://via.placeholder.com/150"})`,
          }}
        >
          {/* Overlay: Covers the entire poster on hover */}
          {hovered && <div className="movie-overlay"></div>}
        </div>

        {/* Movie Details: Always visible at bottom left */}
        {hovered && (
          <div className="movie-details">
            <h3>{movie.title}</h3>
            <p>{movie.summary.length > 80 ? movie.summary.substring(0, 80) + "..." : movie.summary}</p>
          </div>
        )}
      </div>

      {/* Popup: Shows movie details when clicked */}
      {showPopup && <MoviePopup movie={movie} onClose={() => setShowPopup(false)} />}
    </>
  );
}

export default MovieCard;
