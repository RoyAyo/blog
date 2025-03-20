import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-900 min-h-screen p-4 font-mono text-green-400">
      <div className="max-w-3xl mx-auto bg-gray-800 border-2 border-green-400 rounded p-6 shadow-lg shadow-green-400/30">
        <header className="border-b border-green-400 pb-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            Roy::Terminal 
            <span className="ml-2 inline-block animate-pulse">_</span>
          </h1>
          <p className="text-sm">Roy Ayoola's backend engineering insights and tech musings</p>
        </header>
        
        <nav className="mb-8">
          <span className="text-yellow-500 font-bold">roy@terminal:~$</span> 
          <span className="text-blue-400">cd</span> 
          <Link to="/" className="text-blue-400 hover:underline mx-1">home</Link> | 
          <Link to="/posts" className="text-blue-400 hover:underline mx-1">all-posts</Link> | 
          <Link to="/about" className="text-blue-400 hover:underline mx-1">about</Link> | 
          <Link to="/projects" className="text-blue-400 hover:underline mx-1">projects</Link>
        </nav>
        
        <main>
          {children}
        </main>
        
        <footer className="mt-8 pt-4 border-t border-green-400 text-center text-xs">
          <p>[EOF] &copy; {new Date().getFullYear()} Roy Ayoola | 
            <Link to="/rss" className="text-blue-400 hover:underline mx-1">rss</Link> | 
            <a href="https://github.com/yourusername" className="text-blue-400 hover:underline mx-1" target="_blank" rel="noopener noreferrer">github</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;