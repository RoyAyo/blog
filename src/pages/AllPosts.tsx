import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Post } from '../utils/types';

const AllPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <Layout>
      <h1 className="text-2xl mb-6">
        <span className="text-yellow-500 font-bold">roy@terminal:~$</span> 
        <span className="text-blue-400">ls -la</span> ./posts/
      </h1>
      
      {loading && (
        <p className="flex items-center">
          Loading posts...
          <span className="ml-2 inline-block animate-pulse">_</span>
        </p>
      )}
      
      {error && <p className="text-red-400">{error}</p>}
      
      {!loading && !error && (
        <div className="border border-green-400/30 rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-green-400/30 hover:bg-gray-700/50">
                  <td className="py-2 px-4 text-gray-400">{new Date(post.publishedAt).toISOString().split('T')[0]}</td>
                  <td className="py-2 px-4">
                    <Link to={`/posts/${post.slug}`} className="text-blue-400 hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span className="bg-gray-700 text-green-400 text-xs px-2 py-1 rounded" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AllPostsPage;