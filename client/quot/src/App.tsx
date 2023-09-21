import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RandomQuote from "./components/Quotes/RandomQuote";
import Team from "./components/Pages/Team";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>

        <Routes>
          <Route path="/" element= {<HeroSection />} />  
          <Route path="/random-quote" element={<RandomQuote />} />
          <Route path="/team" element={<Team />} />

        </Routes>    
        
      </div>
    </Router>


  );
}

export default App;
