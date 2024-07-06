import { Router } from "express";
import chatGpt from "../controllers/chatGPT";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Welcome to the chatGPT API!" });
})

router.post('/chat', async (req, res) => {
    try {
        const { helper, text, id, model } = req.body;
        const response = await chatGpt(helper, text, model, id);
        res.json({ response, id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;