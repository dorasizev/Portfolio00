// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-toggle i');
const contactForm = document.querySelector('.contact-form');

// Entrance animation loader
const siteLoader = document.getElementById('site-loader');
if (siteLoader) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        siteLoader.classList.add('hide');
        document.body.style.overflow = '';
        setTimeout(() => siteLoader.remove(), 800);
    }, 1700);
}

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        // Only prevent default and smooth scroll for in-page anchors
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Theme Toggle Functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', toggleTheme);

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Scroll Animation for Elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .stat, .contact-method');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Contact Form Handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
function initializeTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
}

// Parallax effect for hero section
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Skill progress animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 100);
    });
}

// Project card hover effects
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Scroll to top functionality
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize all functionality
function initializePortfolio() {
    initializeTheme();
    initializeTypingAnimation();
    initializeExperienceTypingAnimation();
    initializeHeroTypingAnimation();
    createScrollToTopButton();
    initializeProjectCards();
    
    // Event listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        animateOnScroll();
        parallaxEffect();
    });
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Initial animations
    setTimeout(() => {
        animateSkills();
    }, 1000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .skill-item, .project-card, .stat, .contact-method {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .skill-item.animate, .project-card.animate, .stat.animate, .contact-method.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .scroll-to-top:hover {
        transform: translateY(-3px) !important;
        box-shadow: var(--shadow-heavy) !important;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
    animateOnScroll();
    parallaxEffect();
}, 16)); // ~60fps 

// Project category tab switching for projects.html
if (window.location.pathname.endsWith('projects.html')) {
    const tabs = document.querySelectorAll('.projects-tab');
    const categories = document.querySelectorAll('.project-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Hide all categories
            categories.forEach(cat => (cat.style.display = 'none'));
            // Activate clicked tab
            tab.classList.add('active');
            // Show selected category
            const cat = document.querySelector(`.project-category[data-category="${tab.dataset.category}"]`);
            if (cat) cat.style.display = '';
        });
    });
} 

// Typing animation for Experience section (skills/titles)
function initializeExperienceTypingAnimation() {
    const expTyping = document.getElementById('experience-typing');
    if (expTyping) {
        const expSkills = [
            'Cyber Security Engineer',
            'Network Security',
            'Data Security',
            'Web Security',
            'Penetration Testing',
            'CTF',
        ];
        let expIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 90;
        let pauseTime = 1200;

        function typeExpSkill() {
            const current = expSkills[expIndex];
            if (isDeleting) {
                expTyping.textContent = current.substring(0, charIndex--);
                if (charIndex < 0) {
                    isDeleting = false;
                    expIndex = (expIndex + 1) % expSkills.length;
                    setTimeout(typeExpSkill, 400);
                } else {
                    setTimeout(typeExpSkill, typingSpeed / 2);
                }
            } else {
                expTyping.textContent = current.substring(0, charIndex++);
                if (charIndex > current.length) {
                    isDeleting = true;
                    setTimeout(typeExpSkill, pauseTime);
                } else {
                    setTimeout(typeExpSkill, typingSpeed);
                }
            }
        }
        typeExpSkill();
    }
}

// Typing animation for Hero section (skills/titles)
function initializeHeroTypingAnimation() {
    const heroTyping = document.getElementById('hero-typing');
    if (heroTyping) {
        const heroSkills = [
            'Junior Cyber Security Engineer',
            'Network Security',
            'Data Security',
            'Web Security',
            'Penetration Testing',
            'CTF',
        ];
        let heroIndex = 0;
        let heroCharIndex = 0;
        let heroIsDeleting = false;
        let heroTypingSpeed = 90;
        let heroPauseTime = 1200;

        function typeHeroSkill() {
            const current = heroSkills[heroIndex];
            if (heroIsDeleting) {
                heroTyping.textContent = current.substring(0, heroCharIndex--);
                if (heroCharIndex < 0) {
                    heroIsDeleting = false;
                    heroIndex = (heroIndex + 1) % heroSkills.length;
                    setTimeout(typeHeroSkill, 400);
                } else {
                    setTimeout(typeHeroSkill, heroTypingSpeed / 2);
                }
            } else {
                heroTyping.textContent = current.substring(0, heroCharIndex++);
                if (heroCharIndex > current.length) {
                    heroIsDeleting = true;
                    setTimeout(typeHeroSkill, heroPauseTime);
                } else {
                    setTimeout(typeHeroSkill, heroTypingSpeed);
                }
            }
        }
        typeHeroSkill();
    }
} 

// Main tab switching for projects.html (Logical/Creative Work)
if (window.location.pathname.endsWith('projects.html')) {
    const mainTabs = document.querySelectorAll('.main-tab');
    const groups = document.querySelectorAll('.projects-group');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all main tabs
            mainTabs.forEach(t => t.classList.remove('active'));
            // Hide all groups
            groups.forEach(g => (g.style.display = 'none'));
            // Activate clicked tab
            tab.classList.add('active');
            // Show selected group
            const group = document.querySelector(`.projects-group[data-group="${tab.dataset.group}"]`);
            if (group) group.style.display = '';
            // Set first sub-tab active and show its category
            const subTabs = group.querySelectorAll('.projects-tab');
            const categories = group.querySelectorAll('.project-category');
            subTabs.forEach((st, i) => {
                if (i === 0) {
                    st.classList.add('active');
                    categories[i].style.display = '';
                } else {
                    st.classList.remove('active');
                    categories[i].style.display = 'none';
                }
            });
        });
    });

    // Sub-tab switching (per group)
    document.querySelectorAll('.projects-group').forEach(group => {
        const tabs = group.querySelectorAll('.projects-tab');
        const categories = group.querySelectorAll('.project-category');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                categories.forEach(cat => (cat.style.display = 'none'));
                tab.classList.add('active');
                const cat = group.querySelector(`.project-category[data-category="${tab.dataset.category}"]`);
                if (cat) cat.style.display = '';
            });
        });
    });
} 

