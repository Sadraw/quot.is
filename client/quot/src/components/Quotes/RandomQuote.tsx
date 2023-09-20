import React, { useEffect, useState } from "react";
import "../../styles/RandomQuote.css";

const RandomQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    const apiUrl = "api.quot.is/random-quote"; // Use the server-side route

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
        <img className="Image" src={imageUrl} alt={author} />
        <p>{quote}</p>
        <p>{author}</p>
        <p>{categories}</p>
      </div>
    </section>
  );
};

export default RandomQuote;
