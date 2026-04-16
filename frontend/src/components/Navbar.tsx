import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { getCategories } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { Category } from '../types/news';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
    setIsMegaMenuOpen(false);
    setIsMenuOpen(false);
  };

  const visibleCategories = categories.slice(0, 5);
  const hiddenCategories = categories.slice(5);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          LUMAJANG<span>NEWS</span>
        </Link>

        <div className="nav-menu">
          {visibleCategories.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/category/${cat.slug}`}
              className="nav-link"
            >
              {cat.name}
            </Link>
          ))}

          {hiddenCategories.length > 0 && (
            <div className="nav-dropdown" ref={megaMenuRef}>
              <button 
                className="nav-dropdown__trigger"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                Lainnya <ChevronDown size={16} />
              </button>
              
              {isMegaMenuOpen && (
                <div className="nav-mega-menu">
                  <div className="nav-mega-menu__header">
                    <span>Semua Kategori</span>
                  </div>
                  <div className="nav-mega-menu__grid">
                    {hiddenCategories.map((cat) => (
                      <button
                        key={cat.slug}
                        className="nav-mega-menu__item"
                        onClick={() => handleCategoryClick(cat.slug)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Cari berita..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit"><Search size={18} /></button>
        </form>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

        <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__header">
          <span className="mobile-menu__logo">LUMAJANG<span>NEWS</span></span>
          <div className="mobile-menu__header-actions">
            <button className="mobile-theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="mobile-menu__close" onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="mobile-menu__search">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Cari berita..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><Search size={20} /></button>
          </form>
        </div>

        <div className="mobile-menu__links">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/category/${cat.slug}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
