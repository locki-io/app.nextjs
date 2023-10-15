import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export default async function POST(req: Request) {
  const { dataStream } = await req.json();

  const myPrompt =
    'Please describe the artistic and functional aspects of the following Python code. Provide an originality index by comparing it to the existing Blender Python code at the end.';

  const messageWithCode = `${myPrompt}\n${dataStream}`;
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are helpful python code assistant.' },
    { role: 'user', content: messageWithCode }
  ];

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const streamingResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 100,
    temperature: 0.7,
    stream: true // mandatory for streaming
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(streamingResponse);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
