import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  console.log('=== API START ===');
  
  try {
    // Check environment
    console.log('Environment check:');
    console.log('- TEST_MODE:', process.env.TEST_MODE);
    console.log('- Has ANTHROPIC_API_KEY:', !!process.env.ANTHROPIC_API_KEY);
    console.log('- API Key starts with sk-ant:', process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-'));
    
    // Test mode
    if (process.env.TEST_MODE === 'true') {
      console.log('TEST_MODE enabled - returning mock response');
      return NextResponse.json({
        promptText: "Test mode: Modern minimalist design with clean lines and vibrant colors."
      });
    }

    // Parse request
    console.log('Parsing request body...');
    const body = await req.json();
    console.log('Body keys:', Object.keys(body));
    console.log('Has image:', !!body.image);
    console.log('Image length:', body.image?.length);

    if (!body.image) {
      console.error('No image in request body');
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Initialize Anthropic
    console.log('Creating Anthropic client...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Process image
    console.log('Processing image data...');
    const base64Data = body.image.split(',')[1];
    const mediaType = body.image.split(';')[0].split(':')[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    
    console.log('Image details:');
    console.log('- Media type:', mediaType);
    console.log('- Base64 length:', base64Data?.length);

    if (!base64Data) {
      console.error('Failed to extract base64 data from image');
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    // Make API call
    console.log('Making Anthropic API call...');
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and create a detailed AI art generation prompt. Focus on visual style, composition, colors, mood, and artistic elements. Return only the prompt text."
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data
              }
            }
          ]
        }
      ]
    });

    console.log('API response received');
    console.log('- Content array length:', response.content?.length);
    console.log('- First content type:', response.content?.[0]?.type);

    const promptText = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
    
    if (!promptText) {
      console.error('Empty prompt text from Claude');
      return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
    }

    console.log('Success! Prompt generated, length:', promptText.length);
    console.log('=== API END ===');
    
    return NextResponse.json({ promptText });

  } catch (error: any) {
    console.error('=== API ERROR ===');
    console.error('Error name:', error.constructor?.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Full error object:', error);
    console.error('Stack trace:', error.stack);
    console.error('=== END ERROR ===');
    
    return NextResponse.json({ 
      error: "Failed to analyze image", 
      details: error.message,
      type: error.constructor?.name 
    }, { status: 500 });
  }
}