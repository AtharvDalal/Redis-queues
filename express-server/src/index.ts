import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('ready', () => {
    console.log('Redis client ready');
});

// Wait for the client to be ready before proceeding
client.connect().then(() => {
    console.log('Redis client connected and ready to use');
}).catch(err => {
    console.error('Error connecting to Redis:', err);
});

app.post('/submit', async (req, res) => {
    const { problemId, userId, code, language } = req.body;
    try {
        // Ensure the client is connected before using it
        if (!client.isOpen) {
            await client.connect();
        }

        await client.lPush("submission", JSON.stringify({ problemId, userId, code, language }));
        console.log("Submission received:", { problemId, userId, code, language });
        res.json({
            msg: "Submission received..."
        });
    } catch (error) {
        console.error("Error submitting:", error);
        res.status(500).json({
            error,
            msg: "Submission Failed..."
        });
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
