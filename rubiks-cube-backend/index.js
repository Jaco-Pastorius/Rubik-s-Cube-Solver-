const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Cube = require('cubejs');
const {configuration, OpenAIApi} = require('openai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/solve-cube', (req,res) => {
    const cubeState = req.body.cubeState;
    try {
        const solution = Cube.solve(cubeState);
        res.json({solution});
    } catch (error) {
        res.status(400).json({error: 'Invalid cube state'});
    }
});

const openaiConfig = new configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(openaiConfig);

app.post('/chatbot', async (req,res) => {
    const userInput = req.body.message;
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: userInput
                }
            ]
        });
        res.json({response: response.data.choices[0].message.content});
    } catch (error) {
        res.status(500).json({error: 'Chatbot error'});
    }
});