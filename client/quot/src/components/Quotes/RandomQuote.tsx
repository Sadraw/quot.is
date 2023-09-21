import React, { useEffect, useState } from "react";
import "../../styles/RandomQuote.css";

const RandomQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    const apiUrl = "https://api.quot.is/random-quote"; // Use the server-side route

    console.log("API Request Started");
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Request Successful", data);
        setQuote(data.quote);
        setAuthor(data.author);
        setImageUrl(data.imageUrl);
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <section className="RandomQuote">
      <div className="RandomQuote-content">
        <h1>Random Quote of the Day</h1>

        <div className="letter-image">
          <div className="animated-mail">
            <div className="back-fold"></div>
            <div className="letter">
              <div className="letter-border"></div>
              <div className="letter-title"></div>
              <div className="letter-context"></div>
              <div className="letter-stamp">
                <div className="letter-stamp-inner"></div>
              </div>
            </div>
            <div className="top-fold"></div>
            <div className="body"></div>
            <div className="left-fold"></div>
          </div>
          <div className="shadow"></div>
        </div>

        <img className="Image" src={imageUrl} alt={author} />
        <p>{quote}</p>
        <p>{author}</p>
        <p>{categories}</p>
      </div>
    </section>
  );
};

export default RandomQuote;
