import axios from 'axios';
import type { NewsListResponse, CategoryResponse, ArticleResponse } from '../types/news';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getLatestNews = async () => {
  const { data } = await api.get<NewsListResponse>('/latest');
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get<CategoryResponse>('/categories');
  return data;
};

export const getNewsByCategory = async (slug: string, page: number = 1) => {
  const { data } = await api.get<NewsListResponse>(`/category/${slug}?page=${page}`);
  return data;
};

export const getArticleDetail = async (slug: string) => {
  const { data } = await api.get<ArticleResponse>(`/article/${slug}`);
  return data;
};

export const searchNews = async (query: string, page: number = 1) => {
  const { data } = await api.get<NewsListResponse>(`/search?q=${query}&page=${page}`);
  return data;
};

export default api;
