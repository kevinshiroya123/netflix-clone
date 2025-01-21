import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";
import Header from "./Header";
import LoadMore from "./LoadMore";
import MovieCard from "./MovieCard"; // Import the new MovieCard component
import "./Browse.css";
import Footer from "./Footer";

function Browse() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [randomMovies, setRandomMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const rowRefs = useRef({});
  const db = getFirestore();
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/signin"); // 🔥 Redirect if session is expired
      } else {
        setUser(currentUser);
      }
    });

    // Auto-logout after 30 minutes
    const timeout = setTimeout(() => {
      auth.signOut();
      navigate("/signin");
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  const genres = ["drama", "comedy", "documentary", "action", "thriller"];

  const fetchMovies = async (genre) => {
    try {
      let moviesRef = collection(db, "movies");
      let q = query(moviesRef, where("genre", "==", genre), limit(20));

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.warn(`⚠️ No more movies found for ${genre}!`);
        return;
      }

      const movieList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMoviesByGenre((prevMovies) => ({
        ...prevMovies,
        [genre]: movieList,
      }));

      if (movieList.length > 0) {
        setRandomMovies((prevMovies) => {
          const existingGenreMovie = prevMovies.find((movie) => movie.genre === genre);
          if (!existingGenreMovie) {
            const newMovie = movieList[Math.floor(Math.random() * movieList.length)];
            return [...prevMovies, newMovie];
          }
          return prevMovies;
        });
      }
    } catch (error) {
      console.error(`❌ Error fetching ${genre} movies:`, error);
    }
  };

  useEffect(() => {
    genres.forEach((genre) => fetchMovies(genre));
  }, []);

  useEffect(() => {
    if (randomMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % randomMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [randomMovies]);

  return (
    <div className="browse-container">
      <Header user={user} />

      {randomMovies.length > 0 && (
        <div className="hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>{randomMovies[currentSlide]?.title || "Featured Movie"}</h1>
            <p>{randomMovies[currentSlide]?.summary || "Description not available"}</p>
            <button className="play-button">Play</button>
          </div>
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${randomMovies[currentSlide]?.poster || "https://via.placeholder.com/300"})`,
            }}
          ></div>
          <div className="dot-slider">
            {randomMovies.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      )}

      {genres.map((genre) => (
        <div className="category" key={genre}>
          <div className="genre-header">
            <h2>{genre.charAt(0).toUpperCase() + genre.slice(1)}</h2>
            <button className="open-popup" onClick={() => setSelectedGenre(genre)}>➡</button>
          </div>
          <div className="row" ref={(el) => (rowRefs.current[genre] = el)}>
            {moviesByGenre[genre]?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ))}

      {selectedGenre && <LoadMore selectedGenre={selectedGenre} onClose={() => setSelectedGenre(null)} />}
      <Footer />
    </div>
  );
}

export default Browse;
