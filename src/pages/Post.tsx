/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Post } from '../utils/types.ts';
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
        console.error("Error loading post:", err);
        setError('Failed to load post. Please try again later.');
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const fetchPostBySlug = async (postSlug: string): Promise<Post> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const postModules = import.meta.glob('../blog/**/*.mdx', { eager: true });
        
        const matchingPath = Object.keys(postModules).find(path => {
          const filename = path.split('/').pop() || '';
          const fileSlug = filename.replace(/\.mdx$/, '');
          return fileSlug === postSlug;
        });

        if (!matchingPath) {
          throw new Error(`Post with slug "${postSlug}" not found`);
        }

        // Get the module content
        const module = postModules[matchingPath] as any;
        console.log('Found module:', module);
        
        // Try different ways to access frontmatter based on common MDX configurations
        let frontmatter = module.frontmatter;
        
        // If frontmatter is not directly accessible, check other common locations
        if (!frontmatter && 'attributes' in module) {
          frontmatter = module.attributes;
        }
        
        if (!frontmatter) {
          console.warn('Frontmatter not found in module, using empty object');
          frontmatter = {};
        }
        
        // For raw content extraction, try different approaches
        let content = '';
        
        // Try to get raw content if available
        if (module.rawContent) {
          content = module.rawContent;
        } else if (module.default) {
          try {
            // For MDX bundlers that provide a React component
            // Let's try to get the raw content using ?raw import
            const rawModule = await import(`../blog/${postSlug}.mdx?raw`).catch(() => null);
            
            if (rawModule) {
              content = rawModule.default;
              // Remove frontmatter from content
              content = content.replace(/---[\s\S]*?---/, '').trim();
            } else {
              // Fallback to reading the module structure
              console.log('Could not import raw content, using default component');
              content = "**Note: Using component render mode. Raw markdown content couldn't be extracted.**";
            }
          } catch (err) {
            console.error('Error getting raw content:', err);
            content = "**Content loading issue. Please try again later.**";
          }
        } else {
          // Last resort: try to extract content from module
          content = "**Content unavailable or in an unsupported format.**";
        }
        
        // Try to load content from a text file with the same name if MDX fails
        if (!content || content.includes("**Note: Using component render mode") || content.includes("**Content loading issue")) {
          try {
            const textModule = await import(`../blog/${postSlug}.md?raw`).catch(() => null);
            if (textModule) {
              content = textModule.default;
              // Remove frontmatter
              content = content.replace(/---[\s\S]*?---/, '').trim();
            }
          } catch (txtErr) {
            console.log('No text version available', txtErr);
          }
        }

        resolve({
          id: postSlug,
          slug: postSlug,
          title: frontmatter.title || 'Untitled Post',
          publishedAt: frontmatter.publishedAt || new Date().toISOString(),
          excerpt: frontmatter.description || 'No description available',
          content: content,
          tags: frontmatter.tags || []
        });
      } catch (error) {
        console.error(`Error fetching post with slug "${postSlug}":`, error);
        reject(error);
      }
    });
  };

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
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            {post.title}
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            {new Date(post.publishedAt).toISOString().split('T')[0]}
          </p>
          <hr className="border-gray-700 my-4" />
          
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