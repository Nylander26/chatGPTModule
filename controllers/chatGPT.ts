import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessageParam {
	role: "user" | "system" | "assistant";
	content: string | null;
}

interface Conversation {
	[id: string]: ChatMessageParam[];
}

interface RequestQueueItem {
	resolve: (value: string | PromiseLike<string>) => void;
	helper: string;
	text: string;
	model: string;
}

const conversations: Conversation = {};
const requestQueues: { [id: string]: RequestQueueItem[] } = {};

const transformMessages = (messages: ChatMessageParam[]): OpenAI.Chat.Completions.ChatCompletionMessageParam[] => {
	return messages.map(message => {
		if (message.role === "assistant") {
			return {
				role: message.role,
				content: message.content,
				name: "assistant_name",
			} as unknown as OpenAI.Chat.Completions.ChatCompletionFunctionMessageParam;
		} else {
			return {
				role: message.role,
				content: message.content,
			} as OpenAI.Chat.Completions.ChatCompletionMessageParam;
		}
	});
};

const processNextRequest = async (id: string) => {
	if (requestQueues[id].length === 0) {
		return;
	}

	const currentRequest = requestQueues[id][0];
	const messages = (conversations[id] ||= []);
	messages.push({ role: "system", content: currentRequest.helper });

	try {
		const response = await openai.chat.completions.create({
			model: currentRequest.model,
			messages: transformMessages(messages),
			temperature: 1.5,
			max_tokens: 200,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		const assistantMessage = response.choices[0].message.content || "No response";
		messages.push({ role: "assistant", content: assistantMessage });

		currentRequest.resolve(assistantMessage);
	} catch (error) {
		console.error("Error creating completion:", error);
		currentRequest.resolve("Error creating completion");
	}

	requestQueues[id].shift(); // Remove the processed request
	if (requestQueues[id].length > 0) {
		processNextRequest(id); // Process the next request in the queue
	}
};

const chatGpt = (helper: string, text: string, model: string, id: string): Promise<string> => {
	return new Promise(resolve => {
		const addUserMessageToConversation = (id: string, text: string) => {
			const messages = (conversations[id] ||= []);
			messages.push({ role: "user", content: text });
		};

		if (text) {
			addUserMessageToConversation(id, text);
		}

		const requestItem: RequestQueueItem = { resolve, helper, text, model };
		requestQueues[id] = requestQueues[id] || [];
		requestQueues[id].push(requestItem);

		if (requestQueues[id].length === 1) {
			processNextRequest(id);
		}
	});
};

export default chatGpt;
