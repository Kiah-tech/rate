import { NextResponse } from 'next/server'; 
import OpenAI from 'openai';


const systemPrompt = `You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if neede;
`


export async function POST(req) {
 
  const data = await req.json(); 

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
  })


  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-8b-instruct:free",
    messages: [{ role: 'system', content: systemPrompt }, ...data], 
    stream: true, 
  });

 
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); 
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; 
          if (content) {
            const text = encoder.encode(content); 
            controller.enqueue(text); 
          }
        }
      } catch (err) {
        controller.error(err); 
      } finally {
        controller.close(); 
      }
    },
  });

  return new NextResponse(stream); 
}
