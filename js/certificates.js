// Dynamic Certificates Loader
let certificatesData = null;

// Load certificates on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadCertificates();
});

// Load certificates from JSON
async function loadCertificates() {
    try {
        // Detect if we're in root or pages folder
        const isInPages = window.location.pathname.includes('/pages/');
        const jsonPath = isInPages ? '../data/certificates.json' : 'data/certificates.json';
        
        const response = await fetch(jsonPath);
        certificatesData = await response.json();
        
        // Render certificates
        renderCertificates();
    } catch (error) {
        console.error('Error loading certificates:', error);
        displayError();
    }
}

// Render all certificates
function renderCertificates() {
    const certificatesContainer = document.getElementById('certificates-container');
    if (!certificatesContainer) return;
    
    certificatesContainer.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedCertificates = [...certificatesData.certificates].sort((a, b) => {
        return parseInt(b.date) - parseInt(a.date);
    });
    
    // Render each certificate
    sortedCertificates.forEach((cert, index) => {
        const certElement = createCertificateElement(cert, index);
        certificatesContainer.appendChild(certElement);
    });
    
    // Trigger animations
    setTimeout(() => {
        const certItems = document.querySelectorAll('.education-item');
        certItems.forEach((item, i) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }, 100);
}

// Create certificate element
function createCertificateElement(cert, index) {
    const item = document.createElement('div');
    item.className = 'education-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.3s ease';
    
    // Build tags HTML
    const tagsHTML = cert.tags.map(tag => 
        `<span class="cert-tag">${tag}</span>`
    ).join('');
    
    item.innerHTML = `
        <div class="education-header">
            <div class="education-title">
                <h3>${cert.title}</h3>
                <p class="education-institution">${cert.issuer}</p>
                ${cert.tags.length > 0 ? `
                    <div class="certificate-tags">
                        ${tagsHTML}
                    </div>
                ` : ''}
                ${cert.description ? `<p class="cert-description">${cert.description}</p>` : ''}
            </div>
            <div class="education-date">${cert.date}</div>
        </div>
        ${cert.link !== '#' ? `
            <a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="certificate-view-btn">
                <i class="fas fa-external-link-alt"></i>
                View Certificate
            </a>
        ` : `
            <a href="#" class="certificate-view-btn" onclick="return false;" style="opacity: 0.5; cursor: not-allowed;">
                <i class="fas fa-external-link-alt"></i>
                View Certificate
            </a>
        `}
    `;
    
    return item;
}

// Display error message
function displayError() {
    const certificatesContainer = document.getElementById('certificates-container');
    if (certificatesContainer) {
        certificatesContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load certificates</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Export functions for external use
window.certificatesManager = {
    loadCertificates,
    renderCertificates
};
