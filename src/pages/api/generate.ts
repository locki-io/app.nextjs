import { chatbotPrompt } from '@/app/helpers/constants/chatbot-prompt';
import {
  ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload
} from '@/lib/openai-stream';

export default async function POST(req: Request) {
  const { dataStream } = await req.json();

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
    stream: true, // mandatory for streaming
    n: 1
  };

  // Convert the response into a friendly text-stream
  const stream = await OpenAIStream(payload);
  // Respond with the stream
  return new Response(stream);
}
