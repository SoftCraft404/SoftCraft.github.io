// ==========================================
// CONFIGURACIÓN
// ==========================================
const CONFIG = {
    typingSpeed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
    scrollOffset: 100
};

// ==========================================
// UTILIDADES
// ==========================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==========================================
// NAVEGACIÓN MÓVIL
// ==========================================
const initMobileMenu = () => {
    const menuToggle = $('#menuToggle');
    const navLinks = $('#navLinks');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    $$('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
};

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
const initNavbarScroll = () => {
    const navbar = $('#navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
};

// ==========================================
// TYPING EFFECT
// ==========================================
const initTypingEffect = () => {
    const texts = ['Desarrollador Full Stack', 'Cybersecurity Expert', 'Cloud Architect', 'DevOps Engineer', 'Freelancer'];
    const typingElement = $('#typingText');
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? CONFIG.deleteSpeed : CONFIG.typingSpeed;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = CONFIG.pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };

    type();
};

// ==========================================
// SCROLL REVEAL
// ==========================================
const initScrollReveal = () => {
    const revealElements = $$('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - CONFIG.scrollOffset) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
};

// ==========================================
// SKILL BARS ANIMATION
// ==========================================
const initSkillBars = () => {
    const skillSection = $('.skills');
    let animated = false;

    const animateSkills = () => {
        if (animated) return;
        
        const sectionTop = skillSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - CONFIG.scrollOffset) {
            $$('.progress-fill').forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                }, index * 100);
            });
            animated = true;
        }
    };

    window.addEventListener('scroll', animateSkills);
};

// ==========================================
// STATS COUNTER
// ==========================================
const initStatsCounter = () => {
    const statsSection = $('.stats');
    let counted = false;

    const animateStats = () => {
        if (counted) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - CONFIG.scrollOffset) {
            $$('.stat-number').forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target + (target === 24 ? '/7' : '+');
                    }
                };

                updateCounter();
            });
            counted = true;
        }
    };

    window.addEventListener('scroll', animateStats);
};

// ==========================================
// PARALLAX EFFECT
// ==========================================
const initParallax = () => {
    const floatIcons = $$('.float-icon');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatIcons.forEach((icon, index) => {
            const speed = 0.5 + (index * 0.1);
            const rotation = scrolled * 0.05;
            icon.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
        });
    });
};

// ==========================================
// SMOOTH SCROLL
// ==========================================
const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ==========================================
// FORM HANDLING
// ==========================================
const initContactForm = () => {
    const form = $('#contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        
        try {
            // Si usas Formspree, el form se enviará automáticamente
            // Si no, simulamos el envío
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
            form.reset();
        } catch (error) {
            showNotification('Hubo un error. Por favor intenta de nuevo.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
};

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
const showNotification = (message, type = 'success') => {
    const existing = $('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${type === 'success' ? '✓' : '✕'}</span>
            <p>${message}</p>
        </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00f0ff, #7000ff)' : 'linear-gradient(135deg, #ff006e, #ff4d6d)'};
        color: #0a0a0f;
        padding: 20px 25px;
        border-radius: 15px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 40px rgba(0, 240, 255, 0.3);
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
};

// ==========================================
// TILT EFFECT (Opcional - para tarjetas)
// ==========================================
const initTiltEffect = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Desactivar en móvil
    
    $$('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNavbarScroll();
    initTypingEffect();
    initScrollReveal();
    initSkillBars();
    initStatsCounter();
    initParallax();
    initSmoothScroll();
    initContactForm();
    initTiltEffect();
    
    console.log('🚀 Portfolio cargado exitosamente');
});