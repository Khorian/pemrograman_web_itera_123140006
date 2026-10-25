import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import './App.css';

function App() {
  return (
    <BookProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="brand">
              <h1>📚 Manajemen Buku Pribadi</h1>
              <span>Khorian Mukhsin - 123140006</span>
            </div>
            <nav className="app-nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Beranda
              </NavLink>
              <NavLink
                to="/stats"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Statistik
              </NavLink>
            </nav>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BookProvider>
  );
}

export default App;