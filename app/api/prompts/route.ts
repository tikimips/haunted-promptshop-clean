import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_email', session.user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
    }
    
    return NextResponse.json({ prompts: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { prompt } = await req.json()
    
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        id: prompt.id,
        user_email: session.user.email,
        image_url: prompt.imageUrl,
        prompt_text: prompt.promptText,
        is_favorite: prompt.isFavorite,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 })
    }

    // Return updated prompts list
    const { data: allPrompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_email', session.user.email)
      .order('created_at', { ascending: false })
    
    return NextResponse.json({ success: true, prompts: allPrompts || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { promptId, updates } = await req.json()
    
    const { data, error } = await supabase
      .from('prompts')
      .update({
        is_favorite: updates.isFavorite
      })
      .eq('id', promptId)
      .eq('user_email', session.user.email)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 })
    }

    // Return updated prompts list
    const { data: allPrompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_email', session.user.email)
      .order('created_at', { ascending: false })
    
    return NextResponse.json({ success: true, prompts: allPrompts || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 })
  }
}