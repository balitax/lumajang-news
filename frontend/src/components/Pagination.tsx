import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../types/news';
import './Pagination.css';

interface PaginationProps {
  pagination: PaginationType;
  baseUrl?: string;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, baseUrl }) => {
  const [searchParams] = useSearchParams();
  
  if (!pagination || pagination.totalPages <= 1) return null;

  const getPageUrl = (pageNum: number) => {
    if (baseUrl) {
      return pageNum === 1 ? baseUrl : `${baseUrl}?page=${pageNum}`;
    }
    const params = new URLSearchParams(searchParams);
    if (pageNum === 1) {
      params.delete('page');
    } else {
      params.set('page', String(pageNum));
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {pagination.pages.map((page, index) => {
        if (page.isDisabled && page.text === '...') {
          return (
            <span key={`ellipsis-${index}`} className="pagination__ellipsis">
              ...
            </span>
          );
        }

        const pageNum = typeof page.page === 'number' ? page.page : null;
        const url = pageNum !== null ? getPageUrl(pageNum) : null;

        if (url !== null) {
          return (
            <Link
              key={page.text}
              to={url}
              className={`pagination__link ${page.isActive ? 'pagination__link--active' : ''}`}
            >
              {page.text === 'Prev' ? <ChevronLeft size={18} /> : 
               page.text === 'Next' ? <ChevronRight size={18} /> : 
               page.text}
            </Link>
          );
        }

        return (
          <span
            key={page.text}
            className={`pagination__link pagination__link--disabled ${page.isActive ? 'pagination__link--active' : ''}`}
          >
            {page.text === 'Prev' ? <ChevronLeft size={18} /> : 
             page.text === 'Next' ? <ChevronRight size={18} /> : 
             page.text}
          </span>
        );
      })}
    </nav>
  );
};

export default Pagination;
