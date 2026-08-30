'use client';

import { useEffect, useState } from 'react';

interface Post {
  id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  // 投稿取得（初回 + 3 秒ごとに自動更新）
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        console.error('取得失敗', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();

    const interval = setInterval(fetchPosts, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost }),
      });

      if (res.ok) {
        setNewPost('');
        // 新しい投稿がすぐに反映されるように再取得
        await fetch('/api/posts');
      } else {
        const err = await res.json();
        alert(err.error ?? '投稿に失敗しました');
      }
    } catch (err) {
      alert('ネットワーク エラー');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          匿名掲示板
        </h1>

        {/* 投稿フォーム */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 h-24 resize-none"
            placeholder="匿名で投稿してください（最大500文字）"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newPost.length}/500文字
            </span>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              投稿
            </button>
          </div>
        </form>

        {/* 投稿一覧 */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">読み込み中…</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(post.createdAt).toLocaleString('ja-JP')}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
