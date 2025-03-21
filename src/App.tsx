import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';
// import About from './pages/About';
// import Projects from './pages/Projects';
import AllPosts from './pages/AllPosts';
import NotFound from './pages/NotFound';
import './styles/tailwind.css';
import LoginPage from './pages/auth/Login';
import AdminDashboard from './pages/admin/dashboard';
import ProtectedRoute from './utils/ProtectedRoutes';
import PostsList from './pages/admin/PostsList';
import { AuthProvider } from './utils/AuthContext';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
              </Routes>
              <ProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="posts" element={<PostsList />} />
                </Routes>
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;