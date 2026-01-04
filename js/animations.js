// Core animation functions
function fadeIn(element, duration = 500, delay = 0) {
    element.style.opacity = 0;
    element.style.transition = `opacity ${duration}ms ease-in`;
    element.style.display = "block";

    setTimeout(() => {
        requestAnimationFrame(() => {
            element.style.opacity = 1;
        });
    }, delay);
}

function fadeOut(element, duration = 500) {
    element.style.opacity = 1;
    element.style.transition = `opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
        element.style.opacity = 0;
    });

    setTimeout(() => {
        element.style.display = "none";
    }, duration);
}

function slideIn(element, direction = 'left', duration = 500, delay = 0) {
    const transforms = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        up: 'translateY(100%)',
        down: 'translateY(-100%)'
    };
    
    element.style.transform = transforms[direction];
    element.style.opacity = 0;
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-in`;
    element.style.display = "block";
    
    setTimeout(() => {
        requestAnimationFrame(() => {
            element.style.transform = 'translate(0)';
            element.style.opacity = 1;
        });
    }, delay);
}

function slideOut(element, direction = 'left', duration = 500) {
    const transforms = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        up: 'translateY(-100%)',
        down: 'translateY(100%)'
    };
    
    element.style.transition = `transform ${duration}ms ease-in, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
        element.style.transform = transforms[direction];
        element.style.opacity = 0;
    });

    setTimeout(() => {
        element.style.display = "none";
    }, duration);
}

// Advanced animations

// Typing animation for text
function typeAnimation(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    element.style.display = 'inline-block';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Scroll reveal animations
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    const projectCards = document.querySelectorAll('.project-card');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
    
    // Staggered animation for project cards
    const projectObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('project-reveal');
                }, 200 * index);
            });
            projectObserver.unobserve(entries[0].target);
        }
    }, observerOptions);
    
    if (projectCards.length > 0) {
        const projectSection = document.querySelector('#projects');
        projectCards.forEach(card => card.classList.add('project-hidden'));
        projectObserver.observe(projectSection);
    }
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('#hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            const translateY = scrollPosition * 0.3;
            hero.style.backgroundPositionY = `-${translateY}px`;
        }
    });
}

// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero text typing animation
    const heroText = document.querySelector('.hero-content h1');
    if (heroText) {
        const originalText = heroText.textContent;
        typeAnimation(heroText, originalText, 70);
    }
    
    // Initialize scroll animations
    initScrollReveal();
    
    // Initialize parallax effects
    initParallaxEffect();
});