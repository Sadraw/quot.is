import React from "react";
import "../../styles/Team.css";
import AliZeynali from "../../Images/Ali.png";
import SadraDaneshmand from "../../Images/Sadra.png";

const Team = () => {
  return (
    <div className="about-page">

      <div className="column1">

        <div className="Sadra">

          <h2>Sadra Daneshmand</h2>
          <img className="Sadra" src={SadraDaneshmand} alt="Sadra Daneshmand" />

        </div>

      </div>

      <div className="column2">

        <div className="Ali">

          <h2>Ali Zeynali</h2>
          <img className="Ali" src={AliZeynali} alt="Sadra Daneshmand" />

        </div>

      </div>

    </div>
  );
};

export default Team;
