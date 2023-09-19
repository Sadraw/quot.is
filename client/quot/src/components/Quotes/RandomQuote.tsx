import React, { useEffect, useState } from "react";
import "../../styles/RandomQuote.css";
import apiKey from "../../../api-key.js"

const RandomQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    const apiUrl = "https://api.quot.is/v1/quote";


    // making the api request to the server
    console.log("API Request Started");
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Request Successful", data);
        // update the state with the api response data
        setQuote(data.quote);
        setAuthor(data.author);
        setImageUrl(data.imageUrl);
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run only once when mounted

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
