// Dynamic Certificates Loader
let certificatesData = null;

// Load certificates on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadCertificates();
});

// Load certificates from JSON with automatic change detection
async function loadCertificates() {
    try {
        // Detect if we're in root or pages folder
        const isInPages = window.location.pathname.includes('/pages/');
        const jsonPath = isInPages ? '../data/certificates.json' : 'data/certificates.json';
        
        // Always fetch fresh data
        const response = await fetch(jsonPath, {
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
        const certItems = document.querySelectorAll('.certificate-item');
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
    item.className = 'certificate-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.3s ease';
    
    item.innerHTML = `
        <div class="certificate-info-simple">
            <h3 class="certificate-title">${cert.title}</h3>
            <p class="certificate-issuer">${cert.issuer}</p>
        </div>
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
