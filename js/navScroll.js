// Hide navbar on scroll down, show on scroll up for mobile devices
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  const scrollThreshold = 10; // Minimum scroll amount before toggling
  
  // Only enable this behavior on small screens
  const enableScrollBehavior = () => window.innerWidth < 768;
  
  window.addEventListener('scroll', function() {
    if (!enableScrollBehavior()) {
      header.classList.remove('nav-hidden');
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Detect scroll direction with threshold to prevent tiny movements triggering it
    if (scrollTop > lastScrollTop + scrollThreshold) {
      // Scrolling down
      header.classList.add('nav-hidden');
      
    } else if (scrollTop < lastScrollTop - scrollThreshold) {
      // Scrolling up
      header.classList.remove('nav-hidden');
    }
    
    // Special case: At the top of the page, always show navbar
    if (scrollTop === 0) {
      header.classList.remove('nav-hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
  }, { passive: true });
  
  // Recalculate on resize
  window.addEventListener('resize', function() {
    if (!enableScrollBehavior()) {
      header.classList.remove('nav-hidden');
    }
  });
});