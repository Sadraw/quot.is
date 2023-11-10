import React, { useEffect } from "react";
import "../../styles/About.css";
import "../../styles/Privacy.css";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <section className="about-section">
      <div className="deal-row">
        <h2>Privacy and Policy</h2>
        <p>
          Quot is an app to give a quote a day, as it is always a pleasure to
          get the all the wisdom in short few sentence and leave the rest to
          your imagination and make the best out of it.
        </p>
        <p>
          Disclamer: - Quot doesn't have responsibility for the one's
          interpretation of the content. - Quot doesn't guarantee orginality of
          the given quote, however we try to provide the most reliable content.
        </p>
        <p>
<h2 className="children">        Children's Privacy
</h2>
Quot.is is intended for users of all ages, including children. We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will take steps to remove that information from our servers.          </p>
      </div>
    </section>
  );
};

export default Privacy;
