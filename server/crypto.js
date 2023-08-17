const crypto = require("crypto");

const generateApiKey = () => {
  const apiKeyLength = 32; // Adjust the length of the API key as needed
  return crypto.randomBytes(apiKeyLength).toString("hex");
};

// Generate the API key
const apiKey = generateApiKey();

console.log("Generated API Key:", apiKey);