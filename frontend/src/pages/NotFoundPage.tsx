import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Halaman Tidak Ditemukan</h2>
          <p className="not-found-message">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="not-found-link not-found-link--primary">
              <Home size={18} />
              Kembali ke Beranda
            </Link>
            <Link to="/search" className="not-found-link">
              <Search size={18} />
              Pencarian
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
