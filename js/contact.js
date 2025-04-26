// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("Contact form script loaded");
    
    // Get form elements immediately
    const contactForm = document.getElementById('contactForm');
    const statusElement = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!contactForm || !statusElement || !submitBtn) {
      console.error("Required form elements not found");
      return;
    }
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
      console.error("EmailJS is not available");
      statusElement.innerHTML = '<div class="alert alert-error">Email service is not available. Please try again later.</div>';
      // Disable the submit button
      submitBtn.disabled = true;
      return;
    }
    
    // If EmailJS is already ready, initialize the form now
    if (window.emailJSReady) {
      setupFormHandler();
    }
    
    // Setup the form handler function - will be called once EmailJS is ready
    function setupFormHandler() {
      console.log("Setting up contact form handler");
      
      // Double-check EmailJS availability before setting up the handler
      if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
        console.error("EmailJS send function is not available");
        statusElement.innerHTML = '<div class="alert alert-error">Email service is not available. Please try again later.</div>';
        alert("Email sending service is not available. The contact form has been disabled.");
        submitBtn.disabled = true;
        return;
      }
      
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Form submitted");
        
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const subject = contactForm.subject.value.trim();
        const message = contactForm.message.value.trim();
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          statusElement.innerHTML = '<div class="alert alert-error">Please enter a valid email address</div>';
          return;
        }
        
        if (!name || !email || !subject || !message) {
          statusElement.innerHTML = '<div class="alert alert-error">Please fill all fields</div>';
          return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
          // Use your provided credentials
          emailjs.send('service_1ik8t97', 'template_r3lre0d', {
            from_name: name,    // Match the template variables
            from_email: email,
            subject: subject,
            message: message
          }, 'uzL2p9Mjna5Ahmf8O') // Add the public key as the fourth parameter
          .then(function(response) {
            console.log('SUCCESS!', response);
            statusElement.innerHTML = '<div class="alert alert-success">Message sent successfully!</div>';
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
          })
          .catch(function(error) {
            console.error("EmailJS sending failed:", error);
            // Log more details about the error
            if (error.status) {
              console.error(`Status code: ${error.status}`);
            }
            if (error.text) {
              console.error(`Error message: ${error.text}`);
            }
            
            statusElement.innerHTML = `<div class="alert alert-error">Failed to send message. Error: ${error.status || "Unknown"}. Please try again.</div>`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
          });
        } catch (e) {
          console.error("Error trying to send email:", e);
          statusElement.innerHTML = '<div class="alert alert-error">Email service encountered an error. Please try again later.</div>';
          alert("Email sending failed. Please try again later or contact directly at the email address shown.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        }
      });
    }
    
    // Make the function globally accessible so the EmailJS loader can call it
    window.initContactForm = setupFormHandler;
  });