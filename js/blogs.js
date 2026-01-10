// blogs.js - Load and display blog posts
document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
});

async function loadBlogs() {
  try {
    const response = await fetch('/api/blogs');
    const blogs = await response.json();
    
    const container = document.getElementById('blogs-container');
    
    if (!blogs || blogs.length === 0) {
      container.innerHTML = '<p class="no-items">No blogs yet. Check back soon!</p>';
      return;
    }
    
    // Show only the 4 most recent blogs
    const recentBlogs = blogs.slice(0, 4);
    
    container.innerHTML = recentBlogs.map(blog => `
      <div class="dual-section-item">
        <div class="item-content">
          <h3 class="item-title">${blog.title}</h3>
          <p class="item-subtitle">${blog.category || 'General'} • ${blog.readTime || '5 min read'}</p>
        </div>
        <div class="item-date">${formatDate(blog.date)}</div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading blogs:', error);
    document.getElementById('blogs-container').innerHTML = 
      '<p class="error-message">Failed to load blogs</p>';
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
