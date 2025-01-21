import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs, query, where, limit, startAfter } from "firebase/firestore";
import "./LoadMore.css";
import MovieCard from "./MovieCard"; // ✅ Import MovieCard component
import MoviePopup from "./MoviePopup";

function LoadMore({ selectedGenre, onClose }) {
  const [popupMovies, setPopupMovies] = useState([]);
  const [popupLastVisible, setPopupLastVisible] = useState(null);
  const popupRef = useRef(null);
  const db = getFirestore();

  // Fetch Movies for Popup (20 at a time)
  const fetchPopupMovies = async (fetchMore = false) => {
    if (!selectedGenre) return;

    try {
      let moviesRef = collection(db, "movies");
      let q = query(moviesRef, where("genre", "==", selectedGenre), limit(20));

      if (fetchMore && popupLastVisible) {
        q = query(moviesRef, where("genre", "==", selectedGenre), startAfter(popupLastVisible), limit(20));
      }

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.warn(`⚠️ No more movies found for ${selectedGenre}!`);
        return;
      }

      const movieList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPopupLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setPopupMovies((prevMovies) => (fetchMore ? [...prevMovies, ...movieList] : movieList));
    } catch (error) {
      console.error(`❌ Error fetching popup movies for ${selectedGenre}:`, error);
    }
  };

  useEffect(() => {
    fetchPopupMovies();
  }, [selectedGenre]);

  // Infinite Scroll in Popup
  const handleScroll = () => {
    if (popupRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = popupRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        fetchPopupMovies(true);
      }
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" ref={popupRef} onScroll={handleScroll} onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>❌</button>
        <h2>{selectedGenre?.charAt(0).toUpperCase() + selectedGenre?.slice(1)} Movies</h2>
        <div className="popup-movies">
        {popupMovies.map((movie) => (
            <div className="popup-movie-card" key={movie.id}> {/* ✅ Wrapper class for scoping */}
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadMore;
