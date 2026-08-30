import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    if (!content || content.length > 500) {
      return NextResponse.json(
        { error: '内容が無効です（最大500文字）' },
        { status: 400 }
      )
    }
    const post = { id: Date.now().toString(), content: content.trim(), createdAt: new Date().toISOString() }
    await kv.lpush('posts', JSON.stringify(post))
    await kv.ltrim('posts', 0, 999)
    return NextResponse.json({ success: true, post })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'サーバー エラー' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const raw = await kv.lrange('posts', 0, 49)
    const posts = raw.map((p) => JSON.parse(p as string))
    return NextResponse.json(posts)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'データ取得失敗' }, { status: 500 })
  }
}

