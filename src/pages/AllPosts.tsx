/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Post } from '../utils/types';

const POSTS_PER_PAGE = 6;

type FilterLogic = 'ANY' | 'ALL';

const AllPostsPage: React.FC = () => {
  // Post and filtering state
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tag filtering state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filterLogic, setFilterLogic] = useState<FilterLogic>('ANY');
  
  // Categories state
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Using eager loading to immediately access the module content
        const postModules = import.meta.glob('../blog/**/*.mdx', { eager: true });
        const postData: Post[] = [];
        const tagsSet = new Set<string>();
        const categoriesSet = new Set<string>();
        
        console.log('Found modules:', Object.keys(postModules).length);
        
        // Process each module
        for (const [path, module] of Object.entries(postModules)) {
          try {
            // Type assertion for the module
            const mod = module as any;
            console.log(`Processing module at path: ${path}`);
            console.log('Module structure:', mod);
            
            // Try different methods to extract frontmatter based on common MDX configurations
            let frontmatter: any = null;
            
            if (mod.frontmatter) {
              frontmatter = mod.frontmatter;
            } 

            else if (mod.attributes) {
              frontmatter = mod.attributes;
            } 

            else if (mod.metadata) {
              frontmatter = mod.metadata;
            }

            else if (mod.default && typeof mod.default === 'object' && mod.default.metadata) {
              frontmatter = mod.default.metadata;
              console.log('Found frontmatter via .default.metadata property');
            }
            else if (mod.default && typeof mod.default === 'string' && mod.default.startsWith('---')) {
              try {
                const content = mod.default as string;
                const fmMatch = content.match(/---\n([\s\S]*?)\n---/);
                if (fmMatch && fmMatch[1]) {
                  const fmLines = fmMatch[1].split('\n');
                  frontmatter = {};
                  fmLines.forEach(line => {
                    const [key, ...valueParts] = line.split(':');
                    if (key && valueParts.length) {
                      const value = valueParts.join(':').trim();
                      if (value.startsWith('[') && value.endsWith(']')) {
                        // Handle array values like tags
                        frontmatter[key.trim()] = value
                          .slice(1, -1)
                          .split(',')
                          .map(v => v.trim().replace(/"/g, '').replace(/'/g, ''));
                      } else {
                        frontmatter[key.trim()] = value.replace(/"/g, '').replace(/'/g, '');
                      }
                    }
                  });
                  console.log('Parsed frontmatter from raw content');
                }
              } catch (parseError) {
                console.error('Error parsing frontmatter from content:', parseError);
              }
            }
            
            // If frontmatter still can't be found, use default values
            if (!frontmatter) {
              console.warn('No frontmatter found for module, using defaults');
              frontmatter = {};
            }
            
            const slug = path.split('/').pop()?.replace(/\.mdx$/, '') || '';
            
            const tags = Array.isArray(frontmatter.tags) 
              ? frontmatter.tags 
              : (typeof frontmatter.tags === 'string' 
                ? [frontmatter.tags] 
                : []);
            
            tags.forEach((tag: string) => tagsSet.add(tag));
            
            const category = frontmatter.category || 'Uncategorized';
            categoriesSet.add(category);
            
            const post: Post = {
              id: slug,
              slug,
              title: frontmatter.title || slug || 'Untitled Post',
              publishedAt: frontmatter.publishedAt || frontmatter.date || new Date().toISOString(),
              excerpt: frontmatter.description || frontmatter.excerpt || 'No description available',
              category,
              tags,
              content: ''
            };
            
            postData.push(post);
          } catch (importError) {
            console.error(`Error processing ${path}:`, importError);
          }
        }

        const sortedPosts = postData.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        const sortedTags = Array.from(tagsSet).sort();
        const sortedCategories = Array.from(categoriesSet).sort();
        
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
        setAllTags(sortedTags);
        setCategories(sortedCategories);
        setLoading(false);
        
      } catch (err) {
        console.error("Failed to load blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];
    
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    if (selectedTags.length > 0) {
      if (filterLogic === 'ANY') {
        // ANY logic: post must have at least one of the selected tags
        result = result.filter(post => 
          selectedTags.some(tag => post.tags.includes(tag))
        );
      } else {
        result = result.filter(post => 
          selectedTags.every(tag => post.tags.includes(tag))
        );
      }
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPosts(result);
    setCurrentPage(1);
  }, [selectedTags, selectedCategory, filterLogic, searchQuery, posts]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    setTotalPages(totalPages || 1);
    
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    setDisplayedPosts(filteredPosts.slice(startIndex, endIndex));
  }, [filteredPosts, currentPage]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedCategory(null);
    setSearchQuery('');
    setFilterLogic('ANY');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-700 text-blue-400 hover:bg-gray-600'
          }`}
        >
          &lt; Prev
        </button>
        
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-700 text-blue-400 hover:bg-gray-600'
          }`}
        >
          Next &gt;
        </button>
      </div>
    );
  };

  // Stats for filtered posts
  const renderFilterStats = useMemo(() => {
    if (loading || posts.length === 0) return null;
    
    const isFiltered = selectedTags.length > 0 || selectedCategory || searchQuery;
    
    return (
      <div className="text-sm text-gray-400 mb-4">
        Showing {filteredPosts.length} of {posts.length} posts
        {isFiltered && (
          <button 
            onClick={clearFilters}
            className="ml-2 text-blue-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }, [filteredPosts.length, posts.length, selectedTags, selectedCategory, searchQuery, loading]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl mb-6">
          <span className="text-yellow-500 font-bold">roy@terminal:~$</span> 
          <span className="text-blue-400">find</span> ./posts/ -type f
        </h1>
        
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-green-400/30 rounded px-4 py-2 pl-10 focus:outline-none focus:border-green-400"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Categories filter */}
        <div className="mb-4">
          <h2 className="text-lg mb-2">Categories:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white font-medium'
                  : 'bg-gray-700 text-blue-400 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg">Filter by tags:</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Match:</span>
                <button
                  onClick={() => setFilterLogic('ANY')}
                  className={`px-2 py-1 text-xs rounded ${
                    filterLogic === 'ANY'
                      ? 'bg-green-500 text-black font-medium'
                      : 'bg-gray-700 text-green-400 hover:bg-gray-600'
                  }`}
                >
                  ANY tag
                </button>
                <button
                  onClick={() => setFilterLogic('ALL')}
                  className={`px-2 py-1 text-xs rounded ${
                    filterLogic === 'ALL'
                      ? 'bg-green-500 text-black font-medium'
                      : 'bg-gray-700 text-green-400 hover:bg-gray-600'
                  }`}
                >
                  ALL tags
                </button>
              </div>
              
              {selectedTags.length > 0 && (
                <button 
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Clear tags
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pb-2 max-h-40 overflow-y-auto">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-green-500 text-black font-medium'
                    : 'bg-gray-700 text-green-400 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {renderFilterStats}
      </div>
      
      {loading && (
        <p className="flex items-center">
          Loading posts...
          <span className="ml-2 inline-block animate-pulse">_</span>
        </p>
      )}
      
      {error && <p className="text-red-400">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="space-y-6">
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="border border-green-400/30 rounded p-4 hover:bg-gray-800/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link 
                      to={`/posts/${post.slug}`} 
                      className="text-xl text-blue-400 hover:underline font-medium"
                    >
                      {post.title}
                    </Link>
                    <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {post.category && (
                    <div className="mb-2">
                      <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                  )}
                  
                  {post.excerpt && (
                    <p className="text-gray-300 mb-3">{post.excerpt}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`text-xs px-2 py-1 rounded ${
                          selectedTags.includes(tag)
                            ? 'bg-green-500 text-black font-medium'
                            : 'bg-gray-700 text-green-400'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-6 border border-green-400/30 rounded">
                <p className="text-gray-400">No posts match the current filters</p>
                <button 
                  onClick={clearFilters}
                  className="text-blue-400 hover:underline mt-2"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
          {renderPagination()}
        </>
      )}
    </Layout>
  );
};

export default AllPostsPage;