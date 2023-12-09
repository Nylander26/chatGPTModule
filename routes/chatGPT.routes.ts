import { Router } from "express";
import chatGpt from "../controllers/chatGPT";

const router = Router();

router.post('/chat', async (req, res) => {
    try {
        const { helper, text, id } = req.body;
        console.log(id)
        const model = "gpt-4-1106-preview";
        // const model = "gpt-4"
        const response = await chatGpt(helper, text, model, id);
        res.json({ response, id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;