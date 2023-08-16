import React, { useState, useEffect } from "react";

function QuotePage() {
  const [quoteData, setQuoteData] = useState({
    quote: "",
    author: "",
    avatarUrl: "",
    categories: [],
  });

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
      const response = await fetch(
        `https://api.quot.is/v1/quote/random?api_key=${apiKey}`
      );
      const data = await response.json();
      console.log(data); // Log the API response to the console
      setQuoteData({
        quote: data.quote,
        author: data.author,
        avatarUrl: data.avatarUrl,
        categories: data.categories,
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const { quote, author, avatarUrl, categories } = quoteData;

  return (
    <div>
      <div>
        <img src={avatarUrl} alt={`${author}'s Avatar`} />
        <h2>{quote}</h2>
        <p>- {author}</p>
        <p>Categories: {categories.join(", ")}</p>
      </div>
    </div>
  );
}

export default QuotePage;
