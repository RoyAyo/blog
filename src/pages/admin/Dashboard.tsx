import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import PostsList from './PostsList';
// import PostEditor from './PostEditor';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path) ? 'bg-purple-800' : '';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-purple-400">Retro Blog Admin</h1>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link to="/admin/posts" className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 ${isActive('/posts')}`}>
              Posts
            </Link>
            <Link to="/admin/new" className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 ${isActive('/new')}`}>
              New Post
            </Link>
            <button 
              onClick={handleLogout}
              className="ml-4 px-3 py-1 rounded border border-purple-500 text-purple-400 hover:bg-purple-900 text-sm"
            >
              Logout
            </button>
          </nav>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 pb-3 px-4">
            <Link 
              to="/admin/posts" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700 ${isActive('/posts')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Posts
            </Link>
            <Link 
              to="/admin/new" 
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700 ${isActive('/new')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              New Post
            </Link>
            <button 
              onClick={handleLogout}
              className="mt-2 w-full px-3 py-2 rounded border border-purple-500 text-purple-400 hover:bg-purple-900 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/posts" element={<PostsList />} />
          {/* <Route path="/new" element={<PostEditor isNew={true} />} />
          <Route path="/edit/:id" element={<PostEditor isNew={false} />} /> */}
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-center text-gray-400 text-sm">
        <p>Retro Blog Admin © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;