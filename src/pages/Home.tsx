/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Post } from '../utils/types.ts';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bootSequence, setBootSequence] = useState<boolean>(true);
  const [currentLine, setCurrentLine] = useState<number>(0);
  
  const bootLines = [
    "Initializing system...",
    "Mounting filesystems...",
    "Checking blog database...",
    "Setting up environment...",
  ];

  useEffect(() => {
    // Simulate boot sequence
    if (bootSequence) {
      const bootTimer = setTimeout(() => {
        if (currentLine < bootLines.length - 1) {
          setCurrentLine(prev => prev + 1);
        } else {
          setBootSequence(false);
        }
      }, 400);
      
      return () => clearTimeout(bootTimer);
    }
    
    // Fetch posts after boot sequence
    if (!bootSequence && loading) {
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
    }
  }, [bootLines.length, bootSequence, currentLine, loading]);

  const fetchLatestPosts = async (): Promise<Post[]> => {
    return new Promise(resolve => {
      setTimeout(async () => {
        try {
          const postModules = import.meta.glob('../blog/**/*.mdx', { eager: true });
          
          const posts: Post[] = [];
          
          for (const [path, module] of Object.entries(postModules)) {
            try {
              const mod = module as { default: unknown; frontmatter?: Record<string, any> };
              
              let frontmatter = mod.frontmatter;
              
              if (!frontmatter && 'attributes' in (mod as any)) {
                frontmatter = (mod as any).attributes;
              }
              
              if (!frontmatter) {
                console.log('Module structure:', mod);
                frontmatter = {};
              }
              
              const slug = path.split('/').pop()?.replace(/\.mdx$/, '') || '';
              
              const excerpt = frontmatter.description || 'Click to read more about this post...';
              
              posts.push({
                id: slug,
                slug,
                title: frontmatter.title || 'Untitled Post',
                excerpt,
                publishedAt: frontmatter.publishedAt || new Date().toISOString(),
                tags: frontmatter.tags || [],
                content: ''
              });
            } catch (importError) {
              console.error(`Error processing ${path}:`, importError);
            }
          }

          const sortedPosts = posts
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .slice(0, 5);

          resolve(sortedPosts);
        } catch (error) {
          console.error("Error fetching latest posts:", error);
          throw error;
        }
      }, 1000);
    });
  };

  return (
    <Layout>
      {bootSequence ? (
        <div className="boot-sequence">
          {bootLines.slice(0, currentLine + 1).map((line, index) => (
            <div key={index} className="boot-line">
              <span className="command-prompt">&gt;</span> {line}
              {index === currentLine && <span className="blink">_</span>}
            </div>
          ))}
        </div>
      ) : (
        <>
          <section className="system-info mb-8">
            <h2 className="text-sm mb-2">
              <span className="command-prompt">roy@terminal:~$</span> 
              <span className="command"> whoami</span>
            </h2>
            <div className="terminal-response text-sm">
              <p>Software Engineer | chef  </p>
              <p className='text-sm'>Trying to make sense of the world...</p>
            </div>
          </section>

          <section>
            <h2 className="text-sm mb-4">
              <span className="command-prompt">roy@terminal:~$</span> 
              <span className="command"> cat recent_posts.log</span>
            </h2>
            
            {loading && (
              <div className="loading">
                Loading posts...
              </div>
            )}
            
            {error && <div className="error">{error}</div>}

            {!loading && !error && posts.length > 0 ? (
              <div className="posts-container">
                {posts.map((post, index) => (
                  <article 
                    className="post-preview" 
                    key={post.id} 
                    style={{ '--index': index } as React.CSSProperties}
                  >
                    <Link 
                      to={`/posts/${post.slug}`} 
                      className="post-link" 
                      aria-label={`Read ${post.title}`}
                    />
                    
                    <h3 className="text-xl mb-2">
                      <span className="command-prompt">$</span> {post.title}
                    </h3>
                    <p className="date">{new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</p>
                    <div className="tags-container mb-3">
                      {post.tags.map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                    <p className="excerpt mb-2">{post.excerpt}</p>
                    <Link to={`/posts/${post.slug}`} className="read-more">
                      Read full post
                    </Link>
                  </article>
                ))}
              </div>
            ) : !loading && !error ? (
              <p className="empty-state">No posts available yet.</p>
            ) : null}
          </section>
        </>
      )}
    </Layout>
  );
};

export default HomePage;