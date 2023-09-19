import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RandomQuote from "./components/Quotes/RandomQuote";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>

        <Routes>
          <Route path="/" element= {<HeroSection />} />  
          <Route path="/Random-Quote" element={<RandomQuote />} />
        </Routes>    
        
      </div>
    </Router>


  );
}

export default App;
