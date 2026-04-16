import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { NewsItem } from '../types/news';
import './NewsCard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'featured' | 'compact';
}

const getImageUrl = (thumbnail: string) => {
  if (!thumbnail) return '/placeholder.jpg';
  if (thumbnail.startsWith('/api/') || thumbnail.startsWith('data:')) return thumbnail;
  return `${API_BASE_URL}/image?url=${encodeURIComponent(thumbnail)}`;
};

const NewsCard: React.FC<NewsCardProps> = ({ news, variant = 'default' }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <article className={`news-card news-card--${variant}`}>
      <Link to={`/article/${news.slug}`} className="news-card__image-link">
        <div className="news-card__image-wrapper">
          <img
            src={getImageUrl(news.thumbnail)}
            alt={news.title}
            className="news-card__image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
            }}
          />
        </div>
      </Link>
      <div className="news-card__content">
        <Link to={`/category/${news.category}`} className="news-card__category">
          {news.category}
        </Link>
        <h3 className="news-card__title">
          <Link to={`/article/${news.slug}`}>{news.title}</Link>
        </h3>
        {variant !== 'compact' && (
          <p className="news-card__excerpt">{news.excerpt}</p>
        )}
        <div className="news-card__meta">
          <Calendar size={14} />
          <span>{formatDate(news.isoDate)}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
