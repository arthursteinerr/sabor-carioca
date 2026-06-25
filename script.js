document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.querySelector('.main-header');
    const scrollThreshold = 50;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    /* ==========================================================================
       MOBILE MENU TOGGLE WITH ACCESSIBILITY
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isActive = menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Update ARIA attribute for screen readers
        menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        
        if (isActive) {
            // Focus first menu item for keyboard navigation when opened
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    };

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ==========================================================================
       ACTIVE SECTION HIGHLIGHTER ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const highlightSection = () => {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140; // Offset for sticky header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
                if (activeLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    activeLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightSection, { passive: true });

    /* ==========================================================================
       REVIEWS CAROUSEL / SLIDER (RESPONSIVE)
       ========================================================================== */
    const reviewsWrapper = document.getElementById('reviewsWrapper');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlideIndex = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        // Only run slider transition if screen width is 1024px or less
        if (window.innerWidth > 1024) {
            reviewsWrapper.style.transform = 'none';
            return;
        }

        if (index >= dots.length) index = 0;
        if (index < 0) index = dots.length - 1;
        
        currentSlideIndex = index;
        
        // Translate the wrapper
        reviewsWrapper.style.transform = `translateX(-${currentSlideIndex * 33.333}%)`;
        
        // Update dots status
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlideIndex].classList.add('active');
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            if (window.innerWidth <= 1024) {
                showSlide(currentSlideIndex + 1);
            }
        }, 5000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Attach click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Handle screen resizing to reset translation on desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            reviewsWrapper.style.transform = 'none';
        } else {
            showSlide(currentSlideIndex);
        }
    });

    // Initialize Auto Slider
    startAutoSlide();

    // Pause auto slide on hover
    const sliderContainer = document.querySelector('.reviews-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    /* ==========================================================================
       GALLERY LIGHTBOX (IMAGE ONLY WITH A11Y FOCUS TRAP)
       ========================================================================== */
    const imageLightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    let lastActiveElement = null;
    
    // Store image details
    const galleryImages = [
        {
            src: 'Imagens/restaurantesaborcariocamg_519152984_17896140108254838_8899478099880964795_n.webp',
            alt: 'Prato comercial Carioca servido com arroz, feijão, fritas e bife grelhado'
        },
        {
            src: 'Imagens/restaurantesaborcariocamg_520874511_17896140126254838_1936567384517833618_n.webp',
            alt: 'Contra filé suculento acebolado grelhado na chapa do restaurante Sabor Carioca'
        },
        {
            src: 'Imagens/restaurantesaborcariocamg_527527891_17898177981254838_8077177265146286544_n.webp',
            alt: 'Marmitex montado com arroz soltinho, feijão especial e frango grelhado por cima'
        }
    ];

    window.openLightbox = (index) => {
        if (index >= 0 && index < galleryImages.length) {
            lastActiveElement = document.activeElement; // Save focus
            
            lightboxImg.src = galleryImages[index].src;
            lightboxImg.alt = galleryImages[index].alt;
            lightboxCaption.textContent = galleryImages[index].alt;
            
            imageLightbox.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Focus the close button for accessibility
            setTimeout(() => {
                lightboxCloseBtn.focus();
            }, 50);
        }
    };

    window.closeImageLightbox = () => {
        imageLightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        // Return focus to the original button
        if (lastActiveElement) {
            lastActiveElement.focus();
        }
    };

    // Close image lightbox on background click
    imageLightbox.addEventListener('click', (e) => {
        if (e.target === imageLightbox || e.target.classList.contains('lightbox-close')) {
            closeImageLightbox();
        }
    });

    // Focus trapping inside the Lightbox modal (only close button is interactive)
    imageLightbox.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            lightboxCloseBtn.focus(); // Loop focus to close button
        }
    });

    // Keyboard support (Escape key to close modal/menu)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageLightbox();
            closeMenu();
        }
    });

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, remove observer for performance
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.12 // Element is 12% visible
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }
});
