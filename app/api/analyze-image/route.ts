import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ prompt: 'API key not configured' }, { status: 500 });
    }
    
    // Extract base64 data
    const base64Data = image.split(',')[1];
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: 'Analyze this image and generate a detailed prompt that could be used to recreate it with AI image generation tools. Focus on style, composition, colors, mood, and key visual elements. Be specific but concise.'
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json({ prompt: 'Failed to analyze image' }, { status: 500 });
    }

    const data = await response.json();
    const prompt = data.content?.[0]?.text || 'Unable to analyze image';

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ prompt: 'Error analyzing image' }, { status: 500 });
  }
}