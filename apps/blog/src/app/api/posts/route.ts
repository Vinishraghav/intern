import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get('authorId')
    
    let posts
    
    if (authorId) {
      // Get posts by specific author
      posts = await sql`
        SELECT id, title, slug, excerpt, content, cover_image, published, created_at, author_id
        FROM posts
        WHERE author_id = ${Number(authorId)}
        ORDER BY created_at DESC
        LIMIT 20
      `
    } else {
      // Get all published posts
      posts = await sql`
        SELECT id, title, slug, excerpt, content, cover_image, published, created_at, author_id
        FROM posts
        WHERE published = true
        ORDER BY created_at DESC
        LIMIT 20
      `
    }
    
    // Get categories for each post
    const postsWithCats = await Promise.all(
      posts.map(async (post: any) => {
        const cats = await sql`
          SELECT c.id, c.name, c.slug
          FROM post_categories pc
          JOIN categories c ON pc.category_id = c.id
          WHERE pc.post_id = ${post.id}
        `
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.cover_image,
          published: post.published,
          authorId: post.author_id,
          createdAt: post.created_at,
          categories: cats,
        }
      })
    )
    
    return NextResponse.json({
      posts: postsWithCats,
      pagination: { total: posts.length, page: 1, limit: 20, totalPages: 1 },
    })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const userId = cookies().get('user_id')?.value
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' }, 
        { status: 400 }
      )
    }

    // Verify post ownership
    const [post] = await sql`
      SELECT author_id FROM posts WHERE id = ${Number(id)}
    `

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' }, 
        { status: 404 }
      )
    }

    if (post.author_id !== Number(userId)) {
      return NextResponse.json(
        { error: 'Not authorized to delete this post' }, 
        { status: 403 }
      )
    }

    await sql`DELETE FROM posts WHERE id = ${Number(id)}`
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const userId = cookies().get('user_id')?.value
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
    
    // Parse JSON body
    let data
    try {
      data = await request.json()
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON' }, 
        { status: 400 }
      )
    }
    
    // Validate required fields
    if (!data.title || data.title.length < 3) {
      return NextResponse.json(
        { error: 'Title must be at least 3 characters' }, 
        { status: 400 }
      )
    }
    
    if (!data.content || data.content.length < 10) {
      return NextResponse.json(
        { error: 'Content must be at least 10 characters' }, 
        { status: 400 }
      )
    }
    
    // Generate unique slug
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const slug = `${baseSlug}-${Date.now()}`
    
    // Insert post with author
    const [newPost] = await sql`
      INSERT INTO posts (
        title, 
        content, 
        excerpt, 
        slug, 
        cover_image, 
        published,
        author_id,
        published_at,
        created_at,
        updated_at
      )
      VALUES (
        ${data.title},
        ${data.content},
        ${data.excerpt || data.content.substring(0, 150)},
        ${slug},
        ${data.coverImage || null},
        ${data.published !== false}, // Default to true if not specified
        ${Number(userId)},
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING *
    `
    
    console.log('✅ Post created:', newPost.id)
    
    // Link categories if provided
    if (data.categoryIds && Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
      console.log('Linking categories:', data.categoryIds)
      
      for (const categoryId of data.categoryIds) {
        try {
          await sql`
            INSERT INTO post_categories (post_id, category_id)
            VALUES (${newPost.id}, ${Number(categoryId)})
          `
        } catch (err) {
          console.error(`Failed to link category ${categoryId}:`, err)
        }
      }
      
      console.log('✅ Categories linked')
    }
    
    // Return created post with proper format
    return NextResponse.json({
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      coverImage: newPost.cover_image,
      published: newPost.published,
      createdAt: newPost.created_at,
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ POST Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create post',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
