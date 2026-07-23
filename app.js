/**
 * Forno Rosso — Main Application JavaScript
 * Flat & Minimal Italian Pizza Restaurant Website
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =====================================================================
    // 1. DATA
    // =====================================================================
    const OFFERS_KEY = 'fornorosso_offers';

    const pizzaData = [
        { id: 1, name: 'Pepperoni Classic', desc: 'Classic pepperoni with mozzarella and signature tomato sauce', price: 499, badge: '20% off', tags: ['Best Seller', '9 left'], img: 'images/pizza-pepperoni.jpg' },
        { id: 2, name: 'Margherita', desc: 'Fresh basil, creamy mozzarella, San Marzano tomato sauce', price: 399, badge: '15% off', tags: ['Classic', 'Wood-Fired'], img: 'images/pizza-margherita.jpg' },
        { id: 3, name: 'BBQ Chicken', desc: 'Grilled chicken, smoky BBQ sauce, caramelized onions', price: 549, badge: '10% off', tags: ['Chef Choice', '5 left'], img: 'images/pizza-bbq-chicken.jpg' },
        { id: 4, name: 'Quattro Formaggi', desc: 'Four Italian cheese blend — mozzarella, gorgonzola, parmesan', price: 599, badge: '25% off', tags: ['Premium', 'Four Cheese'], img: 'images/pizza-four-cheese.jpg' },
        { id: 5, name: 'Veggie Supreme', desc: 'Garden-fresh vegetables, herbs, and premium olive oil', price: 449, badge: '15% off', tags: ['Vegetarian', 'Fresh'], img: 'images/pizza-veggie.jpg' },
        { id: 6, name: 'Meat Lovers', desc: 'Pepperoni, Italian sausage, crispy bacon, smoked ham', price: 649, badge: '20% off', tags: ['Popular', 'Loaded'], img: 'images/pizza-meat-lovers.jpg' }
    ];

    const testimonials = [
        { name: 'Priya Sharma', text: 'Best pizza in town! The wood-fired crust is absolutely perfect. Every bite takes you to Naples.', rating: 5 },
        { name: 'Rahul Verma', text: 'Amazing flavors and super fast delivery. The family combo is great value for money!', rating: 5 },
        { name: 'Anita Desai', text: 'Love the fresh ingredients. You can really taste the difference compared to other places.', rating: 4 },
        { name: 'Vikram Patel', text: 'The Quattro Formaggi is to die for. Premium quality at very reasonable prices.', rating: 5 },
        { name: 'Meera Krishnan', text: 'Cozy ambiance and incredible food. Perfect for date nights. Highly recommended!', rating: 5 }
    ];

    // =====================================================================
    // 2. UTILITY FUNCTIONS
    // =====================================================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = {
            success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('toast--visible'));

        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function getOffers() {
        try { return JSON.parse(localStorage.getItem(OFFERS_KEY)) || []; }
        catch { return []; }
    }

    function formatCountdown(ms) {
        if (ms <= 0) return { h: '00', m: '00', s: '00', expired: true };
        const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
        const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return { h, m, s, expired: false };
    }

    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }
        return stars;
    }

    // =====================================================================
    // 3. NAVIGATION (Scrollable Overlay + 2-line Hamburger)
    // =====================================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuLinks = document.querySelectorAll('.navbar__menu-link');

    // Sticky header background on scroll
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Hamburger toggle for full-screen overlay
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });
    }

    function openNavMenu() {
        hamburger?.classList.add('active');
        navMenu?.classList.add('active');
        navMenu?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeNavMenu() {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        navMenu?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                closeNavMenu();
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = navbar ? navbar.offsetHeight : 80;
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =====================================================================
    // 4. STORY TIMELINE ANIMATION (Feature #6)
    // =====================================================================
    const storyTimeline = document.getElementById('storyTimeline');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineNodes = document.querySelectorAll('.timeline-node');

    if (storyTimeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (timelineProgress) timelineProgress.style.height = '100%';
                    timelineNodes.forEach((node, idx) => {
                        setTimeout(() => {
                            node.classList.add('active');
                        }, idx * 250);
                    });
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        timelineObserver.observe(storyTimeline);
    }

    // =====================================================================
    // 5. SCROLL REVEAL ANIMATIONS
    // =====================================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =====================================================================
    // 6. SPECIAL OFFERS SYSTEM
    // =====================================================================
    function initDefaultOffers() {
        if (localStorage.getItem(OFFERS_KEY)) return;
        const now = Date.now();
        const defaults = [
            {
                id: String(now + 1),
                title: 'Family Combo',
                description: '2 Large Pizzas + Garlic Bread + Coke',
                originalPrice: 1499,
                offerPrice: 999,
                discount: 35,
                image: 'images/pizza-pepperoni.jpg',
                startDate: new Date(now).toISOString(),
                endDate: new Date(now + 24 * 3600000).toISOString(),
                isActive: true,
                category: 'combo'
            },
            {
                id: String(now + 2),
                title: 'Weekend Special',
                description: 'Buy 1 Get 1 Free on Medium Pizzas',
                originalPrice: 1198,
                offerPrice: 599,
                discount: 50,
                image: 'images/pizza-margherita.jpg',
                startDate: new Date(now).toISOString(),
                endDate: new Date(now + 48 * 3600000).toISOString(),
                isActive: true,
                category: 'special'
            },
            {
                id: String(now + 3),
                title: 'Lunch Deal',
                description: 'Any Personal Pizza + Drink',
                originalPrice: 449,
                offerPrice: 299,
                discount: 33,
                image: 'images/pizza-veggie.jpg',
                startDate: new Date(now).toISOString(),
                endDate: new Date(now + 12 * 3600000).toISOString(),
                isActive: true,
                category: 'combo'
            },
            {
                id: String(now + 4),
                title: 'Margherita Monday',
                description: 'Large Margherita at flat price',
                originalPrice: 649,
                offerPrice: 399,
                discount: 38,
                image: 'images/pizza-four-cheese.jpg',
                startDate: new Date(now).toISOString(),
                endDate: new Date(now + 6 * 3600000).toISOString(),
                isActive: true,
                category: 'single'
            }
        ];
        localStorage.setItem(OFFERS_KEY, JSON.stringify(defaults));
    }

    initDefaultOffers();

    const offersTrack = document.getElementById('offersTrack');
    const offersDots = document.getElementById('offersDots');
    const offersPrev = document.getElementById('offersPrev');
    const offersNext = document.getElementById('offersNext');
    let offersInterval = null;
    let currentOffer = 0;

    function renderOffers() {
        if (!offersTrack) return;
        const offers = getOffers().filter(o => o.isActive);

        if (offers.length === 0) {
            offersTrack.innerHTML = '<div class="offers__empty"><p>No active offers right now. Check back soon!</p></div>';
            return;
        }

        offersTrack.innerHTML = offers.map((offer, i) => {
            const now = Date.now();
            const endTime = new Date(offer.endDate).getTime();
            const timeLeft = endTime - now;
            const isExpired = timeLeft <= 0;
            const time = formatCountdown(timeLeft);

            return `
                <div class="offer-card ${isExpired ? 'offer-card--expired' : ''}" data-index="${i}">
                    <div class="offer-card__inner">
                        <div class="offer-card__badge"><i class="fa-solid fa-fire"></i> Today's Deal</div>
                        <div class="offer-card__discount">-${offer.discount}%</div>
                        <div class="offer-card__image">
                            <img src="${offer.image}" alt="${offer.title}" loading="lazy">
                        </div>
                        <div class="offer-card__content">
                            <h3 class="offer-card__title">${offer.title}</h3>
                            <p class="offer-card__desc">${offer.description}</p>
                            <div class="offer-card__pricing">
                                <span class="offer-card__original">₹${offer.originalPrice}</span>
                                <span class="offer-card__price">₹${offer.offerPrice}</span>
                                <span class="offer-card__save">Save ${offer.discount}%</span>
                            </div>
                            <div class="offer-card__timer" data-end="${offer.endDate}">
                                <span class="offer-card__timer-label"><i class="fa-regular fa-clock"></i> ${isExpired ? 'Offer Expired' : 'Offer ends in:'}</span>
                                <div class="offer-card__countdown ${isExpired ? 'expired' : ''}">
                                    <div class="countdown__unit">
                                        <span class="countdown__number" data-hours>${time.h}</span>
                                        <span class="countdown__label">HRS</span>
                                    </div>
                                    <span class="countdown__sep">:</span>
                                    <div class="countdown__unit">
                                        <span class="countdown__number" data-minutes>${time.m}</span>
                                        <span class="countdown__label">MIN</span>
                                    </div>
                                    <span class="countdown__sep">:</span>
                                    <div class="countdown__unit">
                                        <span class="countdown__number" data-seconds>${time.s}</span>
                                        <span class="countdown__label">SEC</span>
                                    </div>
                                </div>
                            </div>
                            <a href="#menu" class="btn btn--primary btn--lg offer-card__cta ${isExpired ? 'disabled' : ''}">
                                ${isExpired ? 'Expired' : 'Claim Offer <i class="fa-solid fa-arrow-right"></i>'}
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        startCountdowns();

        // Drag to scroll for desktop & swipe for touch
        let isDown = false;
        let startX, scrollLeft;

        offersTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - offersTrack.offsetLeft;
            scrollLeft = offersTrack.scrollLeft;
        });
        offersTrack.addEventListener('mouseleave', () => { isDown = false; });
        offersTrack.addEventListener('mouseup', () => { isDown = false; });
        offersTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - offersTrack.offsetLeft;
            const walk = (x - startX) * 1.8;
            offersTrack.scrollLeft = scrollLeft - walk;
        });
    }

    function startCountdowns() {
        setInterval(() => {
            document.querySelectorAll('.offer-card__timer').forEach(timer => {
                const endDate = new Date(timer.dataset.end).getTime();
                const now = Date.now();
                const timeLeft = endDate - now;
                const time = formatCountdown(timeLeft);
                const countdown = timer.querySelector('.offer-card__countdown');

                if (time.expired) {
                    timer.querySelector('.offer-card__timer-label').textContent = 'Offer Expired';
                    countdown?.classList.add('expired');
                    const cta = timer.closest('.offer-card__content')?.querySelector('.offer-card__cta');
                    if (cta) { cta.textContent = 'Expired'; cta.classList.add('disabled'); }
                }

                const hours = countdown?.querySelector('[data-hours]');
                const minutes = countdown?.querySelector('[data-minutes]');
                const seconds = countdown?.querySelector('[data-seconds]');
                if (hours) hours.textContent = time.h;
                if (minutes) minutes.textContent = time.m;
                if (seconds) seconds.textContent = time.s;
            });
        }, 1000);
    }

    renderOffers();

    // =====================================================================
    // 7. FOOD CARDS
    // =====================================================================
    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) {
        menuGrid.innerHTML = pizzaData.map(pizza => `
            <div class="food-card reveal">
                <div class="food-card__img-wrap">
                    <img src="${pizza.img}" alt="${pizza.name}" class="food-card__img" loading="lazy">
                    <span class="food-card__badge-tag">${pizza.badge}</span>
                    <div class="food-card__dots">
                        <span class="food-card__dot active"></span>
                        <span class="food-card__dot"></span>
                        <span class="food-card__dot"></span>
                    </div>
                </div>
                <div class="food-card__content">
                    <div class="food-card__header">
                        <h3 class="food-card__title">${pizza.name}</h3>
                        <span class="food-card__price-tag">₹${pizza.price}</span>
                    </div>
                    <p class="food-card__desc">${pizza.desc}</p>
                    <div class="food-card__tags">
                        ${pizza.tags.map(t => `<span class="food-card__tag">${t}</span>`).join('')}
                    </div>
                    <button class="food-card__btn add-to-cart-btn" data-id="${pizza.id}"><i class="fa-solid fa-cart-shopping"></i> Add to cart</button>
                </div>
            </div>
        `).join('');

        menuGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        menuGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                showToast('🍕 Added to cart! (Demo)', 'success');
            }
        });
    }

    // =====================================================================
    // 8. ACCORDION GALLERY
    // =====================================================================
    const galleryStrips = document.querySelectorAll('.gallery__strip');
    galleryStrips.forEach(strip => {
        strip.addEventListener('mouseenter', () => {
            galleryStrips.forEach(s => s.classList.remove('active'));
            strip.classList.add('active');
        });
        strip.addEventListener('click', () => {
            galleryStrips.forEach(s => s.classList.remove('active'));
            strip.classList.add('active');
        });
    });

    // =====================================================================
    // 9. RESERVATION FORM
    // =====================================================================
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('resDate')?.value;
            const time = document.getElementById('resTime')?.value;
            const guests = document.getElementById('resGuests')?.value;
            showToast(`Table reserved for ${guests} guests on ${date} at ${time}! 🍷`, 'success');
        });
    }

    // =====================================================================
    // 10. REVIEWS (Vertical Grid)
    // =====================================================================
    const reviewsGrid = document.getElementById('reviewsGrid') || document.getElementById('reviewsTrack');

    if (reviewsGrid) {
        reviewsGrid.innerHTML = testimonials.map(t => `
            <div class="review-card reveal">
                <div class="review-card__quote"><i class="fa-solid fa-quote-left"></i></div>
                <p class="review-card__text">"${t.text}"</p>
                <div class="review-card__author">
                    <div class="review-card__avatar">${t.name.charAt(0)}</div>
                    <div>
                        <h4 class="review-card__name">${t.name}</h4>
                        <div class="review-card__stars">${generateStars(t.rating)}</div>
                    </div>
                </div>
            </div>
        `).join('');

        reviewsGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    // =====================================================================
    // 11. CONTACT FORM
    // =====================================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();
            const message = document.getElementById('contactMessage')?.value.trim();

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            showToast('Message sent successfully! We\'ll get back to you soon. 🍕', 'success');
            contactForm.reset();
        });
    }

    // =====================================================================
    // 12. BACK TO TOP
    // =====================================================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =====================================================================
    // 13. BUTTON RIPPLE EFFECT
    // =====================================================================
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'btn__ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });

});
