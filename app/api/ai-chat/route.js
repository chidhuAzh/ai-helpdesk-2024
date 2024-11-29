import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
const troubleshootingVideos = {
    mouse: {
        url: 'https://youtu.be/uBoYxiynN0A?si=1soPoKB7gJp2B3U-',
        title: 'Mouse Troubleshooting Guide',
        category: 'hardware',
        keywords: ['mouse', 'clicking', 'cursor', 'pointer', 'scroll']
    },
    keyboard: {
        url: 'https://youtu.be/IFddlopXrIA?si=zYf4_wCXgh7s3d3V',
        title: 'Keyboard Troubleshooting Guide',
        category: 'hardware',
        keywords: ['keyboard', 'typing', 'keys', 'spacebar']
    },
    systemPerformance: {
        url: 'https://www.youtube.com/watch?v=j2RW8Rt1nP4',
        title: 'System Performance Optimization',
        category: 'performance',
        keywords: ['slow', 'performance', 'speed', 'lag', 'freezing']
    },
    display: {
        url: 'https://www.youtube.com/watch?v=m3Bqh_EdgvI',
        title: 'Display Troubleshooting Guide',
        category: 'hardware',
        keywords: ['display', 'monitor', 'screen', 'resolution', 'flickering', 'no display']
    },
    printer: {
        url: 'https://www.youtube.com/watch?v=pK8a_Jsj3wE',
        title: 'Printer Troubleshooting Guide',
        category: 'hardware',
        keywords: ['printer', 'printing', 'paper jam', 'print quality', 'not printing']
    }
};
 
function findRelevantVideos(userMessage) {
    const message = userMessage.toLowerCase();
    return Object.values(troubleshootingVideos)
        .filter(video => 
            video.keywords.some(keyword => 
                message.includes(keyword.toLowerCase())
            )
        );
}
 
async function createTaskFallback(taskDetails) {
    try {
        console.log('Creating fallback task with details:', taskDetails);
        const response = await fetch('http://localhost:3000/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskDetails),
        });
 
        console.log('Response status:', response.status);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);
 
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText} - ${responseBody}`);
        }
 
        return JSON.parse(responseBody);
    } catch (error) {
        console.error('Error creating fallback task:', error);
        throw error;
    }
}
 
export async function POST(request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
 
    // Check if session exists
    if (!session) {
        console.error('No user session found');
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
 
    // Now you can safely access session.user
    const userId = session.user.id; // Access user ID safely
    console.log('User ID:', userId);
 
    try {
        const body = await request.json();
        const { messages } = body;
 
        if (!messages || messages.length === 0) {
            return NextResponse.json({
                message: "Hello! I'm your IT support assistant. How may I help you today with your support ticket?"
            });
        }
 
        const userMessage = messages[messages.length - 1].content;
        const relevantVideos = findRelevantVideos(userMessage);
 
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a knowledgeable IT support assistant. Provide detailed troubleshooting steps for user queries. If still the user face the same issue, reply them with the exact message like 'Sorry to hear this, I will create a ticket for you' - [Note: ] don't change this message."
                },
                ...messages
            ],
        });
 
        const openaiResponse = completion.choices[0].message.content.trim();
        console.log("openaiResponse",openaiResponse);
        if (!openaiResponse || openaiResponse.toLowerCase().includes("i will create a ticket for you")) {
            console.log("OpenAI couldn't provide a solution; creating a fallback task");
            const fallbackTaskDetails = {
                title: "Troubleshooting Request11111",
                body: `User issue: ${userMessage}`,
                priority: "Medium Priority",
                category: "bug",
                attachments: [],
                department: "IT",
                impact: "single",
                created_by: userId,
                asigned_to: userId,
                status: "Open",
                updated_at: new Date().toISOString(),
            };
 
            try {
                const taskResponse = await createTaskFallback(fallbackTaskDetails);
                console.log('Fallback task created successfully:', taskResponse);
                return NextResponse.json({
                    message: "OpenAI couldn't resolve the issue. A support ticket has been created.",
                    taskDetails: taskResponse,
                });
            } catch (error) {
                console.error('Failed to create fallback task:', error);
                return NextResponse.json({ error: 'Failed to create fallback task' }, { status: 500 });
            }
        }
 
      return NextResponse.json({ 
          message: openaiResponse,
          videos: relevantVideos.length > 0 ? relevantVideos.map(video => video.url) : null
      });
 
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}