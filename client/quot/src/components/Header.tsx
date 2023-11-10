import React from "react";
import '../styles/Header.css'
import { Link } from "react-router-dom";



const Header = () => {

    return(

        <header>
            <nav className="nav-menu">
                <ul>
                    <li> <Link to="/">Home</Link></li>
                    <li> <Link to="/blog">Blog</Link></li>
                    <li> <Link to="/team">Team</Link></li>
                    <li> <Link to="/about">About</Link></li>
                    <li> <Link to="/privacy">Privacy</Link></li>
                    <li> <a href="https://github.com/Sadraw/quot.is" target="_blank">Github</a></li>


                </ul>
            </nav>
        </header>



        );
}

export default Header;
