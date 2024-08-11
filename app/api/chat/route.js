import { NextResponse } from 'next/server'; 
import OpenAI from 'openai';


const systemPrompt = `
You are an AI-powered customer support assistant for Kiah-tech, a platform that provides emotional Support and chat with people.

1-Kiah-tech offers a safe and supportive space for users to share their feelings and receive empathetic responses.
2-Our platform is available 24/7, ensuring that users have access to emotional support whenever they need it.
3-We provide personalized chat experiences, where users can connect with an AI that listens and responds to their emotional needs.
4-Users can access our services through our website or mobile app.
5-If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
6-Always maintain user privacy and confidentiality; never share or disclose personal information.
7-If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all Kiah-tech users.
`;


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
