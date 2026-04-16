import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { NewsItem } from '../types/news';
import NewsCard from './NewsCard';
import './CategorySection.css';

interface CategorySectionProps {
  title: string;
  slug: string;
  news: NewsItem[];
  loading?: boolean;
  icon?: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  slug, 
  news, 
  loading = false,
  icon 
}) => {
  if (loading) {
    return (
      <section className="category-section">
        <div className="category-section__header">
          <h2 className="category-section__title">
            {icon}
            {title}
          </h2>
        </div>
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="category-section__skeleton">
              <div className="category-section__skeleton-image" />
              <div className="category-section__skeleton-content">
                <div className="category-section__skeleton-line category-section__skeleton-line--short" />
                <div className="category-section__skeleton-line" />
                <div className="category-section__skeleton-line category-section__skeleton-line--medium" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="category-section">
      <div className="category-section__header">
        <h2 className="category-section__title">
          {icon}
          {title}
        </h2>
        <Link to={`/category/${slug}`} className="category-section__link">
          <Eye size={16} />
          Lihat Lainnya
        </Link>
      </div>
      <div className="news-grid">
        {news.slice(0, 6).map((item) => (
          <NewsCard key={item.slug} news={item} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
