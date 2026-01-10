const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const blogsPath = path.join(process.cwd(), 'data', 'blogs.json');
      const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
      
      // Sort by date (newest first)
      const sortedBlogs = blogsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      res.status(200).json(sortedBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      res.status(500).json({ error: 'Failed to load blogs data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
