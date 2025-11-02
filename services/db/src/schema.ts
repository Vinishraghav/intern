import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@workspace/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('📝 Fetching posts with raw SQL...')
    
    // Raw SQL - bypasses all Drizzle schema issues
    const result = await db.execute(sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.cover_image,
        p.published,
        p.created_at
      FROM posts p
      WHERE p.published = true
      ORDER BY p.created_at DESC
      LIMIT 20
    `)
    
    const postsData = result.rows as any[]
    
    console.log(`✅ Found ${postsData.length} posts`)
    
    // Get categories for each post
    const postsWithCategories = await Promise.all(
      postsData.map(async (post) => {
        try {
          const catResult = await db.execute(sql`
            SELECT 
              c.id,
              c.name,
              c.slug
            FROM post_categories pc
            INNER JOIN categories c ON pc.category_id = c.id
            WHERE pc.post_id = ${post.id}
          `)
          
          return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.cover_image,
            published: post.published,
            createdAt: post.created_at,
            categories: catResult.rows || [],
          }
        } catch (err) {
          console.error(`Error fetching categories for post ${post.id}:`, err)
          return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.cover_image,
            published: post.published,
            createdAt: post.created_at,
            categories: [],
          }
        }
      })
    )
    
    return NextResponse.json({
      posts: postsWithCategories,
      pagination: {
        total: postsData.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    })
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('📝 Creating post:', data)
    
    if (!data.title || data.title.length < 3) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 })
    }
    
    if (!data.content || data.content.length < 10) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 })
    }
    
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()
    
    // Insert post with raw SQL
    const result = await db.execute(sql`
      INSERT INTO posts (title, content, excerpt, slug, cover_image, published)
      VALUES (
        ${data.title},
        ${data.content},
        ${data.excerpt || data.content.substring(0, 150)},
        ${slug},
        ${data.coverImage || null},
        true
      )
      RETURNING *
    `)
    
    const newPost = result.rows[0] as any
    console.log('✅ Post created:', newPost.id)
    
    // Link categories
    if (data.categoryIds && data.categoryIds.length > 0) {
      for (const catId of data.categoryIds) {
        await db.execute(sql`
          INSERT INTO post_categories (post_id, category_id)
          VALUES (${newPost.id}, ${catId})
        `)
      }
      console.log('✅ Categories linked')
    }
    
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('❌ Failed to create post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
