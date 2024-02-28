import { chatbotPrompt } from "@/app/helpers/constants/chatbot-prompt"
import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream"
import { MessageArraySchema } from "@/lib/validators/message"

export async function POST(req: Request) {
  console.log('post')
  const {messages} = await req.json()

  const parsedMessages = MessageArraySchema.parse(messages)

  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
    role: message.isUserMessage ? 'user' : 'system',
    content: message.text,
  }))

  outboundMessages.unshift({
   role: 'system',
   content: chatbotPrompt
  })

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: outboundMessages,
    max_tokens: 150,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 1,
    stream: true, // mandatory for streaming
    n: 1
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}