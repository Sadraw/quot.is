import React from "react";
import "../../styles/Team.css";
import AliZeynali from "../../Images/Ali.jpg";
import SadraDaneshmand from "../../Images/Sadra.jpg";
import Github from "../../Images/github-mark/github-mark.svg";
import Linkedin from "../../Images/Linkedin/icons8-linkedin-100.svg";

const Team = () => {
  return (
    <div className="team-page">
      <div className="column">
        <div className="Sadra ">
          <h2>Sadra Daneshmand</h2>

          <div className="image-bg-effect">
            <img
              className="Sadra "
              src={SadraDaneshmand}
              alt="Sadra Daneshmand"
            />
          </div>
          <h3>Web-Developer</h3>
        </div>

        <section className="SadraSocial">
          <a href="https://github.com/Sadraw" target="_blank">
            <img src={Github} alt="Sadra Daneshmand" />
          </a>

          <a
            href="https://www.linkedin.com/in/sadradaneshmand/"
            target="_blank"
          >
            <img src={Linkedin} alt="Sadra Daneshmand" />
          </a>
        </section>
      </div>

      <div className="column">
        <div className="Ali">
          <h2>Ali Zeynali</h2>

          <div className="image-bg-effect">
            <img className="Ali" src={AliZeynali} alt="Ali Zeynali" />
          </div>
          <h3>Android Developer</h3>
        </div>

        <div className="AliSocial">
          <a href="https://github.com/alizeyn" target="_blank">
            <img src={Github} alt="Ali Zeynali" />
          </a>

          <a href="https://www.linkedin.com/in/alizeynali/" target="_blank">
            <img src={Linkedin} alt="Ali Zeynali" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;
