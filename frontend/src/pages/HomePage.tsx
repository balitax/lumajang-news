import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Scale, Heart } from 'lucide-react';
import { getLatestNews, getCategories, getNewsByCategory } from '../services/api';
import type { NewsItem, Category } from '../types/news';
import NewsCard from '../components/NewsCard';
import HeadlineSection from '../components/HeadlineSection';
import CategorySection from '../components/CategorySection';
import Skeleton from '../components/Skeleton';
import './HomePage.css';

const CATEGORIES = [
  { slug: 'hukum-dan-kriminal', name: 'Hukum & Kriminal', icon: <Scale size={20} /> },
  { slug: 'peristiwa', name: 'Peristiwa', icon: <Heart size={20} /> },
];

const HomePage: React.FC = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryNews, setCategoryNews] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsRes, catRes] = await Promise.all([
          getLatestNews(),
          getCategories()
        ]);
        setLatestNews(newsRes.data);
        setCategories(catRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Gagal memuat berita. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      for (const cat of CATEGORIES) {
        setLoadingCategories(prev => ({ ...prev, [cat.slug]: true }));
        try {
          const res = await getNewsByCategory(cat.slug, 1);
          setCategoryNews(prev => ({ ...prev, [cat.slug]: res.data }));
        } catch (err) {
          console.error(`Failed to fetch ${cat.slug}`, err);
        } finally {
          setLoadingCategories(prev => ({ ...prev, [cat.slug]: false }));
        }
      }
    };
    fetchCategoryNews();
  }, []);

  const sortedNews = useMemo(() => {
    return [...latestNews].sort((a, b) => {
      const dateA = new Date(a.isoDate).getTime();
      const dateB = new Date(b.isoDate).getTime();
      return dateB - dateA;
    });
  }, [latestNews]);

  const headlineNews = sortedNews.slice(0, 5);
  const latestGridNews = sortedNews.slice(5, 11);
  const popularNews = latestNews.slice(11, 16);

  if (error) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero-section">
          {loading ? (
            <div className="headline-skeleton">
              <div className="headline-skeleton__main">
                <div className="headline-skeleton__carousel" />
                <div className="headline-skeleton__list">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="headline-skeleton__item">
                      <div className="headline-skeleton__thumb" />
                      <div className="headline-skeleton__content">
                        <div className="headline-skeleton__line headline-skeleton__line--short" />
                        <div className="headline-skeleton__line headline-skeleton__line--long" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="headline-skeleton__indicators">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="headline-skeleton__indicator" />
                ))}
              </div>
            </div>
          ) : headlineNews.length > 0 ? (
            <HeadlineSection key={headlineNews[0]?.slug} headlines={headlineNews} />
          ) : null}
        </section>

        <div className="main-layout">
          <main className="main-content">
            <section className="news-grid-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Clock size={24} />
                  Berita Terbaru
                </h2>
              </div>
              {loading ? (
                <Skeleton variant="card" count={6} />
              ) : latestGridNews.length > 0 ? (
                <div className="news-grid">
                  {latestGridNews.map((news) => (
                    <NewsCard key={news.slug} news={news} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Tidak ada berita terbaru.</p>
                </div>
              )}
            </section>

            <div className="ads-widget">
              <div className="ads-placeholder">
                <span>Advertisement</span>
              </div>
            </div>

            {CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.slug}
                title={cat.name}
                slug={cat.slug}
                icon={cat.icon}
                news={categoryNews[cat.slug] || []}
                loading={loadingCategories[cat.slug]}
              />
            ))}
          </main>

          <aside className="sidebar">
            <section className="sidebar-section">
              <h3 className="sidebar-section__title">Kategori</h3>
              <ul className="category-list">
                {loading ? (
                  <Skeleton variant="text" count={6} />
                ) : (
                  categories.slice(0, 10).map((cat) => (
                    <li key={cat.slug}>
                      <Link to={`/category/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <div className="ads-widget ads-widget--vertical">
              <div className="ads-placeholder">
                <span>Iklan</span>
              </div>
            </div>

            <section className="sidebar-section">
              <h3 className="sidebar-section__title">Berita Populer</h3>
              <div className="popular-news">
                {loading ? (
                  <Skeleton variant="card" count={3} />
                ) : popularNews.length > 0 ? (
                  popularNews.map((news) => (
                    <NewsCard key={news.slug} news={news} variant="compact" />
                  ))
                ) : (
                  <p className="empty-text">Tidak ada berita populer.</p>
                )}
              </div>
            </section>

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

export default HomePage;
