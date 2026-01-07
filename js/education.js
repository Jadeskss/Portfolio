// Education data management
let educationData = [];

// Load education data
async function loadEducation() {
  try {
    const response = await fetch('data/education.json');
    educationData = await response.json();
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
