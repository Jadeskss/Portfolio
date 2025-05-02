// Chat Modal Controller
document.addEventListener('DOMContentLoaded', function() {
  // ============= DOM ELEMENTS =============
  const chatButton = document.getElementById('chatButton');
  const chatModal = document.getElementById('chatModal');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatFormStatus = document.getElementById('chat-form-status');
  const chatSubmitBtn = document.getElementById('chat-submit-btn');
  const chatModalHeader = document.querySelector('.chat-modal-header');
  
  // Enhanced selector to capture ALL contact links across the site
  const contactLinks = document.querySelectorAll('#contactLink, .btn-outline[href="#contact"], a[href="#contact"], .contact-me-btn');
  
  // ============= STATE MANAGEMENT =============
  let isModalVisible = false;
  
  // ============= MODAL FUNCTIONALITY =============
  /**
   * Opens the chat modal and shows the email unavailable notice
   */
  
  function openChatModal() {
    chatModal.classList.add('active');
    isModalVisible = true;
    
    // Add email not available notice
    if (!document.getElementById('email-notice')) {
      const noticeDiv = document.createElement('div');
      noticeDiv.id = 'email-notice';
      noticeDiv.className = 'alert alert-info';
      noticeDiv.innerHTML = '<i class="fas fa-info-circle"></i> Alert: Email functionality is currently unavailable.';
      chatFormStatus.innerHTML = '';
      chatFormStatus.appendChild(noticeDiv);
    }
    
    // Focus on the first form field after a slight delay to allow animation
    setTimeout(() => {
      const nameField = document.getElementById('chat-name');
      if (nameField) nameField.focus();
    }, 300);
    
    // Add active class to modal header for animation
    if (chatModalHeader) chatModalHeader.classList.add('active');
  }
  
  /**
   * Closes the chat modal with animation
   */
  function closeModal() {
    if (!isModalVisible) return;
    
    chatModal.classList.remove('active');
    isModalVisible = false;
    
    // Reset focus to chat button
    setTimeout(() => {
      chatButton.focus();
    }, 300);
    
    // Remove active class from modal header
    if (chatModalHeader) chatModalHeader.classList.remove('active');
  }
  
  // ============= EVENT LISTENERS =============
  // Open modal events
  chatButton.addEventListener('click', openChatModal);
  
  // Make all contact links open the chat
  contactLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        openChatModal();
      });
    }
  });
  
  // Close modal events
  if (chatClose) {
    chatClose.addEventListener('click', closeModal);
  }
  
  // Close when clicking outside
  document.addEventListener('click', function(event) {
    if (isModalVisible && 
        !chatModal.contains(event.target) && 
        !chatButton.contains(event.target)) {
      closeModal();
    }
  });
  
  // Prevent modal from closing when clicking inside it
  chatModal.addEventListener('click', function(event) {
    event.stopPropagation();
  });
  
  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isModalVisible) {
      closeModal();
    }
  });
  
  // ============= FORM STYLING & VALIDATION =============
  // Add focus styling to form fields
  const formInputs = document.querySelectorAll('.chat-modal .form-input');
  formInputs.forEach(input => {
    // Add focused class on focus
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    // Remove focused class on blur
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
    
    // Real-time validation feedback
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.remove('valid');
        if (input.value.trim() !== '') {
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
        }
      }
    });
  });
  
  // ============= FORM SUBMISSION =============
  // Initialize EmailJS
  try {
    emailjs.init("uzL2p9Mjna5Ahmf8O");
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("EmailJS initialization error:", error);
  }
  
  // Handle form submission with EmailJS
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    chatSubmitBtn.disabled = true;
    chatSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Get form data
    const name = document.getElementById('chat-name').value;
    const email = document.getElementById('chat-email').value;
    const message = document.getElementById('chat-message').value;
    
    // Prepare template parameters
    const templateParams = {
      name: name,
      email: email,
      message: message,
      to_email: "jademadriaga6@gmail.com"
    };
    
    // Send email using EmailJS
    emailjs.send("service_2br0hy9", "template_r3lre0d", templateParams)
      .then(function(response) {
        console.log("Email sent successfully!", response);
        chatFormStatus.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Message sent successfully!</div>';
        chatForm.reset();
        
        // Reset form state
        setTimeout(() => {
          chatSubmitBtn.disabled = false;
          chatSubmitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
          
          // Reset validation classes
          formInputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
          });
        }, 1000);
      }, function(error) {
        console.log("Failed to send email:", error);
        chatFormStatus.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again later.</div>';
        
        // Re-enable button
        chatSubmitBtn.disabled = false;
        chatSubmitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      });
  });
  
  // ============= INITIALIZATION =============
  // Ensure chat button is keyboard accessible
  if (chatButton && !chatButton.hasAttribute('tabindex')) {
    chatButton.setAttribute('tabindex', '0');
  }
  
  // Make sure the heroContactBtn opens the chat modal
  const heroContactBtn = document.getElementById('heroContactBtn');
  if (heroContactBtn) {
    heroContactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openChatModal();
    });
  }
});