// Interactive skill icons: floating effect on click, all texts always visible
function setupSkillIconText() {
    document.querySelectorAll('.skill-items').forEach(skillGroup => {
        skillGroup.querySelectorAll('.skill-icon-text').forEach(iconText => {
            iconText.addEventListener('click', function (e) {
                const parentItem = iconText.closest('.skill-item');
                parentItem.classList.toggle('active');
                iconText.classList.toggle('active');
            });
        });
    });
}
setupSkillIconText(); 

// Floating skill window: show on icon click, hide on outside click or second click
function setupSkillFloatWindow() {
    document.querySelectorAll('.skill-icon-text').forEach(iconText => {
        const floatWindow = iconText.querySelector('.skill-float-window');
        iconText.addEventListener('click', function (e) {
            e.stopPropagation();
            // Hide all others
            document.querySelectorAll('.skill-float-window.show').forEach(win => {
                if (win !== floatWindow) win.classList.remove('show');
            });
            // Toggle this one
            floatWindow.classList.toggle('show');
        });
    });
    // Hide on outside click
    document.addEventListener('click', function () {
        document.querySelectorAll('.skill-float-window.show').forEach(win => win.classList.remove('show'));
    });
}
setupSkillFloatWindow(); 

// Improved binary animation for dorasi zevta name in hero section
(function binaryNameAnim() {
    const el = document.getElementById('binary-anim');
    if (!el) return;
    const original = 'dorasi zevta';
    let animating = false;
    function animateBinary() {
        if (animating) return;
        animating = true;
        let steps = 12;
        let current = original.split('');
        let interval = setInterval(() => {
            let display = current.map((c, i) => {
                if (c === ' ') return ' ';
                return Math.random() > 0.5 ? (Math.random() > 0.5 ? '0' : '1') : original[i];
            });
            el.textContent = display.join('');
            steps--;
            if (steps <= 0) {
                clearInterval(interval);
                el.textContent = original;
                setTimeout(() => {
                    animating = false;
                    setTimeout(animateBinary, 1200);
                }, 600);
            }
        }, 70);
    }
    animateBinary();
})(); 

(function(){
    emailjs.init("SaAabZKOAAv49pqVv");
})(); 

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_drsizvta', 'template_j7ghk9s', this)
        .then(function() {
            alert('Message sent successfully!');
        }, function(error) {
            alert('Failed to send message. Please try again.');
            console.log('FAILED...', error);
        });
}); 

// Skill level tab for Tools, Operating Systems, and Tech Stack section
function setupToolLevelTabs() {
    // For Tools, Operating Systems, and Tech Stack sections
    document.querySelectorAll('.skill-category h3').forEach((h3) => {
        if (["Tools", "Operating Systems", "Tech Stack"].includes(h3.textContent.trim())) {
            const category = h3.closest('.skill-category');
            if (!category) return;
            category.querySelectorAll('.skill-item').forEach(item => {
                if (!item.querySelector('.tool-level-tab')) {
                    const tab = document.createElement('span');
                    tab.className = 'tool-level-tab';
                    tab.textContent = `${item.textContent.trim()} : ${item.getAttribute('data-level')}`;
                    item.appendChild(tab);
                }
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    category.querySelectorAll('.skill-item').forEach(i => {
                        if (i !== item) i.classList.remove('show-level');
                    });
                    item.classList.toggle('show-level');
                });
            });
        }
    });
    // Hide on outside click
    document.addEventListener('click', function() {
        document.querySelectorAll('.skill-item.show-level').forEach(i => i.classList.remove('show-level'));
    });
}
setupToolLevelTabs(); 

// Typing animation for Creative Work & Logical Work hero section (creative-work.html)
function initializeCreativeTypingAnimation() {
    console.log('init creative typing');
    const creativeTyping = document.getElementById('creative-typing');
    if (creativeTyping) {
        const creativeSkills = [
            'Graphic Design',
            '3D Art',
            'Music Production',
            'Web Development',
            'App Development',
            'Game Development',
            'Robotic (Arduino)',
        ];
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 90;
        let pauseTime = 1200;

        function typeSkill() {
            const current = creativeSkills[index];
            if (isDeleting) {
                creativeTyping.textContent = current.substring(0, charIndex--);
                if (charIndex < 0) {
                    isDeleting = false;
                    index = (index + 1) % creativeSkills.length;
                    setTimeout(typeSkill, 400);
                } else {
                    setTimeout(typeSkill, typingSpeed / 2);
                }
            } else {
                creativeTyping.textContent = current.substring(0, charIndex++);
                if (charIndex > current.length) {
                    isDeleting = true;
                    setTimeout(typeSkill, pauseTime);
                } else {
                    setTimeout(typeSkill, typingSpeed);
                }
            }
        }
        typeSkill();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    initializeCreativeTypingAnimation();
}); 