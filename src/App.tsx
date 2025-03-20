import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';
// import About from './pages/About';
// import Projects from './pages/Projects';
import AllPosts from './pages/AllPosts';
import NotFound from './pages/NotFound';
import './styles/tailwind.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="/posts" element={<AllPosts />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/projects" element={<Projects />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;