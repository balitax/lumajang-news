export interface NewsItem {
  title: string;
  slug: string;
  link: string;
  thumbnail: string;
  date: string;
  isoDate: string;
  excerpt: string;
  category: string;
  categoryUrl: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pages: {
    text: string;
    page: number | string;
    link: string | null;
    isActive: boolean;
    isDisabled: boolean;
  }[];
}

export interface NewsListResponse {
  success: boolean;
  count: number;
  pagination?: Pagination;
  data: NewsItem[];
}

export interface Category {
  name: string;
  slug: string;
  url: string;
}

export interface CategoryResponse {
  success: boolean;
  count: number;
  data: Category[];
}

export interface ArticleDetail {
  title: string;
  author: string;
  date: string;
  isoDate: string;
  contentHtml: string;
  contentText: string;
  featuredImage: string;
  images: string[];
  tags: {
    name: string;
    url: string;
  }[];
  relatedNews: {
    title: string;
    url: string;
    thumbnail: string;
    date: string;
  }[];
  seoMeta: any;
  ldJson: any[];
  url: string;
}

export interface ArticleResponse {
  success: boolean;
  data: ArticleDetail;
}
