"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
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
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, userId, code, language } = req.body;
    try {
        // Ensure the client is connected before using it
        if (!client.isOpen) {
            yield client.connect();
        }
        yield client.lPush("submission", JSON.stringify({ problemId, userId, code, language }));
        console.log("Submission received:", { problemId, userId, code, language });
        res.json({
            msg: "Submission received..."
        });
    }
    catch (error) {
        console.error("Error submitting:", error);
        res.status(500).json({
            error,
            msg: "Submission Failed..."
        });
    }
}));
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
