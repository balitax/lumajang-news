import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { getNewsByCategory, getCategories } from '../services/api';
import type { NewsItem, Category, Pagination as PaginationType } from '../types/news';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsRes, catRes] = await Promise.all([
          getNewsByCategory(slug!, page),
          getCategories()
        ]);
        setNews(newsRes.data);
        setPagination(newsRes.pagination);
        setCategories(catRes.data);
        const foundCat = catRes.data.find((c: Category) => c.slug === slug);
        setCategory(foundCat || null);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch category news', err);
        setError('Gagal memuat berita. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchData();
    }
  }, [slug, page]);

  if (error) {
    return (
      <div className="category-page">
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
    <div className="category-page">
      <div className="container">
        <div className="category-page__layout">
          <main className="category-page__main">
            <header className="category-page__header">
              <h1 className="category-page__title">
                <FolderOpen size={28} />
                {loading ? 'Memuat...' : (category?.name || slug)}
              </h1>
              <p className="category-page__subtitle">
                {pagination ? `${pagination.totalPages} halaman` : ''} Berita dalam kategori ini
              </p>
            </header>

            {loading ? (
              <Skeleton variant="card" count={9} />
            ) : news.length > 0 ? (
              <>
                <div className="news-grid">
                  {news.map((item) => (
                    <NewsCard key={item.slug} news={item} />
                  ))}
                </div>
                {pagination && <Pagination pagination={pagination} baseUrl={`/category/${slug}`} />}
              </>
            ) : (
              <div className="empty-state">
                <p>Tidak ada berita dalam kategori ini.</p>
              </div>
            )}
          </main>

          <aside className="category-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-section__title">Kategori Lainnya</h3>
              <ul className="category-list">
                {loading ? (
                  <Skeleton variant="text" count={6} />
                ) : (
                  categories
                    .filter((c) => c.slug !== slug)
                    .map((cat) => (
                      <li key={cat.slug}>
                        <a href={`/category/${cat.slug}`}>{cat.name}</a>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
