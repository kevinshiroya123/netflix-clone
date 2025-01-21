import React from 'react';
import Jumbotron from './Jumbotron';
import Main from './Main';
import FAQ from './FAQ';
import Header from './Header';
import Footer from './Footer';
function Home() {
  return (
    <div>       
      <Header/>
      <Main />
      <Jumbotron
        title="Enjoy on your TV."
        description="Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more."
        image="https://via.placeholder.com/500x300.png?text=TV+Image"
        reverse={false}
      />
      <Jumbotron
        title="Download your shows to watch offline."
        description="Save your favourites easily and always have something to watch."
        image="https://via.placeholder.com/500x300.png?text=Download+Image"
        reverse={true}
      />
      <Jumbotron
        title="Watch everywhere."
        description="Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV."
        image="https://via.placeholder.com/500x300.png?text=Devices+Image"
        reverse={false}
      />
        <FAQ />
        <Footer />
    </div>
  );
}

export default Home;
