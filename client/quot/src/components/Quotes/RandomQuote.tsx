import React, { useEffect, useState } from "react";
import apiKey from "./api-key";



const RandomQuote = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        // making the api request to the server 
        fetch("https://api.quot.is/v1/quote");
    })
    return (
        <div>

        </div>
    )
}

export default RandomQuote;
