// Dynamic Skills Loader
let skillsData = null;

// Load skills on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadSkills();
});

// Load skills from JSON
async function loadSkills() {
    try {
        // Detect if we're in root or pages folder
        const isInPages = window.location.pathname.includes('/pages/');
        const jsonPath = isInPages ? '../data/skills.json' : 'data/skills.json';
        
        const response = await fetch(jsonPath);
        skillsData = await response.json();
        
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
        const skillItems = document.querySelectorAll('.skill-item');
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
    
    // Detect if we're in pages folder for image paths
    const isInPages = window.location.pathname.includes('/pages/');
    
    // Create skills grid HTML
    const skillsHTML = skills.map(skill => {
        let iconHTML = '';
        
        if (skill.iconType === 'fontawesome') {
            iconHTML = `
                <div class="skill-icon-wrapper">
                    <i class="${skill.icon} skill-icon"></i>
                </div>
            `;
        } else if (skill.iconType === 'image') {
            const imagePath = isInPages ? '../' + skill.icon : skill.icon;
            iconHTML = `
                <div class="skill-icon-img">
                    <img src="${imagePath}" alt="${skill.name}" class="software-icon">
                </div>
            `;
        }
        
        return `
            <div class="skill-item" data-skill="${skill.name.toLowerCase().replace(/\s+/g, '')}" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
                ${iconHTML}
                <span>${skill.name}</span>
            </div>
        `;
    }).join('');
    
    section.innerHTML = `
        <div class="category-header">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3 class="skills-category-title">${category.name}</h3>
        </div>
        <div class="skills-grid">
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
