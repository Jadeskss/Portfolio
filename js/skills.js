// Dynamic Skills Loader
let skillsData = null;

// Load skills on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadSkills();
});

// Load skills from API with automatic change detection
async function loadSkills() {
    try {
        // Fetch from API endpoint
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000/api/skills'
            : '/api/skills';
        
        const response = await fetch(apiUrl, {
            cache: 'no-cache'
        });
        const freshData = await response.json();
        
        // Create hash of current data for comparison
        const freshHash = JSON.stringify(freshData).length;
        const cachedHash = localStorage.getItem('skillsHash');
        
        // Use cached data only if hash matches
        if (cachedHash && cachedHash === freshHash.toString()) {
            const cachedData = localStorage.getItem('skillsData');
            if (cachedData) {
                skillsData = JSON.parse(cachedData);
            } else {
                skillsData = freshData;
            }
        } else {
            // Data changed, use fresh data and update cache
            skillsData = freshData;
            localStorage.setItem('skillsData', JSON.stringify(skillsData));
            localStorage.setItem('skillsHash', freshHash.toString());
        }
        
        // Render skills
        renderSkills();
    } catch (error) {
        console.error('Error loading skills:', error);
        displayError();
    }
}

// Render all skills by category
function renderSkills() {
    const skillsContainer = document.getElementById('skills-categories-container');
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = '';
    
    // Group skills by category
    skillsData.categories.forEach(category => {
        const categorySkills = skillsData.skills.filter(skill => skill.category === category.id);
        
        if (categorySkills.length > 0) {
            const categorySection = createCategorySection(category, categorySkills);
            skillsContainer.appendChild(categorySection);
        }
    });
    
    // Trigger animations
    setTimeout(() => {
        const skillItems = document.querySelectorAll('.skill-pill');
        skillItems.forEach((item, i) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, i * 50);
        });
    }, 100);
}

// Create category section
function createCategorySection(category, skills) {
    const section = document.createElement('div');
    section.className = 'skills-category-section';
    
    // Create skills HTML as simple pills
    const skillsHTML = skills.map(skill => {
        return `
            <div class="skill-pill" data-skill="${skill.name.toLowerCase().replace(/\s+/g, '')}" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
                <span>${skill.name}</span>
            </div>
        `;
    }).join('');
    
    section.innerHTML = `
        <div class="category-header-simple">
            <h3 class="skills-category-title">${category.name}</h3>
        </div>
        <div class="skills-pills-container">
            ${skillsHTML}
        </div>
    `;
    
    return section;
}

// Display error message
function displayError() {
    const skillsContainer = document.getElementById('skills-categories-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load skills</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Export functions for external use
window.skillsManager = {
    loadSkills,
    renderSkills
};
