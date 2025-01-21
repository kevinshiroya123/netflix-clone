import React from "react";
import "./MoviePopup.css"; // Import CSS for styling
import LoadMore from "./LoadMore";

function MoviePopup({ movie, onClose }) {
  if (!movie) return null; // Don't render if no movie is selected

  return (
    <div className="movie-popup-overlay" onClick={onClose}>
      <div className="movie-popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="movie-close-button" onClick={onClose}>❌</button>
        
        {/* Left Side: Movie Details */}
        <div className="movie-popup-details">
          <h2>{movie.title}</h2>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>IMDb Rating:</strong> ⭐ {movie.imdb_score || "N/A"}</p>
          <p><strong>Summary:</strong> {movie.summary}</p>
        </div>

        {/* Right Side: Movie Poster */}
        <div className="movie-popup-poster">
          <img 
            src={movie.poster || "https://via.placeholder.com/300"} 
            alt={movie.title} 
            onError={(e) => e.target.src = "https://via.placeholder.com/300"}
          />
        </div>
      </div>
    </div>
  );
}

export default MoviePopup;
