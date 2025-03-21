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
    "Loading kernel modules...",
    "Mounting filesystems...",
    "Starting network services...",
    "Checking blog database...",
    "Setting up environment...",
    "Launching terminal interface..."
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

  // Function to fetch latest posts from MDX files
  const fetchLatestPosts = async (): Promise<Post[]> => {
    return new Promise(resolve => {
      // Simulate network delay
      setTimeout(async () => {
        try {
          // Using Vite's glob import to get all MDX files
          const postModules = import.meta.glob('../blog/**/*.mdx', { eager: true });
          
          const posts: Post[] = [];
          
          for (const [path, module] of Object.entries(postModules)) {
            try {
              // The structure of the module might vary based on your MDX setup
              // Using type assertion to access the potential frontmatter property
              const mod = module as { default: unknown; frontmatter?: Record<string, any> };
              
              // Try different ways to access frontmatter based on common MDX configurations
              let frontmatter = mod.frontmatter;
              
              // If frontmatter is not directly accessible, it might be in a different location
              if (!frontmatter && 'attributes' in (mod as any)) {
                frontmatter = (mod as any).attributes;
              }
              
              // If frontmatter still can't be found, log the module structure for debugging
              if (!frontmatter) {
                console.log('Module structure:', mod);
                // Use default values
                frontmatter = {};
              }
              
              // Extract slug from file path
              const slug = path.split('/').pop()?.replace(/\.mdx$/, '') || '';
              
              // Use description as excerpt if available, otherwise use a default
              const excerpt = frontmatter.description || 'Click to read more about this post...';
              
              posts.push({
                id: slug,
                slug,
                title: frontmatter.title || 'Untitled Post',
                excerpt,
                publishedAt: frontmatter.publishedAt || new Date().toISOString(),
                tags: frontmatter.tags || [],
                content: '' // Not needed for the homepage
              });
            } catch (importError) {
              console.error(`Error processing ${path}:`, importError);
            }
          }

          // Sort posts by date (newest first) and take the top 5
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
            <h2 className="text-xl mb-2">
              <span className="command-prompt">roy@terminal:~$</span> 
              <span className="command"> whoami</span>
            </h2>
            <div className="terminal-response">
              <p>Engineer | Writer | Explorer | Trying to make sense of the world...</p>
              <p>Welcome to my digital outpost. Type <span className="command">help</span> for available commands.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">
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
                {posts.map((post) => (
                  <article className="post-preview" key={post.id}>
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