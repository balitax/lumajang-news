import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Share2, Clock } from 'lucide-react';
import { getArticleDetail } from '../services/api';
import type { ArticleDetail } from '../types/news';
import NewsCard from '../components/NewsCard';
import Skeleton from '../components/Skeleton';
import './ArticlePage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/api/') || url.startsWith('data:')) return url;
  return `${API_BASE_URL}/image?url=${encodeURIComponent(url)}`;
};

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await getArticleDetail(slug!);
        setArticle(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch article', err);
        setError('Gagal memuat artikel. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.contentText.slice(0, 100) + '...',
          url: window.location.href
        });
      } catch {
        // Share cancelled
      }
    }
  };

  if (error) {
    return (
      <div className="article-page">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="article-page">
        <div className="container">
          <div className="article-page__layout">
            <main className="article-page__main">
              <Skeleton variant="card" count={1} />
              <div style={{ marginTop: '2rem' }}>
                <Skeleton variant="text" count={8} />
              </div>
            </main>
            <aside className="article-sidebar">
              <div className="ads-widget">
                <div className="ads-placeholder"><span>Iklan</span></div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-page">
        <div className="container">
          <div className="error-message">
            <p>Artikel tidak ditemukan.</p>
            <Link to="/" className="back-link">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="container">
        <div className="article-page__layout">
          <main className="article-page__main">
            <article className="article">
              <header className="article__header">
                <Link to="/" className="article__back">
                  <ArrowLeft size={20} />
                  Kembali
                </Link>
                
                {article.tags.length > 0 && (
                  <div className="article__tags">
                    {article.tags.map((tag, i) => (
                      <Link key={i} to={`/search?q=${encodeURIComponent(tag.name)}`} className="article__tag">
                        <Tag size={12} />
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="article__title">{article.title}</h1>

                <div className="article__meta">
                  <span className="article__meta-item">
                    <User size={16} />
                    {article.author}
                  </span>
                  <span className="article__meta-item">
                    <Calendar size={16} />
                    {formatDate(article.isoDate)}
                  </span>
                  <button className="article__share" onClick={handleShare}>
                    <Share2 size={16} />
                    Bagikan
                  </button>
                </div>

                {article.featuredImage && (
                  <div className="article__featured-image">
                    <img src={getImageUrl(article.featuredImage)} alt={article.title} />
                  </div>
                )}
              </header>

              <div 
                className="article__content"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />

              {article.images.length > 0 && (
                <div className="article__gallery">
                  <h3>Galeri</h3>
                  <div className="article__gallery-grid">
                    {article.images.map((img, i) => (
                      <img key={i} src={getImageUrl(img)} alt={`Gallery ${i + 1}`} loading="lazy" />
                    ))}
                  </div>
                </div>
              )}
            </article>
          </main>

          <aside className="article-sidebar">
            <div className="ads-widget ads-widget--vertical">
              <div className="ads-placeholder">
                <span>Iklan</span>
              </div>
            </div>

            {article.relatedNews.length > 0 && (
              <section className="sidebar-section">
                <h3 className="sidebar-section__title">
                  <Clock size={18} />
                  Berita Terkait
                </h3>
                <div className="related-news-list">
                  {article.relatedNews.map((news, i) => (
                    <NewsCard 
                      key={i} 
                      news={{
                        title: news.title,
                        slug: news.url.split('/').pop() || '',
                        link: `/article/${news.url.split('/').pop()}`,
                        thumbnail: news.thumbnail,
                        date: news.date,
                        isoDate: news.date,
                        excerpt: '',
                        category: '',
                        categoryUrl: ''
                      }} 
                      variant="compact"
                    />
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
