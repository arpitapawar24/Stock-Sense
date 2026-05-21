import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    toast.info(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-icon">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="2,14 6,9 10,11 14,5 18,7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <polyline points="14,5 18,5 18,9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          StockSense
        </Link>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/prediction" className={({ isActive }) => isActive ? 'active' : ''}>
              Predict
            </NavLink>
          </li>
          <li>
            <Link to="/#products">Products</Link>
          </li>
          <li>
            <Link to="/#pricing">Pricing</Link>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
              About
            </NavLink>
          </li>
          
          {user ? (
            <>
              <li style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-900)', marginLeft: '12px' }}>
                Hi, {user.name}
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                  Settings
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log In</Link>
              </li>
              <li>
                <Link to="/register" className="btn-signup">Sign Up</Link>
              </li>
            </>
          )}

          {/* Theme Toggle Button */}
          <li>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn" 
              aria-label="Toggle theme"
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-500)',
                padding: '6px',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" fill="currentColor"/>
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </li>
        </ul>
        
        <button 
          className="nav-hamburger" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle menu"
        >
          <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: isOpen ? 0 : 1 }}></span>
          <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
      </nav>

      {/* Mobile nav menu */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        <Link to="/prediction" onClick={() => setIsOpen(false)}>Predict</Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
        {user ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Settings</Link>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="btn-signup-mobile">
              Logout ({user.name})
            </a>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
            <Link to="/register" className="btn-signup-mobile" onClick={() => setIsOpen(false)}>Sign Up →</Link>
          </>
        )}
        
        {/* Mobile Theme Toggle */}
        <button 
          onClick={() => { toggleTheme(); setIsOpen(false); }} 
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--text-700)',
            padding: '14px',
            fontSize: '14px',
            fontWeight: '600',
            width: '100%',
            borderTop: '1px solid var(--border)',
            marginTop: '10px'
          }}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </>
  );
};

export default Navbar;
