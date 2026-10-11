document.addEventListener('DOMContentLoaded', function() {
    
    // Animate stats counter
    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat);
                    }
                });
            }
        });
    }, observerOptions);
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Simulate form submission
        formMessage.className = 'form-message';
        formMessage.textContent = 'Sending message...';
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            // Store in sessionStorage (simulating backend)
            const messages = JSON.parse(sessionStorage.getItem('contactMessages') || '[]');
            messages.push({
                ...formData,
                timestamp: new Date().toISOString()
            });
            sessionStorage.setItem('contactMessages', JSON.stringify(messages));
            
            formMessage.className = 'form-message success';
            formMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Thank you! Your message has been sent successfully.
            `;
            
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
    
    // Work item click handler
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const workItem = this.closest('.work-item');
            const title = workItem.querySelector('h3').textContent;
            alert(`Opening project: ${title}\n\nThis would navigate to the project detail page.`);
        });
    });
    
    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.transform = `translateY(${scrolled * (0.1 + index * 0.05)}px)`;
        });
    });
});
