const axios = require('axios');

/**
 * Tra cứu bách khoa toàn thư Wikipedia Tiếng Việt
 * Trả về thông tin xuất xứ, lịch sử, kỹ thuật và định nghĩa chuẩn xác
 */
async function searchWikipedia(query) {
  try {
    const searchRes = await axios.get('https://vi.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        utf8: 1
      },
      headers: {
        'User-Agent': 'CraftRootsHeritageBot/1.0 (https://craftroots.vn; contact@craftroots.vn)'
      },
      timeout: 5000
    });

    const searchList = searchRes.data?.query?.search || [];
    if (searchList.length === 0) return [];

    // Lấy tối đa 2 kết quả phù hợp nhất
    const topResults = searchList.slice(0, 2);
    const enrichedResults = [];

    for (const item of topResults) {
      try {
        const extractRes = await axios.get('https://vi.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            prop: 'extracts',
            exintro: 1,
            explaintext: 1,
            pageids: item.pageid,
            format: 'json',
            utf8: 1
          },
          headers: {
            'User-Agent': 'CraftRootsHeritageBot/1.0 (https://craftroots.vn; contact@craftroots.vn)'
          },
          timeout: 4000
        });

        const pageData = extractRes.data?.query?.pages?.[item.pageid];
        const rawExtract = pageData?.extract || item.snippet?.replace(/<[^>]+>/g, '') || '';
        const cleanSnippet = rawExtract.length > 350 ? rawExtract.substring(0, 350) + '...' : rawExtract;

        enrichedResults.push({
          title: item.title,
          snippet: cleanSnippet,
          source: 'Wikipedia Tiếng Việt',
          url: `https://vi.wikipedia.org/?curid=${item.pageid}`
        });
      } catch {
        enrichedResults.push({
          title: item.title,
          snippet: item.snippet?.replace(/<[^>]+>/g, '') || '',
          source: 'Wikipedia Tiếng Việt',
          url: `https://vi.wikipedia.org/?curid=${item.pageid}`
        });
      }
    }

    return enrichedResults;
  } catch (err) {
    console.warn('Lỗi tra cứu Wikipedia:', err.message);
    return [];
  }
}

/**
 * Tra cứu thông tin thời sự, phóng sự, báo chí qua Google News RSS (Tiếng Việt)
 */
async function searchGoogleNews(query) {
  try {
    const res = await axios.get('https://news.google.com/rss/search', {
      params: {
        q: query,
        hl: 'vi',
        gl: 'VN',
        ceid: 'VN:vi'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 5000
    });

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(res.data)) !== null && items.length < 3) {
      const content = match[1];
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(content);
      const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(content);
      const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(content);

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
        const link = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
        const source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : 'Báo chí trực tuyến';

        // Tách nguồn khỏi tiêu đề nếu báo ghép cuối (VD: "Tiêu đề - Báo Tuổi Trẻ")
        if (title.includes(' - ')) {
          title = title.substring(0, title.lastIndexOf(' - ')).trim();
        }

        items.push({
          title,
          snippet: `Tin tức báo chí ghi nhận về "${title}" (Nguồn: ${source})`,
          source: source || 'Báo chí & Truyền thông',
          url: link
        });
      }
    }

    return items;
  } catch (err) {
    console.warn('Lỗi tra cứu Google News RSS:', err.message);
    return [];
  }
}

/**
 * Tìm kiếm tổng hợp trên Internet (Wikipedia + Báo chí)
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Promise<Array>} Danh sách kết quả { title, snippet, source, url }
 */
async function searchWeb(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();
  
  // Chạy song song cả Wikipedia và Google News để tối ưu tốc độ phản hồi
  const [wikiResults, newsResults] = await Promise.allSettled([
    searchWikipedia(cleanQuery),
    searchGoogleNews(cleanQuery)
  ]);

  const results = [];

  if (wikiResults.status === 'fulfilled' && Array.isArray(wikiResults.value)) {
    results.push(...wikiResults.value);
  }

  if (newsResults.status === 'fulfilled' && Array.isArray(newsResults.value)) {
    results.push(...newsResults.value);
  }

  return results.slice(0, 4);
}

module.exports = {
  searchWeb,
  searchWikipedia,
  searchGoogleNews
};
