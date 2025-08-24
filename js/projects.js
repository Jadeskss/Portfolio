// Projects and Certificates Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize project filters
    initFilters('#projects .filter-btn', '.project-card');
    
    // Initialize certificate filters
    initFilters('#certificates .filter-btn', '.certificate-card');
    
    // Add flip functionality
    initProjectCardFlip();
});

// Filter initialization function
function initFilters(filterSelector, itemSelector) {
    const filterBtns = document.querySelectorAll(filterSelector);
    const items = document.querySelectorAll(itemSelector);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide items based on filter
            items.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    if (item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// Project card flip functionality
function initProjectCardFlip() {
    const infoToggleBtns = document.querySelectorAll('.project-info-toggle');
    
    infoToggleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.project-card');
            const cardInner = card.querySelector('.project-card-inner');
            
            cardInner.style.transform = 
                cardInner.style.transform === 'rotateY(180deg)' ? 
                'rotateY(0deg)' : 'rotateY(180deg)';
        });
    });
    
    // Allow clicking on back side to flip back
    document.querySelectorAll('.project-card-back').forEach(back => {
        back.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('project-content')) {
                const cardInner = this.parentElement;
                cardInner.style.transform = 'rotateY(0deg)';
            }
        });
    });
}
