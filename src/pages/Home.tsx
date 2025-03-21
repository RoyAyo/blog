// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Post } from '../utils/types';
import { fetchLatestPosts } from '../utils/api';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const latestPosts = await fetchLatestPosts();
        setPosts(latestPosts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <Layout>
      <section className="mt-8">
        <h2 className="text-xl mb-2">
          <span className="text-yellow-500 font-bold">roy@terminal:~$</span> 
          <span className="text-blue-400">whoami</span>
        </h2>
        <p>Cook | Trying to make sense of the world...</p>
      </section>

      <section>
        {loading && (
          <p className="flex items-center">
            Loading posts...
            <span className="ml-2 inline-block animate-pulse">_</span>
          </p>
        )}
        
        {error && <p className="text-red-400">{error}</p>}
        
        {!loading && !error && posts.map((post) => (
          <article className="mb-8 pb-6 border-b border-green-400/40" key={post.id}>
            <h2 className="text-xl mb-2">
              <span className="text-yellow-500 font-bold">roy@terminal:~$</span> 
              <span className="text-blue-400">cat</span> posts/{post.slug}.md
            </h2>
            <p className="text-gray-400 text-sm mb-2">{new Date(post.publishedAt).toISOString().split('T')[0]}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span className="bg-gray-700 text-green-400 text-xs px-2 py-1 rounded" key={tag}>{tag}</span>
              ))}
            </div>
            <p className="mb-2">{post.excerpt}</p>
            <Link to={`/posts/${post.slug}`} className="text-blue-400 hover:underline italic">Read full post...</Link>
          </article>
        ))}
      </section>
    </Layout>
  );
};

export default HomePage;