const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const { parseNewsItem, extractLdJson, extractMetaTags, getAbsoluteUrl, getOriginalImage } = require('../utils/parser');
const { getRandomUserAgent } = require('../utils/userAgents');

const BASE_URL = process.env.BASE_URL || 'https://lumajangsatu.com/';

// Cache instance: 
// stdTTL: 600 (10 minutes for lists), checkperiod: 120
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

class ScraperService {
  async _fetch(url) {
    return axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent()
      }
    });
  }

  async fetchLatestNews() {
    const cacheKey = 'latest_news';
    const cachedData = cache.get(cacheKey);
    if (cachedData && cachedData.length > 0) return cachedData;
    cache.del(cacheKey); // Clear stale cache

    try {
      const { data } = await this._fetch(BASE_URL);
      const $ = cheerio.load(data);
      const news = [];

      $('article').each((i, el) => {
        const item = parseNewsItem($, el, BASE_URL);
        if (item.title) news.push(item);
      });

      if (news.length > 0) {
        cache.set(cacheKey, news, 300); // 5 min TTL
      }
      return news;
    } catch (error) {
      console.error('Error fetching latest news:', error.message);
      throw error;
    }
  }

  async fetchByCategory(slug, page = 1) {
    const cacheKey = `category_${slug}_page_${page}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && cachedData.news && cachedData.news.length > 0) return cachedData;
    cache.del(cacheKey); // Clear stale empty cache

    try {
      const url = page > 1 ? `${BASE_URL}category/${slug}/${page}` : `${BASE_URL}category/${slug}`;
      const { data } = await this._fetch(url);
      const $ = cheerio.load(data);
      const news = [];

      $('article').each((i, el) => {
        const item = parseNewsItem($, el, BASE_URL);
        if (item.title) news.push(item);
      });

      const pagination = this._parsePagination($);
      const result = { news, pagination };

      if (news.length > 0) {
        cache.set(cacheKey, result, 180); // 3 min TTL
      }
      return result;
    } catch (error) {
      console.error(`Error fetching category ${slug} page ${page}:`, error.message);
      throw error;
    }
  }

  async fetchArticleDetail(articleUrl) {
    const cacheKey = `article_${articleUrl}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && cachedData.title) return cachedData;
    cache.del(cacheKey); // Clear stale cache

    try {
      const { data } = await this._fetch(articleUrl);
      const $ = cheerio.load(data);
      
      const title = $('h1.entry-title').text().trim();
      
      // Get the first entry-date which is usually the article date
      const dateEl = $('article time.entry-date').first();
      const date = dateEl.text().trim();
      const isoDate = dateEl.attr('datetime');
      
      const author = $('meta[name="content_author"]').attr('content') || $('.bacajuga span[itemprop="name"]').text().trim() || 'Redaksi';

      // Extract main content
      const contentEl = $('.entry-content').clone(); // Clone to manipulate
      
      // Extract related news before removing them from content
      const relatedNews = [];
      contentEl.find('.read_related').each((i, el) => {
        const rLink = $(el).find('a');
        relatedNews.push({
          title: rLink.attr('title') || rLink.text().trim(),
          url: getAbsoluteUrl(rLink.attr('href'), BASE_URL),
          thumbnail: getAbsoluteUrl($(el).find('img').attr('data-src') || $(el).find('img').attr('src'), BASE_URL),
          date: $(el).find('.time_mini').text().trim()
        });
      });

      // Remove unwanted elements from content HTML
      contentEl.find('.read_related, .bacajuga, script, ins').remove();
      
      const contentHtml = contentEl.html().trim();
      const contentText = contentEl.find('p').map((i, el) => $(el).text().trim()).get().filter(t => t.length > 0).join('\n\n');
      
      // Images in content
      const images = [];
      $('.entry-content img').each((i, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src');
        if (src && !$(el).hasClass('img-bcj')) { // Skip tiny related thumbnails
          images.push(getOriginalImage(getAbsoluteUrl(src, BASE_URL)));
        }
      });

      // Featured image from meta or specific class
      let featuredImage = getAbsoluteUrl($('.gmr-featured-img img').attr('src'), BASE_URL);
      if (!featuredImage) {
        featuredImage = $('meta[property="og:image"]').attr('content');
      }
      featuredImage = getOriginalImage(featuredImage);

      // Tags
      const tags = [];
      $('.tags-links a').each((i, el) => {
        tags.push({
          name: $(el).text().trim(),
          url: getAbsoluteUrl($(el).attr('href'), BASE_URL)
        });
      });

      const seoMeta = extractMetaTags($);
      const ldJson = extractLdJson($);

      const result = {
        title,
        author,
        date,
        isoDate,
        contentHtml,
        contentText,
        featuredImage,
        images,
        tags,
        relatedNews,
        seoMeta,
        ldJson,
        url: articleUrl
      };

      cache.set(cacheKey, result, 3600); // 1 hour TTL for articles
      return result;
    } catch (error) {
      console.error(`Error fetching article detail from ${articleUrl}:`, error.message);
      throw error;
    }
  }

  async fetchCategories() {
    const cacheKey = 'categories';
    const cachedData = cache.get(cacheKey);
    if (cachedData && cachedData.length > 0) return cachedData;
    cache.del(cacheKey); // Clear stale cache

    try {
      const { data } = await this._fetch(BASE_URL);
      const $ = cheerio.load(data);
      const categories = [];

      // Look for categories in the footer list since it was identified in research
      $('.copyright-menu li a').each((i, el) => {
        const name = $(el).text().trim();
        const url = $(el).attr('href');
        
        if (url && url.includes('/category/')) {
          const slug = url.split('/').pop();
          categories.push({ name, slug, url: getAbsoluteUrl(url, BASE_URL) });
        }
      });

      if (categories.length > 0) {
        cache.set(cacheKey, categories, 3600); // 1 hour TTL for categories
      }
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw error;
    }
  }

  async searchNews(query, page = 1) {
    const cacheKey = `search_${query}_page_${page}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && cachedData.news && cachedData.news.length > 0) return cachedData;
    cache.del(cacheKey); // Clear stale cache

    try {
      const url = page > 1 ? `${BASE_URL}search/${encodeURIComponent(query)}/${page}` : `${BASE_URL}search/${encodeURIComponent(query)}`;
      const { data } = await this._fetch(url);
      const $ = cheerio.load(data);
      const news = [];

      $('article').each((i, el) => {
        const item = parseNewsItem($, el, BASE_URL);
        if (item.title) news.push(item);
      });

      const pagination = this._parsePagination($);
      const result = { news, pagination };

      if (news.length > 0) {
        cache.set(cacheKey, result, 180); // 3 minutes TTL for search
      }
      return result;
    } catch (error) {
      console.error(`Error searching news for ${query} page ${page}:`, error.message);
      throw error;
    }
  }

  _parsePagination($) {
    const paginationEl = $('.pagination');
    if (!paginationEl.length) return null;

    const pages = [];
    paginationEl.find('li.page-item').each((i, el) => {
      const text = $(el).text().trim();
      const link = $(el).find('a').attr('href');
      const isActive = $(el).hasClass('active');
      const isDisabled = $(el).hasClass('disabled');

      if (text && text !== '...' && text !== 'Next' && text !== 'Previous') {
        pages.push({
          text,
          page: parseInt(text) || text,
          link: getAbsoluteUrl(link, BASE_URL),
          isActive,
          isDisabled
        });
      }
    });

    const currentPageEl = paginationEl.find('li.active').text().trim();
    const currentPage = parseInt(currentPageEl) || 1;

    // Get total pages from the last numerical page link if available
    let totalPages = currentPage;
    pages.forEach(p => {
      if (typeof p.page === 'number' && p.page > totalPages) {
        totalPages = p.page;
      }
    });

    return {
      currentPage,
      totalPages,
      pages
    };
  }
}

module.exports = new ScraperService();
