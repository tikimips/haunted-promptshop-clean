import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('No Anthropic API key found');
      return NextResponse.json({ prompt: 'API key not configured. Please add ANTHROPIC_API_KEY to environment variables.' }, { status: 500 });
    }
    
    // Extract base64 data
    const base64Data = image.split(',')[1];
    console.log('Base64 data length:', base64Data?.length);
    
    if (!base64Data) {
      return NextResponse.json({ prompt: 'Invalid image format' }, { status: 400 });
    }

    console.log('Making request to Anthropic API...');
    
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

    console.log('Anthropic response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ 
        prompt: `API Error (${response.status}): ${errorText.substring(0, 100)}...` 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('Anthropic response received');
    
    const prompt = data.content?.[0]?.text || 'Unable to extract prompt from response';
    
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error in analyze-image:', error);
    return NextResponse.json({ 
      prompt: `Server error: ${error.message}` 
    }, { status: 500 });
  }
}