import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { Tab } from '@headlessui/react';

interface EditorProps {
  isNew: boolean;
}

interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  tags: string[];
}

const PostEditor: React.FC<EditorProps> = ({ isNew }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [post, setPost] = useState<PostData>({
    id: '',
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    published: false,
    tags: []
  });
  const [currentTag, setCurrentTag] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    if (!isNew && id) {
      fetchPost(id);
    }
  }, [isNew, id]);

  const fetchPost = async (postId: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for editing
      const mockPost: PostData = {
        id: postId,
        title: 'Styling with Tailwind CSS',
        content: `# Styling with Tailwind CSS
            A complete guide to using Tailwind CSS in your projects.

            ## Getting Started

            First, install Tailwind CSS:

            \`\`\`bash
            npm install tailwindcss
            \`\`\`

            ## Basic Usage

            Tailwind provides utility classes that you can use directly in your HTML:

            \`\`\`html
            <div class="bg-blue-500 text-white p-4 rounded">
            This is a styled div using Tailwind!
            </div>
            \`\`\`

            ![Example Tailwind UI](https://placeholder.co/600x400)

            ## Customization

            You can customize Tailwind by modifying the \`tailwind.config.js\` file.
            `,
        excerpt: 'Learn how to efficiently style your applications with Tailwind CSS...',
        slug: 'styling-with-tailwind-css',
        published: true,
        tags: ['tailwind', 'css', 'styling']
      };
      
      setPost(mockPost);
    } catch (err) {
      console.error('Error fetching post:', err);
      alert('Failed to load post. Redirecting to posts list.');
      navigate('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPost(prev => ({ ...prev, [name]: checked }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!post.tags.includes(currentTag.trim())) {
        setPost(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Auto-generate slug if empty
      const postToSave = { ...post };
      if (!postToSave.slug) {
        postToSave.slug = postToSave.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If this is a new post, we'd get back an ID from the API
      if (isNew) {
        postToSave.id = Math.random().toString(36).substr(2, 9);
      }
      
      // Success!
      alert(`Post ${isNew ? 'created' : 'updated'} successfully!`);
      navigate('/admin/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadingImage(true);
    
    try {
      // In a real app, this would upload to your server or a storage service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock a successful upload with a placeholder URL
      const imageUrl = `/api/placeholder/800/600`;
      
      // Insert the image Markdown at the cursor position or at the end
      const textarea = document.getElementById('content') as HTMLTextAreaElement;
      const imageMarkdown = `![${file.name}](${imageUrl})`;
      
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const textBefore = post.content.substring(0, cursorPos);
        const textAfter = post.content.substring(cursorPos);
        
        setPost(prev => ({
          ...prev,
          content: textBefore + '\n\n' + imageMarkdown + '\n\n' + textAfter
        }));
      } else {
        // Fallback if we can't get the cursor position
        setPost(prev => ({
          ...prev,
          content: prev.content + '\n\n' + imageMarkdown + '\n\n'
        }));
      }
      
      // Clear the file input
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Simple markdown rendering (in a real app, you'd use a proper markdown library)
  const renderMarkdown = (markdown: string) => {
    // This is a very basic implementation - you would use a proper Markdown library in production
    const html = markdown
      // Convert headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Convert bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Convert italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Convert links
      .replace(/\[(.*)]\((.*)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>')
      // Convert images
      .replace(/!\[(.*?)]\((.*?)\)/gim, '<img src="$2" alt="$1" class="my-4 max-w-full h-auto rounded" />')
      // Convert code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 p-4 rounded my-4 overflow-x-auto"><code>$1</code></pre>')
      // Convert inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-800 px-2 py-1 rounded text-sm">$1</code>')
      // Convert paragraphs
      .replace(/^\s*(\n)?(.+)/gim, function(m) {
        return /<(\/)?(h1|h2|h3|pre|code|ul|ol|li|blockquote|img)/.test(m) ? m : '<p class="my-4">' + m + '</p>';
      })
      // Convert line breaks
      .replace(/\n/gim, '<br />');
      
    return { __html: html };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-400">
          {isNew ? 'Create New Post' : 'Edit Post'}
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter post title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={post.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter URL slug (leave empty to auto-generate)"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={post.excerpt}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description for previews and SEO"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                Content (Markdown)
              </label>
              <div className="flex space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <span className="mr-2 text-sm text-gray-300">Preview</span>
                  <input 
                    type="checkbox" 
                    checked={previewMode}
                    onChange={() => setPreviewMode(!previewMode)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md cursor-pointer inline-block ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
              </div>
            </div>

            {previewMode ? (
              <div 
                className="w-full min-h-64 px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white overflow-y-auto prose prose-invert prose-purple max-w-none"
                style={{ height: '400px' }}
                dangerouslySetInnerHTML={renderMarkdown(post.content)}
              />
            ) : (
              <textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your post content in Markdown..."
              />
            )}
            <div className="text-xs text-gray-400 mt-1">
              Supports Markdown: # Headers, **bold**, *italics*, `code`, ```codeblocks```, ![images](url), [links](url)
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-300 hover:text-white"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add a tag and press Enter"
            />
          </div>

          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={post.published}
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">Published</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              {post.published 
                ? 'This post is visible to the public' 
                : 'This post is currently a draft and not visible to the public'}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;