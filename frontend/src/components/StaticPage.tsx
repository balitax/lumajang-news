import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './StaticPage.css';

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, children }) => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page__layout">
          <main className="static-page__main">
            <div className="static-page__card">
              <Link to="/" className="static-page__back">
                <ArrowLeft size={20} />
                Kembali
              </Link>
              <h1 className="static-page__title">{title}</h1>
              <div className="static-page__content">
                {children}
              </div>
            </div>
          </main>
          <aside className="static-page__sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-section__title">Tentang Kami</h3>
              <ul className="sidebar-links">
                <li><Link to="/profil">Profil</Link></li>
                <li><Link to="/redaksi">Redaksi</Link></li>
                <li><Link to="/pedoman-media">Pedoman Media</Link></li>
                <li><Link to="/kontak">Kontak</Link></li>
                <li><Link to="/disclaimer">Disclaimer</Link></li>
              </ul>
            </div>
            <div className="ads-widget ads-widget--vertical">
              <div className="ads-placeholder">
                <span>Iklan</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
