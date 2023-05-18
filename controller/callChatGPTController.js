const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config().parsed;
module.exports.getChatbotResponse = async (req, res, next) => {
  console.log("GPT AAA");
  const API_ENDPOINT =
    "https://api.openai.com/v1/engines/davinci-codex/completions";
  var input = "Hello chat gpt. my name is few. ";
  const API_KEY = "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"; // Replace with your OpenAI API key
  const prompt = `The following is a conversation between a human and a chatbot. The human is trying to ${input}. The chatbot responds:`;
  const data = {
    prompt: prompt,
    max_tokens: 150,
    temperature: 0.7,
    n: 1,
    stop: "\n",
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };
  const response = await axios.post(API_ENDPOINT, data, { headers: headers });
  const chatbotResponse = response.data.choices[0].text.trim();
  console.log(chatbotResponse);
  // return chatbotResponse;
};
