import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    await sql`UPDATE posts SET published = true WHERE published = false`
    const result = await sql`SELECT COUNT(*) as count FROM posts WHERE published = true`
    
    return NextResponse.json({ 
      success: true, 
      message: `Published ${result.rows[0].count} posts` 
    })
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}
