#  quot.is

[![License: GPL-2.0](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0)

## License

**quot.is** is open-source software licensed under the [GNU General Public License v2.0 (GPL-2.0)](https://www.gnu.org/licenses/gpl-2.0). Feel free to use, modify, and distribute the code while adhering to the terms of the GPL-2.0 License.

## Description

Welcome to **quot.is**, a **delightful** platform that brings together a collection of inspiring quotes and captivating fun facts. Our mission is to spark curiosity and ignite inspiration, providing a gateway to endless wisdom. Users can explore thoughtfully curated quotes and intriguing facts that enlighten, motivate, and entertain.

## Explore Our Platform

## 💻 [Website](https://quot.is)

The **quot.is** website showcases a beautifully designed and interactive platform that provides a seamless browsing experience to explore a vast collection of quotes and fun facts.

## 📱 [Android App](https://github.com/alizeyn/Quot)

Take inspiration on-the-go with the **quot.is** Android app, which serves as a portable source of daily wisdom. The app offers a user-friendly interface and allows users to access their favorite quotes and fun facts anytime, anywhere.

## Key Features

- **🚀 Inspiring Quotes:** Discover an extensive collection of thoughtfully curated quotes that **empower**, **uplift**, and **motivate**.
- **🔍 Fascinating Fun Facts:** Dive into a trove of captivating fun facts that **expand knowledge** and encourage engaging conversations.
- **👤 Personalization:** Tailor the quot.is experience to individual preferences, with options to **save favorite quotes** and fun facts for later reference.
- **🗓️ Daily Reminders:** Opt-in for daily quote reminders to start each day with a dose of inspiration and positivity.
- **📱 Cool Widget:** Enjoy a cool widget that brings inspiring quotes and intriguing fun facts directly to your Android home screen.
- **📢 Share and Engage:** Empower users to **share their favorite quotes** and fun facts across social media platforms and inspire others.

## Collaborators

quot.is is the result of a collaborative effort by the following two developers:

1. [Ali Zeynali](https://github.com/alizeyn)
2. [Sadra Daneshmand](https://github.com/Sadraw)


## API Reference

This API provides random quotes from the Quot.is platform.

### Base URL

The base URL for all API endpoints is `https://api.quot.is`.

### Authentication

#### Error Responses

- `401 Unauthorized` - When the API key is missing or invalid.
- `404 Not Found` - When the requested domain is not `api.quot.is`.

### Endpoints

#### Get a Random Quote

- **URL**: `/random-quote`
- **Method**: `GET`
- **Description**: Get a random quote from the Quot.is platform.
- **Parameters**:
  - `categoryIds` (optional): Comma-separated list of category IDs to filter quotes by category.
- **Response**:

```json
{
  "quote": "The quote text goes here",
  "author": "Author Name",
  "imageUrl": "https://example.com/author-image.jpg",
  "categories": [
    {
      "name": "Category Name"
    }
  ]
}
```

#### Get a Random Quote (Version 1)

    URL: /v1/quote
    Method: GET
    Description: Get a random quote from the Quot.is platform (version 1).
    Parameters:
        categoryIds (optional): Comma-separated list of category IDs to filter quotes by category.
    Response:

```json

{
  "quote": "The quote text goes here",
  "author": "Author Name",
  "imageUrl": "https://example.com/author-image.jpg",
  "categories": [
    {
      "name": "Category Name"
    }
  ]
}
```
#### Get Categories

    URL: /categories
    Method: GET
    Description: Get a list of all available categories.
    Response:

```json

[
  "Category Name 1",
  "Category Name 2",
  // ...
]
```


#### Example Usage


```java
const fetch = require("node-fetch");

const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.quot.is";

async function getRandomQuote(categoryIds) {
  const url = new URL(`${BASE_URL}/random-quote`);
  if (categoryIds) {
    url.searchParams.append("categoryIds", categoryIds.join(","));
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
  } else {
    console.error("Failed to fetch a random quote:", response.statusText);
  }
}


// Example usage:
getRandomQuote(["1", "2"]);
```
#### Error Handling

    If there is an error, the API will respond with a JSON object containing an error field with an error message.

#### Notes

    All responses include CORS headers to allow requests from https://quot.is.



## Contributing

We welcome contributions from the open-source community. If you'd like to contribute to quot.is, please follow the guidelines outlined in the [**CONTRIBUTING.md**](CONTRIBUTING.md) file.