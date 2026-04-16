import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'card' | 'text' | 'image';
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'text') {
    return (
      <div className="skeleton-text">
        {items.map((i) => (
          <div key={i} className="skeleton-text__line" style={{ width: `${100 - i * 15}%` }} />
        ))}
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className="skeleton-image" />
    );
  }

  return (
    <div className="skeleton-grid">
      {items.map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card__image" />
          <div className="skeleton-card__content">
            <div className="skeleton-card__category" />
            <div className="skeleton-card__title">
              <div className="skeleton-card__title-line" />
              <div className="skeleton-card__title-line" style={{ width: '70%' }} />
            </div>
            <div className="skeleton-card__excerpt">
              <div className="skeleton-card__text-line" />
              <div className="skeleton-card__text-line" />
              <div className="skeleton-card__text-line" style={{ width: '60%' }} />
            </div>
            <div className="skeleton-card__date" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-card__image" />
    <div className="skeleton-card__content">
      <div className="skeleton-card__category" />
      <div className="skeleton-card__title">
        <div className="skeleton-card__title-line" />
        <div className="skeleton-card__title-line" style={{ width: '70%' }} />
      </div>
      <div className="skeleton-card__excerpt">
        <div className="skeleton-card__text-line" />
        <div className="skeleton-card__text-line" />
        <div className="skeleton-card__text-line" style={{ width: '60%' }} />
      </div>
      <div className="skeleton-card__date" />
    </div>
  </div>
);

export default Skeleton;
