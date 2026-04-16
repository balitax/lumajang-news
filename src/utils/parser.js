const cheerio = require('cheerio');

const getAbsoluteUrl = (url, baseUrl) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return new URL(url, baseUrl).toString();
};

const getOriginalImage = (url) => {
  if (!url) return null;
  // Step 1: Replace thumbs or ogimage with uploads
  let newUrl = url.replace(/\/(thumbs|ogimage)\//g, '/uploads/');
  
  // Step 2: Ensure /po-content/ exists before /uploads/ if it's missing
  if (newUrl.includes('/uploads/') && !newUrl.includes('/po-content/')) {
    newUrl = newUrl.replace('/uploads/', '/po-content/uploads/');
  }
  
  return newUrl;
};

const extractLdJson = ($) => {
  const ldJsonScripts = $('script[type="application/ld+json"]');
  const results = [];
  ldJsonScripts.each((i, el) => {
    try {
      const content = $(el).html();
      results.push(JSON.parse(content));
    } catch (e) {
      // Ignore parse errors
    }
  });
  return results;
};

const extractMetaTags = ($) => {
  const meta = {};
  $('meta').each((i, el) => {
    const name = $(el).attr('name') || $(el).attr('property');
    const content = $(el).attr('content');
    if (name && content) {
      meta[name] = content;
    }
  });
  
  // Specific SEO focused data
  return {
    title: $('title').text(),
    description: meta['description'] || meta['og:description'],
    keywords: meta['keywords'] || meta['news_keywords'],
    author: meta['author'] || meta['content_author'],
    canonical: $('link[rel="canonical"]').attr('href'),
    og: {
      title: meta['og:title'],
      description: meta['og:description'],
      image: meta['og:image'],
      url: meta['og:url'],
      type: meta['og:type']
    },
    twitter: {
      card: meta['twitter:card'],
      title: meta['twitter:title'],
      description: meta['twitter:description'],
      image: meta['twitter:image']
    },
    article: {
      published_time: meta['article:published_time'],
      modified_time: meta['article:modified_time'],
      tags: meta['article:tag'] // Note: this might only catch the first one if multiple
    }
  };
};

const parseNewsItem = ($, el, baseUrl) => {
  const titleEl = $(el).find('h2.entry-title a');
  const title = titleEl.text().trim();
  const link = getAbsoluteUrl(titleEl.attr('href'), baseUrl);
  
  // Extract slug from link
  let slug = null;
  if (link) {
    const urlObj = new URL(link);
    slug = urlObj.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
  }

  const imgEl = $(el).find('.content-thumbnail img');
  const thumbnail = getOriginalImage(getAbsoluteUrl(imgEl.attr('data-src') || imgEl.attr('src'), baseUrl));
  
  const dateEl = $(el).find('time.entry-date');
  const date = dateEl.text().trim();
  const isoDate = dateEl.attr('datetime');
  
  const excerpt = $(el).find('.entry-content-archive p').text().trim();
  
  const categoryEl = $(el).find('.gmr-meta-topic a');
  const category = categoryEl.text().trim();
  const categoryUrl = getAbsoluteUrl(categoryEl.attr('href'), baseUrl);

  return { title, slug, link, thumbnail, date, isoDate, excerpt, category, categoryUrl };
};

module.exports = {
  getAbsoluteUrl,
  getOriginalImage,
  extractLdJson,
  extractMetaTags,
  parseNewsItem
};
