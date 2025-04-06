import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Blog from './components/Blog';
import './index.css';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;