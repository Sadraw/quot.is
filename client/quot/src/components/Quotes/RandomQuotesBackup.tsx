import React, { useEffect, useState } from "react";
import apiKey from "./api-key";
import "../../styles/RandomQuote.css"



const RandomQuote = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categories, setCategories] = useState("");

    useEffect(() => {
        const apiUrl = "https://api.quot.is/v1/quote";
        
        // making the api request to the server 
    
        fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },

        })
        .then((response) => response.json())
        .then((data: {quote: string; author: string; imageUrl: string; categories: string;}) => {
            // update the state with the api response data
            setQuote(data.quote);
            setAuthor(data.author);
            setImageUrl(data.imageUrl);
            setCategories(data.categories);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);

        });

    })
    
    return (

        <section className="RandomQuote">

        <div className="RandomQuote-content">
                
            <h1 >Random Quote of the Day</h1>

            <img className="Image" src={imageUrl} alt={author} />
            
            <p>{quote}</p>

            <p>{author}</p>

            <p>{categories}</p>
            
        </div>

        </section>

    )
}

export default RandomQuote;
