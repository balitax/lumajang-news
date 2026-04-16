import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchNews } from '../services/api';
import type { NewsItem } from '../types/news';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [results, setResults] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const res = await searchNews(query, page);
        setResults(res.data);
        setPagination(res.pagination);
        setError(null);
      } catch (err) {
        console.error('Search failed', err);
        setError('Pencarian gagal. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput, page: '1' });
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <header className="search-page__header">
          <h1 className="search-page__title">
            <SearchIcon size={28} />
            Pencarian
          </h1>
          
          <form className="search-page__form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-page__input"
            />
            <button type="submit" className="search-page__button">
              <SearchIcon size={20} />
              Cari
            </button>
          </form>
        </header>

        {query && (
          <div className="search-page__results-info">
            {loading ? (
              <p>Memuat...</p>
            ) : results.length > 0 ? (
              <p>Ditemukan <strong>{pagination?.totalPages * pagination?.pages?.length || results.length}</strong> hasil untuk "<strong>{query}</strong>"</p>
            ) : (
              <p>Tidak ada hasil untuk "<strong>{query}</strong>"</p>
            )}
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        )}

        {loading ? (
          <Skeleton variant="card" count={6} />
        ) : results.length > 0 ? (
          <>
            <div className="search-results">
              {results.map((item) => (
                <NewsCard key={item.slug} news={item} />
              ))}
            </div>
            {pagination && <Pagination pagination={pagination} />}
          </>
        ) : !query ? (
          <div className="search-empty">
            <SearchIcon size={48} />
            <h2>Mulai Pencarian</h2>
            <p>Masukkan kata kunci untuk mencari berita</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
