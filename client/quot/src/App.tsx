import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RandomQuote from "./components/Quotes/RandomQuote";
import Team from "./components/Pages/Team";
import About from "./components/Pages/About";
import Blog from "./components/Pages/Blog";
import Privacy from "./components/Pages/Privacy";


function App() {
  return (
    <Router>
      <div className="App">
        <Header/>

        <Routes>
          <Route path="/" element= {<HeroSection />} />  
          <Route path="/random-quote" element={<RandomQuote />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />


        </Routes>    
        
      </div>
    </Router>


  );
}

export default App;
