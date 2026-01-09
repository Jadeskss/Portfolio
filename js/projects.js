// Dynamic Projects Loader
let projectsData = null;
let currentFilter = 'all';
let projectsPerPage = 6;
let currentProjectsShown = 6;

// Load projects on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadProjects();
    initFilters();
    initImageModal();
});

// Load projects from JSON with automatic change detection
async function loadProjects() {
    try {
        // Detect if we're in root or pages folder
        const isInPages = window.location.pathname.includes('/pages/');
        const jsonPath = isInPages ? '../data/projects.json' : 'data/projects.json';
        
        // Always fetch fresh data
        const response = await fetch(jsonPath, {
            cache: 'no-cache'
        });
        const freshData = await response.json();
        
        // Create hash of current data for comparison
        const freshHash = JSON.stringify(freshData).length;
        const cachedHash = localStorage.getItem('projectsHash');
        
        // Use cached data only if hash matches
        if (cachedHash && cachedHash === freshHash.toString()) {
            const cachedData = localStorage.getItem('projectsData');
            if (cachedData) {
                projectsData = JSON.parse(cachedData);
            } else {
                projectsData = freshData;
            }
        } else {
            // Data changed, use fresh data and update cache
            projectsData = freshData;
            localStorage.setItem('projectsData', JSON.stringify(projectsData));
            localStorage.setItem('projectsHash', freshHash.toString());
        }
        
        // Render categories
        renderCategories();
        
        // Render projects
        renderProjects(currentFilter);
    } catch (error) {
        console.error('Error loading projects:', error);
        displayError();
    }
}

// Render category filters
function renderCategories() {
    const filtersContainer = document.getElementById('project-filters');
    if (!filtersContainer) return;
    
    filtersContainer.innerHTML = '';
    
    projectsData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `filter-btn ${category.id === 'all' ? 'active' : ''}`;
        button.setAttribute('data-filter', category.id);
        button.textContent = category.name;
        filtersContainer.appendChild(button);
    });
}

// Render projects
function renderProjects(filter = 'all', showAll = false) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    // Filter projects
    const filteredProjects = filter === 'all' 
        ? projectsData.projects 
        : projectsData.projects.filter(project => project.category === filter);
    
    // Sort by date (newest first)
    filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Determine how many to show
    const projectsToShow = showAll ? filteredProjects : filteredProjects.slice(0, currentProjectsShown);
    
    // Render each project
    projectsToShow.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsContainer.appendChild(projectCard);
    });
    
    // Render View More button
    renderViewMoreButton(filteredProjects.length);
    
    // Trigger animations
    setTimeout(() => {
        const cards = projectsContainer.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, i * 100);
        });
    }, 100);
}

// Render View More button
function renderViewMoreButton(totalProjects) {
    // Remove existing button
    const existingBtn = document.querySelector('.view-more-container');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Check if we're on the index page
    const isIndexPage = !window.location.pathname.includes('/pages/');
    
    // On index page, always show "View More Projects" button if there are projects
    if (isIndexPage && totalProjects > 0) {
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        
        viewMoreContainer.innerHTML = `
            <a href="pages/projects.html" class="view-more-projects-btn">
                View More Projects
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        `;
        
        const projectsGrid = document.getElementById('projects-container');
        if (projectsGrid) {
            projectsGrid.parentNode.insertBefore(viewMoreContainer, projectsGrid.nextSibling);
        }
    }
    // On projects page, show load more button if there are more projects
    else if (!isIndexPage && currentProjectsShown < totalProjects) {
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        
        const remainingCount = totalProjects - currentProjectsShown;
        
        viewMoreContainer.innerHTML = `
            <button class="view-more-btn" id="view-more-btn">
                Load More Projects (${remainingCount})
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        `;
        
        const projectsGrid = document.getElementById('projects-container');
        if (projectsGrid) {
            projectsGrid.parentNode.insertBefore(viewMoreContainer, projectsGrid.nextSibling);
        }
        
        // Add click handler
        const viewMoreBtn = document.getElementById('view-more-btn');
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', () => {
                currentProjectsShown += projectsPerPage;
                renderProjects(currentFilter);
            });
        }
    }
}

// Create project card element
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-title', project.title);
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // Detect if we're in pages folder and adjust image path
    const isInPages = window.location.pathname.includes('/pages/');
    const imagePath = isInPages ? '../' + project.image : project.image;
    const fallbackImage = isInPages ? '../assets/images/icon.png' : 'assets/images/icon.png';
    
    // Build tags HTML
    const tagsHTML = project.tags.map(tag => 
        `<span class="project-tag">${tag}</span>`
    ).join('');
    
    // Determine button text and icon based on category
    let buttonText = 'View Project';
    let buttonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`;
    
    if (project.category === 'design') {
        buttonText = 'View Prototype';
        buttonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>`;
    } else if (project.title.toLowerCase().includes('film') || project.title.toLowerCase().includes('video')) {
        buttonText = 'Watch Film';
        buttonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>`;
    }
    
    // Build card HTML
    card.innerHTML = `
        <div class="project-image">
            <img src="${imagePath}" alt="${project.title}" loading="lazy" onerror="this.src='${fallbackImage}'">
            ${project.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-tags">
                ${tagsHTML}
            </div>
            <p class="project-description">${project.description}</p>
        </div>
        ${project.link !== '#' ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-button">
            ${buttonText}
            ${buttonIcon}
        </a>` : ''}
    `;
    
    return card;
}

// Initialize filter functionality
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value and reset projects shown count
            currentFilter = this.getAttribute('data-filter');
            currentProjectsShown = projectsPerPage;
            renderProjects(currentFilter);
        });
    });
}

// Display error message
function displayError() {
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        projectsContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load projects</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Initialize Image Modal
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    // Add click event to project images using event delegation
    document.addEventListener('click', function(e) {
        const projectImage = e.target.closest('.project-image');
        if (projectImage) {
            const img = projectImage.querySelector('img');
            const card = projectImage.closest('.project-card');
            const title = card.querySelector('.project-title');
            
            if (img && img.src && !img.src.includes('icon.png')) {
                modal.classList.add('show');
                modalImg.src = img.src;
                captionText.textContent = title ? title.textContent : '';
                document.body.style.overflow = 'hidden';
            }
        }
    });
    
    // Close modal when clicking the X
    if (closeBtn) {
        closeBtn.onclick = function() {
            closeModal();
        };
    }
    
    // Close modal when clicking outside the image
    modal.onclick = function(e) {
        if (e.target === modal || e.target === modalImg.parentElement) {
            closeModal();
        }
    };
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Export functions for external use
window.projectsManager = {
    loadProjects,
    renderProjects,
    currentFilter: () => currentFilter
};
