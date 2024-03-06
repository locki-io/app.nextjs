import { chatbotPrompt } from '@/app/helpers/constants/chatbot-prompt';
import {
  ChatGPTMessage,
  OpenAIResponse,
  OpenAIStreamPayload
} from '@/lib/openai-stream';

export default async function POST(req: any, res: any) {
  try {
    const { dataStream } = req.body; // Access the request body directly
    console.log(dataStream);
    const outboundMessages: ChatGPTMessage[] = [
      { role: 'system', content: 'You are helpful python code assistant.' },
      { role: 'user', content: dataStream }
    ];

    outboundMessages.unshift({
      role: 'system',
      content: chatbotPrompt
    });

    const payload: OpenAIStreamPayload = {
      model: 'gpt-3.5-turbo',
      messages: outboundMessages,
      max_tokens: 2500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 1,
      stream: false, // mandatory for streaming
      n: 1
    };

    // Convert the response into a friendly text-stream
    const response = await OpenAIResponse(payload);

    // Extract message content from the response
    const messageContent = response.choices[0]?.message?.content || '';
    // Respond with the stream
    return res.status(200).send(messageContent);
  } catch (error) {
    console.error('An error occurred:', error);
    // Return an appropriate error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
