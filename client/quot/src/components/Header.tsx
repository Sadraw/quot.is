import React from "react";
import '../styles/Header.css'



const Header = () => {

    return(

        <header>
            <nav className="nav-menu">
                <ul>
                    <li> <a href="/">Home</a></li>
                    <li> <a href="#blog">Blog</a></li>
                    <li> <a href="#Team">Team</a></li>
                    <li> <a href="/about">About</a></li>
                    <li> <a href="https://github.com/Sadraw/quot.is">Github</a></li>


                </ul>
            </nav>
        </header>



        );
}

export default Header;
