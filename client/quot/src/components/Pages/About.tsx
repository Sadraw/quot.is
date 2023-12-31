import React, {useEffect} from "react";
import '../../styles/About.css'
import { Link } from "react-router-dom";



const About = () => {
  useEffect(() => {
    const rowContainers = document.querySelectorAll(".row-container");
    const revealRow = (row:any, index:number) => {
      setTimeout(() => {
        row.style.opacity = "1";
        row.style.transform = "translateY(0)"; // Fixed the typo in 'transform'
      }, index * 400); // Adjust the delay (in milliseconds) between row animations
    };

    rowContainers.forEach((row, index) => {
      window.addEventListener("scroll", () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const rowPosition = row.getBoundingClientRect().top + window.scrollY; // Use getBoundingClientRect() to get the element's position
        if (scrollPosition > rowPosition) {
          revealRow(row, index);
        }
      });
    });
  }, []);

  return(
    <section className="about-section">

      <div className="deal-row">
          
        <h2>What is the Deal With Quot?</h2>
          <p>So, you stumbled upon quot.is, huh? Well, prepare yourself for a rollercoaster ride through a world of quotes and facts that'll make your brain do backflips! But first things first, let's get a bit formal: quot.is is open-source software, and we're sticklers for the GNU General Public License v2.0 (GPL-2.0). It's like the golden rule here – use, modify, and share the code, but keep it on the straight and narrow with the GPL-2.0 License. No shenanigans, folks! 😎 </p>

      </div>
      <div className="row-container">

      <div className="lowdown-row">

        <h2>The Lowdown</h2>
          <p>
          Quot.is is where inspiration, wisdom, and humor come together for a fantastic experience! We're your go-to source for empowering quotes, uplifting spirits, and mind-blowing fun facts. Get ready to conquer mountains, turn lemons into lemonade, and discover things you never knew. We're your ticket to a world of knowledge and amusement! 🎉🤓
          </p>

      </div>
      </div>


      <div className="row-container">

      <div className="universe-row">

        <h2>The Universe</h2>
          <p>
          Our website is like a virtual museum of wisdom and fun. It's like a theme park for your brain, beautifully designed to make your browsing experience as smooth as a dolphin's backflip. Explore, get lost, and come back for more!
          And for those of you who can't get enough wisdom, we've got an Android app. Now you can carry inspiration in your pocket, right next to your snacks and cat videos! It's user-friendly, so even your pet goldfish could use it (if they had thumbs).
          </p>
      </div>
      </div>

      <div className="row-container">

      <div className="cherry-row">

        <h2> The Cherry on Top</h2>
        <p>
          We're all about personalization. Tailor your quot.is experience to suit your vibes. Save your favorite quotes and fun facts, and let quot.is be your personal guru.
          Don't forget the daily reminders! Opt-in for a daily dose of wisdom to start your day with a smile. 🌞
          Oh, and we have a nifty widget that's cooler than an iceberg on a polar bear's nose. It'll bring inspiring quotes and intriguing fun facts straight to your Android home screen. Just because we can.
          </p>
      </div>
      </div>

      <div className="row-container">

      <div className="revolution-row">

          <h2>Join the Quot Revolution!</h2>
          <p>
            We're not just a two-person show. Meet our genius developers.
            </p>

            <p>
            They're the brains behind this operation, and they're cooler than a snowman in shades.
            </p>

          <p className="team-button-p">
            <Link
            to="/team"
            className="team-button"
          >
            Meet the Team
          </Link>
          </p>
      </div>

      </div>




    </section>
  )
}

export default About;