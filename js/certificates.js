// Dynamic Certificates Loader
let certificatesData = null;

// Load certificates on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadCertificates();
});

// Load certificates from API with automatic change detection
async function loadCertificates() {
    try {
        // Fetch from API endpoint
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000/api/certificates'
            : '/api/certificates';
        
        const response = await fetch(apiUrl, {
            cache: 'no-cache'
        });
        const freshData = await response.json();
        
        // Create hash of current data for comparison
        const freshHash = JSON.stringify(freshData).length;
        const cachedHash = localStorage.getItem('certificatesHash');
        
        // Use cached data only if hash matches
        if (cachedHash && cachedHash === freshHash.toString()) {
            const cachedData = localStorage.getItem('certificatesData');
            if (cachedData) {
                certificatesData = JSON.parse(cachedData);
            } else {
                certificatesData = freshData;
            }
        } else {
            // Data changed, use fresh data and update cache
            certificatesData = freshData;
            localStorage.setItem('certificatesData', JSON.stringify(certificatesData));
            localStorage.setItem('certificatesHash', freshHash.toString());
        }
        
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
    
    if (!certificatesData || !certificatesData.certificates || certificatesData.certificates.length === 0) {
        certificatesContainer.innerHTML = '<p class="no-items">No certificates yet.</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedCertificates = [...certificatesData.certificates].sort((a, b) => {
        return parseInt(b.date) - parseInt(a.date);
    });
    
    // Show only the 4 most recent certificates
    const recentCertificates = sortedCertificates.slice(0, 4);
    
    // Render certificates in new format
    certificatesContainer.innerHTML = recentCertificates.map(cert => `
        <div class="dual-section-item">
            <div class="item-content">
                <h3 class="item-title">${cert.title}</h3>
                <p class="item-subtitle">${cert.issuer}</p>
            </div>
        </div>
    `).join('');
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
