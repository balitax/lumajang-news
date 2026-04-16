import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { NewsItem } from '../types/news';
import './HeadlineCarousel.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface HeadlineCarouselProps {
  headlines: NewsItem[];
}

const getImageUrl = (thumbnail: string) => {
  if (!thumbnail) return '';
  if (thumbnail.startsWith('/api/') || thumbnail.startsWith('data:')) return thumbnail;
  return `${API_BASE_URL}/image?url=${encodeURIComponent(thumbnail)}`;
};

const HeadlineCarousel: React.FC<HeadlineCarouselProps> = ({ headlines }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (headlines.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [headlines.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % headlines.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!headlines.length) return null;

  const currentNews = headlines[currentIndex];

  return (
    <div className="headline-carousel">
      <div className="carousel__container">
        <img 
          src={getImageUrl(currentNews.thumbnail)}
          alt={currentNews.title}
          className="carousel__image"
        />
        <div className="carousel__overlay" />
        
        <div className="carousel__content">
          <Link to={`/category/${currentNews.category}`} className="carousel__category">
            {currentNews.category}
          </Link>
          <h2 className="carousel__title">
            <Link to={`/article/${currentNews.slug}`}>{currentNews.title}</Link>
          </h2>
          <p className="carousel__excerpt">{currentNews.excerpt}</p>
          <div className="carousel__meta">
            <span>{new Date(currentNews.isoDate).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        {headlines.length > 1 && (
          <>
            <button className="carousel__nav carousel__nav--prev" onClick={goToPrev}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel__nav carousel__nav--next" onClick={goToNext}>
              <ChevronRight size={24} />
            </button>

            <div className="carousel__dots">
              {headlines.map((_, index) => (
                <button
                  key={index}
                  className={`carousel__dot ${index === currentIndex ? 'carousel__dot--active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="carousel__thumbnails">
        {headlines.slice(0, 5).map((news, index) => (
          <button
            key={news.slug}
            className={`carousel__thumb ${index === currentIndex ? 'carousel__thumb--active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <span className="carousel__thumb-title">{news.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeadlineCarousel;
