import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/randomQuotes.css";

const RandomQuote = () => {
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    // Fetch random quote from the backend
    axios
      .get("https://api.quot.is/v1/quote/random", {
        headers: { "X-API-Key": process.env.REACT_APP_API_KEY },
      })
      .then((response) => {
        const { quote, author, avatar } = response.data;
        setQuote(quote);
        setAuthor(author);
        setAvatar(avatar);
      })
      .catch((error) => {
        console.error("Error fetching random quote:", error);
      });
  }, []);

  console.log("Quote State:", quote); // Log the current quote state
  console.log("Author State:", author); // Log the current author state
  console.log("Avatar State:", avatar); // Log the current avatar state
  return (
    <div className="random-quote-container">
      <h2>Your Daily Dose of Wisdom!</h2>
      <blockquote>{quote}</blockquote>
      <div className="author-info">
        <img src={avatar} alt="Author Avatar" />
        <p>- {author}</p>
      </div>
      <button onClick={() => window.location.reload()}>
        Reload for Another Quote
      </button>
    </div>
  );
};

export default RandomQuote;
