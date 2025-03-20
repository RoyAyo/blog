import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Post } from '../utils/types';
import { fetchPostBySlug } from '../utils/api';
import ReactMarkdown from 'react-markdown';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        const fetchedPost = await fetchPostBySlug(slug);
        setPost(fetchedPost);
        setLoading(false);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return (
    <Layout>
      {loading && (
        <p className="flex items-center">
          Loading post...
          <span className="ml-2 inline-block animate-pulse">_</span>
        </p>
      )}
      
      {error && <p className="text-red-400">{error}</p>}
      
      {!loading && !error && post && (
        <article>
          <h1 className="text-2xl mb-2">
            <span className="text-yellow-500 font-bold">roy@terminal:~$</span> 
            <span className="text-blue-400">cat</span> posts/{post.slug}.md
          </h1>
          <p className="text-gray-400 text-sm mb-2">{new Date(post.publishedAt).toISOString().split('T')[0]}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span className="bg-gray-700 text-green-400 text-xs px-2 py-1 rounded" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="prose prose-invert prose-green max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      )}
    </Layout>
  );
};

export default PostPage;