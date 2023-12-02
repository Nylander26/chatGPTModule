import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessageParam {
  role: 'user' | 'assistant';
  content: string | null;
}

interface Conversation {
  [id: string]: ChatMessageParam[];
}

let conversations: Conversation = {};

const chatGpt = async (helper: string, text: string, model: string, id: string): Promise<string> => {
  const messages = conversations[id] ||= []; // Asigna un array vacío si no existe una conversación

  messages.push({ role: "user", content: text });

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.68,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const assistantMessage = response.choices[0].message.content || 'No response';
  messages.push({ role: "assistant", content: assistantMessage });

  return assistantMessage;
};

export default chatGpt;
