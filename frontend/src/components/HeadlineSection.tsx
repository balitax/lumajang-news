import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import type { NewsItem } from '../types/news';
import './HeadlineSection.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface HeadlineSectionProps {
  headlines: NewsItem[];
}

const getImageUrl = (thumbnail: string) => {
  if (!thumbnail) return '';
  if (thumbnail.startsWith('/api/') || thumbnail.startsWith('data:')) return thumbnail;
  return `${API_BASE_URL}/image?url=${encodeURIComponent(thumbnail)}`;
};

const HeadlineSection: React.FC<HeadlineSectionProps> = ({ headlines }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (headlines.length <= 1) return;
    clearAutoPlay();
    intervalRef.current = setInterval(() => {
      setDirection('next');
      setCurrentIndex(prev => (prev + 1) % headlines.length);
    }, 6000);
  }, [headlines.length, clearAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => clearAutoPlay();
  }, [startAutoPlay, clearAutoPlay]);

  const goToSlide = useCallback((targetIndex: number, dir: 'next' | 'prev') => {
    if (targetIndex === currentIndex || transitioning) return;
    
    setDirection(dir);
    setTransitioning(true);
    clearAutoPlay();
    
    setTimeout(() => {
      setCurrentIndex(targetIndex);
      setTransitioning(false);
      startAutoPlay();
    }, 500);
  }, [currentIndex, transitioning, clearAutoPlay, startAutoPlay]);

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % headlines.length, 'next');
  }, [currentIndex, headlines.length, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + headlines.length) % headlines.length, 'prev');
  }, [currentIndex, headlines.length, goToSlide]);

  if (headlines.length === 0) return null;

  const otherHeadlines = headlines.filter((_, i) => i !== currentIndex).slice(0, 4);
  const currentNews = headlines[currentIndex];

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <section className="headline-section">
      <div className="headline-section__main">
        <div className="headline-carousel">
          <div className="headline-carousel__slides">
            <div 
              key={currentNews.slug}
              className={`headline-carousel__slide headline-carousel__slide--active headline-carousel__slide--${direction} ${transitioning ? 'headline-carousel__slide--transitioning' : ''}`}
            >
              <img 
                src={getImageUrl(currentNews.thumbnail)}
                alt={currentNews.title}
              />
              <Link to={`/article/${currentNews.slug}`} className="headline-carousel__link">
                <div className="headline-carousel__gradient" />
                <div className="headline-carousel__content">
                  <span className="headline-carousel__badge">
                    {currentNews.category}
                  </span>
                  <h1 className="headline-carousel__title">
                    {currentNews.title}
                  </h1>
                  <p className="headline-carousel__excerpt">{currentNews.excerpt}</p>
                  <div className="headline-carousel__meta">
                    <span className="headline-carousel__date">
                      <Clock size={14} />
                      {formatDate(currentNews.isoDate)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {headlines.length > 1 && (
            <>
              <button className="headline-carousel__nav headline-carousel__nav--prev" onClick={goToPrev}>
                <ChevronLeft size={20} />
              </button>
              <button className="headline-carousel__nav headline-carousel__nav--next" onClick={goToNext}>
                <ChevronRight size={20} />
              </button>

              <div className="headline-carousel__progress">
                {headlines.map((_, index) => (
                  <div 
                    key={index}
                    className={`headline-carousel__progress-bar ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'passed' : ''}`}
                    onClick={() => goToSlide(index, index > currentIndex ? 'next' : 'prev')}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="headline-list">
          <div className="headline-list__header">
            <TrendingUp size={18} />
            <span>Trending</span>
          </div>
          {otherHeadlines.map((news, index) => (
            <Link 
              key={news.slug} 
              to={`/article/${news.slug}`}
              className={`headline-list__item ${index === 0 ? 'headline-list__item--first' : ''}`}
            >
              <div className="headline-list__image">
                <img src={getImageUrl(news.thumbnail)} alt={news.title} />
              </div>
              <div className="headline-list__content">
                <span className="headline-list__category">{news.category}</span>
                <h3 className="headline-list__title">{news.title}</h3>
                <span className="headline-list__date">{formatDate(news.isoDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="headline-section__indicators">
        {headlines.slice(0, 5).map((news, index) => (
          <button
            key={news.slug}
            className={`headline-indicator ${index === currentIndex ? 'headline-indicator--active' : ''}`}
            onClick={() => goToSlide(index, index > currentIndex ? 'next' : 'prev')}
          >
            <span className="headline-indicator__num">{index + 1}</span>
            <span className="headline-indicator__title">{news.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeadlineSection;
