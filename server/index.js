const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGODB_KEY, { useNewUrlParser: true, useUnifiedTopology: true });
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String
}));

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.post('/', async (req, res) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });

  if (!user) {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = new User({ email, password: hashedPassword });

  
    await newUser.save();

    res.json({ message: 'created' });
  } else {
  
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({ message: 'valid' });
    } else {
      res.json({ message: 'invalid' });
    }
  }
});

app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
  
});

// messages 
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

app.post('/sendMessage', async (req, res) => {
  const { message } = req.body;
  console.log(message);

  const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });
  
    const result = await chat.sendMessage(message);
    const response = result.response;
    console.log(response.text());

  res.json(response.text());
});
// app.post('/sendMessage', async (req, res) => {
//   try {
//     // Extract the message from the request body
//     const { message } = req.body;

//     // Replace 'YOUR_OPENAI_API_KEY' with your OpenAI API key
//     const apiKey = '';

//     // Make a request to the OpenAI API
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         prompt: message,
//         max_tokens: 150,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${apiKey}`,
//         },
//       }
//     );

//     
//     const aiResponse = response.data.choices[0].text.trim();

//     
//     res.json({ response: aiResponse });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.listen(3000, () => {
  console.log('listening on :3000');
});