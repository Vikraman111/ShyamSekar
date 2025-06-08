document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    let isMenuOpen = false;

    // Scroll-based navbar size reduction
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle menu function
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        // Toggle active class on button
        mobileMenuBtn.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        
        // Toggle menu visibility with animation
        if (isMenuOpen) {
            navLinks.style.display = 'flex';
            setTimeout(() => {
                navLinks.style.transform = 'translateY(0)';
                navLinks.style.opacity = '1';
            }, 10);
        } else {
            navLinks.style.transform = 'translateY(-20px)';
            navLinks.style.opacity = '0';
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 300);
        }
    }

    // Add click event to menu button
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !e.target.closest('.navbar')) {
            toggleMenu();
        }
    });

    // EmailJS Configuration
    emailjs.init('u8SuxgID3IxydmQgC'); // Your public key

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Form validation function
    function validateForm(name, email, message) {
        const errors = [];
        
        if (!name.trim()) {
            errors.push('Name is required');
        }
        
        if (!email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!message.trim()) {
            errors.push('Message is required');
        }
        
        return errors;
    }

    // Contact Form Functionality
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        // Real-time email validation
        const emailInput = contactForm.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email && !isValidEmail(email)) {
                    this.style.borderColor = '#dc3545';
                    showFormStatus('⚠️ Please enter a valid email address', 'warning');
                } else {
                    this.style.borderColor = '';
                    if (formStatus.style.display === 'block' && formStatus.textContent.includes('valid email')) {
                        formStatus.style.display = 'none';
                    }
                }
            });
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate form
            const validationErrors = validateForm(name, email, message);
            if (validationErrors.length > 0) {
                showFormStatus('❌ ' + validationErrors.join(', '), 'error');
                return;
            }

            const templateParams = {
                name: name,
                email: email,
                message: message
            };

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send email using EmailJS
            emailjs.send('service_ov88owr', 'template_5mo1fxc', templateParams)
                .then(function(response) {
                    // Success
                    showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    // Reset any validation styling
                    emailInput.style.borderColor = '';
                }, function(error) {
                    // Error
                    console.error('EmailJS error:', error);
                    showFormStatus('❌ Failed to send message. Please try again or contact directly.', 'error');
                })
                .finally(function() {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        if (type === 'success') {
            formStatus.style.backgroundColor = '#d4edda';
            formStatus.style.color = '#155724';
            formStatus.style.border = '1px solid #c3e6cb';
        } else {
            formStatus.style.backgroundColor = '#f8d7da';
            formStatus.style.color = '#721c24';
            formStatus.style.border = '1px solid #f5c6cb';
        }

        // Hide status after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});
