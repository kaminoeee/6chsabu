import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// -------------------------------------------------
// POST : 新しい投稿を作成
// -------------------------------------------------
export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    // バリデーション（最大 500 文字）
    if (!content || content.length > 500) {
      return NextResponse.json(
        { error: '内容が無効です（最大500文字）' },
        { status: 400 }
      );
    }

    const post = {
      id: Date.now().toString(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // KV のリストに追加（新しい順）と、古いものは削除（最新 1000 件保持）
    await kv.lpush('posts', JSON.stringify(post));
    await kv.ltrim('posts', 0, 999);

    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'サーバー エラー' }, { status: 500 });
  }
}

// -------------------------------------------------
// GET : 投稿一覧取得（最新 50 件）
// -------------------------------------------------
export async function GET() {
  try {
    const raw = await kv.lrange('posts', 0, 49); // 0-indexed, 50 件取得
    const posts = raw.map((p) => JSON.parse(p as string));
    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'データ取得失敗' }, { status: 500 });
  }
}
