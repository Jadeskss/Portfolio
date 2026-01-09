// Education data management
let educationData = [];

// Load education data with automatic change detection
async function loadEducation() {
  try {
    // Always fetch fresh data
    const response = await fetch('data/education.json', {
      cache: 'no-cache'
    });
    const freshData = await response.json();
    
    // Create hash of current data for comparison
    const freshHash = JSON.stringify(freshData).length;
    const cachedHash = localStorage.getItem('educationHash');
    
    // Use cached data only if hash matches
    if (cachedHash && cachedHash === freshHash.toString()) {
      const cachedData = localStorage.getItem('educationData');
      if (cachedData) {
        educationData = JSON.parse(cachedData);
      } else {
        educationData = freshData.education || freshData;
      }
    } else {
      // Data changed, use fresh data and update cache
      educationData = freshData.education || freshData;
      localStorage.setItem('educationData', JSON.stringify(educationData));
      localStorage.setItem('educationHash', freshHash.toString());
    }
    
    renderEducation();
  } catch (error) {
    console.error('Error loading education data:', error);
  }
}

// Render education items
function renderEducation() {
  const container = document.querySelector('.education-container');
  if (!container) return;

  container.innerHTML = educationData.map(edu => `
    <div class="education-item ${edu.isCurrent ? 'current' : ''}">
      <div class="education-marker ${edu.isCurrent ? 'active' : ''}"></div>
      <div class="education-header">
        <div class="education-title">
          <h3>${edu.degree}</h3>
          <p class="education-institution">${edu.institution}</p>
          ${edu.honor ? `<p class="education-honor">• ${edu.honor}</p>` : ''}
        </div>
        <div class="education-date">${edu.startDate} - ${edu.endDate}</div>
      </div>
    </div>
  `).join('');
}

// Initialize education on page load
document.addEventListener('DOMContentLoaded', loadEducation);
