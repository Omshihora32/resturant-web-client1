/**
 * Forno Rosso — 100% Pure Vegetarian Artisan Pizza
 * Main Application Logic & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =====================================================================
    // 1. DATASETS (Pure Vegetarian Menu, Testimonials & Initial Offers)
    // =====================================================================
    const OFFERS_STORAGE_KEY = 'fornorosso_veg_offers';
    const CART_STORAGE_KEY = 'fornorosso_veg_cart';
    const THEME_STORAGE_KEY = 'fornorosso_theme';

    // 100% Pure Vegetarian Menu Items
    const pizzaMenuData = [
        {
            id: 1,
            name: 'Margherita Supreme',
            category: 'pizza',
            desc: 'Fresh basil leaves, creamy 100% dairy mozzarella, San Marzano tomato sauce',
            price: 399,
            calories: '420 kcal',
            badge: '🌱 Classic',
            dietary: ['jain', 'all'],
            tags: ['Best Seller', 'Stone Oven'],
            img: 'images/pizza-margherita.jpg'
        },
        {
            id: 2,
            name: 'Farmhouse Veggie Delight',
            category: 'pizza',
            desc: 'Crunchy bell peppers, sweet corn, crisp onions, ripe tomatoes & fresh mushrooms',
            price: 499,
            calories: '480 kcal',
            badge: '🌱 Fresh Farm',
            dietary: ['all', 'gf'],
            tags: ['Popular', 'Organic'],
            img: 'images/pizza-veggie.jpg'
        },
        {
            id: 3,
            name: 'Quattro Formaggi (Four Cheese)',
            category: 'pizza',
            desc: 'Creamy mozzarella, rich gorgonzola, smoked gouda, and aged parmesan',
            price: 599,
            calories: '540 kcal',
            badge: '🧀 Premium Cheese',
            dietary: ['all'],
            tags: ['Chef Choice', 'Rich Cheese'],
            img: 'images/pizza-four-cheese.jpg'
        },
        {
            id: 4,
            name: 'Fiery Jalapeño & Paneer',
            category: 'pizza',
            desc: 'Marinated cottage cheese cubes, pickled jalapeños, red paprika & chili oil drizzle',
            price: 549,
            calories: '510 kcal',
            badge: '🌶️ Spicy',
            dietary: ['spicy', 'all'],
            tags: ['Spicy Veg', 'Wood-Fired'],
            img: 'images/hero-pizza.jpg'
        },
        {
            id: 5,
            name: 'Jain Special Herb Garden',
            category: 'pizza',
            desc: 'Strictly No Onion & No Garlic. Baby spinach, cherry tomatoes, sweet corn & basil pesto',
            price: 479,
            calories: '410 kcal',
            badge: '🧅 No Onion Garlic',
            dietary: ['jain', 'all'],
            tags: ['100% Jain Pure', 'Light & Fresh'],
            img: 'images/pizza-margherita.jpg'
        },
        {
            id: 6,
            name: 'Truffle Wild Mushroom',
            category: 'pizza',
            desc: 'Sautéed wild mushrooms, white truffle oil, caramelized shallots & mozzarella',
            price: 649,
            calories: '490 kcal',
            badge: '✨ Gourmet',
            dietary: ['all'],
            tags: ['Gourmet Special', 'Artisan'],
            img: 'images/pizza-veggie.jpg'
        },
        {
            id: 7,
            name: 'Stuffed Cheesy Garlic Breadstix',
            category: 'garlic-bread',
            desc: 'Freshly baked sourdough breadstix loaded with melted mozzarella & garlic butter',
            price: 249,
            calories: '320 kcal',
            badge: '🥖 Side Favorite',
            dietary: ['all'],
            tags: ['Cheesy', 'Fresh Baked'],
            img: 'images/gallery-6.jpg'
        },
        {
            id: 8,
            name: 'Creamy Pesto Veggie Alfredo',
            category: 'pasta',
            desc: 'Penne pasta tossed in handcrafted basil pesto cream sauce with organic veggies',
            price: 349,
            calories: '450 kcal',
            badge: '🍝 Artisan Pasta',
            dietary: ['jain', 'all'],
            tags: ['Pesto Cream', 'Italian'],
            img: 'images/gallery-3.jpg'
        },
        {
            id: 9,
            name: 'Italian Paneer Panini Sandwich',
            category: 'sandwich',
            desc: 'Grilled ciabatta bread filled with spiced paneer, roasted peppers & mint mayo',
            price: 279,
            calories: '380 kcal',
            badge: '🥪 Fresh Grilled',
            dietary: ['all'],
            tags: ['Panini', 'Crispy'],
            img: 'images/gallery-5.jpg'
        },
        {
            id: 10,
            name: 'Sparkling Italian Blood Orange',
            category: 'beverages',
            desc: 'Refreshing sparkling Italian beverage made with pure Sicilian blood oranges',
            price: 149,
            calories: '120 kcal',
            badge: '🍹 Chilled',
            dietary: ['all', 'jain'],
            tags: ['Imported', 'Refreshing'],
            img: 'images/gallery-4.jpg'
        },
        {
            id: 11,
            name: 'Warm Belgian Chocolate Tiramisu',
            category: 'desserts',
            desc: 'Eggless espresso-soaked ladyfingerslayered with mascarpone & cocoa powder',
            price: 299,
            calories: '360 kcal',
            badge: '🍰 100% Eggless',
            dietary: ['all', 'jain'],
            tags: ['Eggless Dessert', 'Sweet Finish'],
            img: 'images/gallery-1.jpg'
        }
    ];

    // Verified Pure Veg Customer Reviews
    const testimonialsData = [
        {
            name: 'Ananya Sharma',
            text: 'Finding an authentic 100% pure vegetarian wood-fired pizza place in town was a dream! The Margherita Supreme with fresh basil is heavenly.',
            rating: 5,
            source: 'Google Reviews',
            verified: true,
            avatar: 'A'
        },
        {
            name: 'Rohan Mehta (Jain Guest)',
            text: 'I am extremely strict about my Jain dietary needs. Forno Rosso’s dedicated Jain pizza preparation gives me total peace of mind and amazing taste!',
            rating: 5,
            source: 'Zomato Verified',
            verified: true,
            avatar: 'R'
        },
        {
            name: 'Priyanka & Vivek Kapoor',
            text: 'The 48-hour sourdough crust is super light and never leaves you feeling bloated. The weekend offers are unbeatable value.',
            rating: 5,
            source: 'Google Reviews',
            verified: true,
            avatar: 'P'
        }
    ];

    // Initial Special Offers Dataset (Synchronized with Owner Portal & LocalStorage)
    function getInitialOffers() {
        const now = Date.now();
        return [
            {
                id: 'offer_1',
                title: 'Weekend Family Pure Veg BOGO Feast',
                description: 'Buy 1 Large Gourmet Veggie Pizza & Get a Medium Margherita + Cheesy Garlic Breadstix 100% FREE!',
                badge: '🎉 Weekend Offer',
                originalPrice: 1299,
                offerPrice: 699,
                discount: 46,
                coupon: 'WEEKENDVEG50',
                endDate: new Date(now + 36 * 3600000).toISOString(),
                image: 'images/hero-pizza.jpg',
                isFeatured: true,
                isActive: true
            },
            {
                id: 'offer_2',
                title: 'Jain Special Harmony Combo',
                description: 'Any Medium Jain Pizza + Pesto Alfredo Pasta + 2 Drinks at a special discounted flat price',
                badge: '🔥 Today\'s Special',
                originalPrice: 999,
                offerPrice: 549,
                discount: 45,
                coupon: 'JAINSPECIAL',
                endDate: new Date(now + 18 * 3600000).toISOString(),
                image: 'images/pizza-margherita.jpg',
                isFeatured: false,
                isActive: true
            },
            {
                id: 'offer_3',
                title: 'Quattro Formaggi Lovers Deal',
                description: '25% OFF on our Four Cheese Artisanal Pizza baked fresh on volcanic stone',
                badge: '⏳ Limited Time',
                originalPrice: 799,
                offerPrice: 599,
                discount: 25,
                coupon: 'CHEESE25',
                endDate: new Date(now + 12 * 3600000).toISOString(),
                image: 'images/pizza-four-cheese.jpg',
                isFeatured: false,
                isActive: true
            },
            {
                id: 'offer_4',
                title: 'Midweek Midnight Veg Munchies',
                description: 'Flat ₹200 OFF on all orders above ₹599 after 9 PM',
                badge: '✨ New Launch',
                originalPrice: 699,
                offerPrice: 499,
                discount: 28,
                coupon: 'MIDNIGHT200',
                endDate: new Date(now - 100000).toISOString(), // Expired deal for demonstration
                image: 'images/pizza-veggie.jpg',
                isFeatured: false,
                isActive: false
            }
        ];
    }

    // Load stored offers or initialize
    let offers = [];
    function loadOffers() {
        try {
            const stored = localStorage.getItem(OFFERS_STORAGE_KEY);
            if (stored) {
                offers = JSON.parse(stored);
            } else {
                offers = getInitialOffers();
                localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
            }
        } catch {
            offers = getInitialOffers();
        }
    }
    loadOffers();

    // Save offers
    function saveOffers() {
        try {
            localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
        } catch (e) { console.error('Failed to save offers:', e); }
    }

    // =====================================================================
    // 2. UTILITY & TOAST FUNCTIONS
    // =====================================================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = {
            success: '🌱',
            error: '❌',
            info: '🔔'
        };

        toast.innerHTML = `<span>${icons[type] || '✨'}</span><span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('toast--visible'));

        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D64545', '#4CAF50', '#F4B942']
            });
        }
    }

    function formatCountdown(targetMs) {
        const diff = targetMs - Date.now();
        if (diff <= 0) return { h: '00', m: '00', s: '00', expired: true };

        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        return { h, m, s, expired: false };
    }

    // =====================================================================
    // 3. THEME TOGGLE (Light / Dark)
    // =====================================================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem(THEME_STORAGE_KEY, next);
            updateThemeIcon(next);
            showToast(`${next === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'} Activated`, 'info');
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    // =====================================================================
    // 4. NAVIGATION & MOBILE HAMBURGER
    // =====================================================================
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }
    }, { passive: true });

    function closeMobileNav() {
        if (!hamburgerBtn || !navMenu) return;
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        if (window.innerWidth <= 768) {
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }

    function openMobileNav() {
        if (!hamburgerBtn || !navMenu) return;
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('active');
        navMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });

        // Close mobile nav on window resize if scaled up to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.body.style.overflow = '';
                navMenu.setAttribute('aria-hidden', 'false');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            } else if (!navMenu.classList.contains('active')) {
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // =====================================================================
    // 5. ⭐ SPECIAL OFFERS SECTION (REAL-TIME RENDERING & OWNER SYNC)
    // =====================================================================
    const featuredOfferContainer = document.getElementById('featuredOfferContainer');
    const offersGrid = document.getElementById('offersGrid');
    const expiredGrid = document.getElementById('expiredGrid');
    const expiredCount = document.getElementById('expiredCount');
    const archiveToggle = document.getElementById('archiveToggle');

    function renderOffersSection() {
        const now = Date.now();

        // Sort out active vs expired based on date & status
        const activeOffers = offers.filter(o => o.isActive && new Date(o.endDate).getTime() > now);
        const expiredOffers = offers.filter(o => !o.isActive || new Date(o.endDate).getTime() <= now);

        if (expiredCount) expiredCount.textContent = `${expiredOffers.length} Expired`;

        // Render Featured Hero Offer Card
        const featured = activeOffers.find(o => o.isFeatured) || activeOffers[0];

        if (featured && featuredOfferContainer) {
            const endTime = new Date(featured.endDate).getTime();
            const time = formatCountdown(endTime);

            featuredOfferContainer.innerHTML = `
                <div class="featured-offer-card">
                    <div class="featured-offer-card__ribbon">FEATURED DEAL</div>
                    <div>
                        <div class="featured-offer-card__badge"><i class="fa-solid fa-star"></i> ${featured.badge}</div>
                        <h3 class="featured-offer-card__title">${featured.title}</h3>
                        <p class="featured-offer-card__desc">${featured.description}</p>
                        
                        <div class="featured-offer-card__prices">
                            <span class="featured-offer-card__price-now">₹${featured.offerPrice}</span>
                            <span class="featured-offer-card__price-orig">₹${featured.originalPrice}</span>
                            <span class="featured-offer-card__save">Save ${featured.discount || 40}%</span>
                        </div>

                        <!-- Live Countdown Clock -->
                        <div class="countdown-box" data-end="${featured.endDate}">
                            <div class="countdown-unit">
                                <span class="countdown-num" data-h>${time.h}</span>
                                <span class="countdown-lbl">Hours</span>
                            </div>
                            <div class="countdown-unit">
                                <span class="countdown-num" data-m>${time.m}</span>
                                <span class="countdown-lbl">Mins</span>
                            </div>
                            <div class="countdown-unit">
                                <span class="countdown-num" data-s>${time.s}</span>
                                <span class="countdown-lbl">Secs</span>
                            </div>
                        </div>

                        <div class="featured-offer-card__actions">
                            <button class="btn btn--primary claim-offer-btn" data-id="${featured.id}" data-coupon="${featured.coupon}">
                                <i class="fa-solid fa-gift"></i> Claim Deal Now
                            </button>
                            <button class="coupon-btn copy-coupon-btn" data-coupon="${featured.coupon}">
                                <i class="fa-regular fa-copy"></i> Code: ${featured.coupon}
                            </button>
                        </div>
                    </div>

                    <div class="featured-offer-card__img-wrap">
                        <img src="${featured.image}" alt="${featured.title}" class="featured-offer-card__img">
                    </div>
                </div>
            `;
        } else if (featuredOfferContainer) {
            featuredOfferContainer.innerHTML = '';
        }

        // Render Regular Active Offers Grid (exclude the single featured hero card if rendered)
        const regularActive = activeOffers.filter(o => o.id !== (featured ? featured.id : null));

        if (offersGrid) {
            if (regularActive.length === 0) {
                offersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">More delicious offers coming soon!</p>';
            } else {
                offersGrid.innerHTML = regularActive.map(offer => {
                    const time = formatCountdown(new Date(offer.endDate).getTime());
                    return `
                        <div class="offer-card">
                            <div class="offer-card__badge-bar">
                                <span class="offer-badge">${offer.badge}</span>
                            </div>
                            <div class="offer-card__img-wrap">
                                <img src="${offer.image}" alt="${offer.title}" class="offer-card__img">
                            </div>
                            <div class="offer-card__body">
                                <h4 class="offer-card__title">${offer.title}</h4>
                                <p class="offer-card__desc">${offer.description}</p>
                                <div class="offer-card__pricing">
                                    <span class="offer-card__price-now">₹${offer.offerPrice}</span>
                                    <span class="offer-card__price-orig">₹${offer.originalPrice}</span>
                                </div>
                                <div class="offer-card__timer" data-end="${offer.endDate}">
                                    <i class="fa-regular fa-clock"></i> Ends in: 
                                    <strong><span data-h>${time.h}</span>h <span data-m>${time.m}</span>m <span data-s>${time.s}</span>s</strong>
                                </div>
                                <div class="offer-card__actions">
                                    <button class="btn btn--primary btn--sm btn--full claim-offer-btn" data-id="${offer.id}" data-coupon="${offer.coupon}">
                                        Claim Deal
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Render Expired Offers Archive Grid
        if (expiredGrid) {
            expiredGrid.innerHTML = expiredOffers.map(offer => `
                <div class="offer-card" style="opacity: 0.65; filter: grayscale(40%);">
                    <div class="offer-card__img-wrap">
                        <img src="${offer.image}" alt="${offer.title}" class="offer-card__img">
                    </div>
                    <div class="offer-card__body">
                        <span style="font-size: 0.72rem; color: var(--color-primary); font-weight: 700;">EXPIRED DEAL</span>
                        <h4 class="offer-card__title" style="font-size: 1.1rem; margin-top: 4px;">${offer.title}</h4>
                        <p class="offer-card__desc">${offer.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    renderOffersSection();

    // Real-time Countdown Timer Interval
    setInterval(() => {
        document.querySelectorAll('[data-end]').forEach(timerBox => {
            const endDate = new Date(timerBox.dataset.end).getTime();
            const time = formatCountdown(endDate);
            const h = timerBox.querySelector('[data-h]');
            const m = timerBox.querySelector('[data-m]');
            const s = timerBox.querySelector('[data-s]');
            if (h) h.textContent = time.h;
            if (m) m.textContent = time.m;
            if (s) s.textContent = time.s;
        });
    }, 1000);

    // Expired Archive Accordion Toggle
    if (archiveToggle && expiredGrid) {
        archiveToggle.addEventListener('click', () => {
            expiredGrid.classList.toggle('hidden');
            const arrow = archiveToggle.querySelector('.archive-arrow');
            if (arrow) arrow.style.transform = expiredGrid.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    }

    // Global Click Listener for Offer Wall Actions (Claim & Copy Coupon)
    document.addEventListener('click', (e) => {
        const claimBtn = e.target.closest('.claim-offer-btn');
        if (claimBtn) {
            const coupon = claimBtn.dataset.coupon;
            triggerConfetti();
            showToast(`🎉 Coupon ${coupon} claimed & applied to your cart!`, 'success');
        }

        const copyBtn = e.target.closest('.copy-coupon-btn');
        if (copyBtn) {
            const coupon = copyBtn.dataset.coupon;
            navigator.clipboard?.writeText(coupon);
            triggerConfetti();
            showToast(`📋 Code ${coupon} copied to clipboard!`, 'info');
        }
    });

    // =====================================================================
    // 6. MENU RENDERING, CATEGORY TABS & SEARCH
    // =====================================================================
    const menuGrid = document.getElementById('menuGrid');
    const menuSearchInput = document.getElementById('menuSearchInput');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const dietaryChips = document.querySelectorAll('.dietary-chip');

    let currentCategory = 'all';
    let currentDietary = 'all';

    function renderMenu() {
        if (!menuGrid) return;

        const query = menuSearchInput?.value.trim().toLowerCase() || '';

        const filtered = pizzaMenuData.filter(item => {
            const matchCategory = currentCategory === 'all' || item.category === currentCategory;
            const matchDietary = currentDietary === 'all' || item.dietary.includes(currentDietary);
            const matchQuery = !query || 
                item.name.toLowerCase().includes(query) ||
                item.desc.toLowerCase().includes(query) ||
                item.tags.some(t => t.toLowerCase().includes(query));

            return matchCategory && matchDietary && matchQuery;
        });

        if (filtered.length === 0) {
            menuGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px;">
                    <span style="font-size: 3rem;">🌱</span>
                    <h3 style="margin-top: 12px; font-family: var(--ff-heading);">No pure veg items match your search</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Try searching for another item or resetting filters.</p>
                </div>
            `;
            return;
        }

        menuGrid.innerHTML = filtered.map(item => `
            <div class="food-card">
                <div class="food-card__img-wrap">
                    <img src="${item.img}" alt="${item.name}" class="food-card__img" loading="lazy">
                    <span class="food-card__badge-veg">${item.badge}</span>
                    <span class="food-card__cal">${item.calories}</span>
                </div>
                <div class="food-card__header">
                    <h3 class="food-card__title">${item.name}</h3>
                    <span class="food-card__price">₹${item.price}</span>
                </div>
                <p class="food-card__desc">${item.desc}</p>
                <div class="food-card__tags">
                    ${item.tags.map(t => `<span class="food-tag">${t}</span>`).join('')}
                </div>
                <button class="btn btn--primary btn--sm food-card__btn add-to-cart-btn" data-id="${item.id}">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `).join('');
    }

    renderMenu();

    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', renderMenu);
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderMenu();
        });
    });

    dietaryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            dietaryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentDietary = chip.dataset.dietary;
            renderMenu();
        });
    });

    // =====================================================================
    // 7. INTERACTIVE CART DRAWER & STICKY CART BAR
    // =====================================================================
    let cart = [];

    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartBarCount = document.getElementById('cartBarCount');
    const cartBarTotal = document.getElementById('cartBarTotal');
    const cartBar = document.getElementById('cartBar');
    const cartBarOpenDrawer = document.getElementById('cartBarOpenDrawer');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function toggleCartDrawer(open) {
        if (!cartDrawer || !cartOverlay) return;
        cartDrawer.classList.toggle('active', open);
        cartOverlay.classList.toggle('active', open);
    }

    if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCartDrawer(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
    if (cartBarOpenDrawer) cartBarOpenDrawer.addEventListener('click', () => toggleCartDrawer(true));

    function updateCartUI() {
        const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
        const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
        const taxes = Math.round(subtotal * 0.05);
        const grandTotal = subtotal + taxes;

        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        if (cartBarCount) cartBarCount.textContent = totalItems;
        if (cartBarTotal) cartBarTotal.textContent = grandTotal;

        if (cartBar) cartBar.classList.toggle('visible', totalItems > 0);

        document.getElementById('cartSubtotal').textContent = subtotal;
        document.getElementById('cartTaxes').textContent = taxes;
        document.getElementById('cartGrandTotal').textContent = grandTotal;

        if (cartItemsList) {
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">Your pure veg cart is empty 🍕</p>';
            } else {
                cartItemsList.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}" class="cart-item__img">
                        <div class="cart-item__details">
                            <h4 class="cart-item__title">${item.name}</h4>
                            <span class="cart-item__price">₹${item.price * item.qty}</span>
                            <div class="cart-item__qty-controls">
                                <button class="qty-btn minus-qty" data-id="${item.id}">-</button>
                                <span>${item.qty}</span>
                                <button class="qty-btn plus-qty" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Add to cart click event
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            const id = parseInt(addBtn.dataset.id);
            const item = pizzaMenuData.find(p => p.id === id);
            if (!item) return;

            const existing = cart.find(c => c.id === id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ ...item, qty: 1 });
            }
            updateCartUI();
            showToast(`🍕 ${item.name} added to cart!`, 'success');
        }

        const minusBtn = e.target.closest('.minus-qty');
        if (minusBtn) {
            const id = parseInt(minusBtn.dataset.id);
            const item = cart.find(c => c.id === id);
            if (item) {
                item.qty--;
                if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
                updateCartUI();
            }
        }

        const plusBtn = e.target.closest('.plus-qty');
        if (plusBtn) {
            const id = parseInt(plusBtn.dataset.id);
            const item = cart.find(c => c.id === id);
            if (item) {
                item.qty++;
                updateCartUI();
            }
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!', 'error');
                return;
            }
            triggerConfetti();
            showToast('✅ Order Placed Successfully! Preparing your wood-fired pizza.', 'success');
            cart = [];
            updateCartUI();
            toggleCartDrawer(false);
        });
    }

    // =====================================================================
    // 8. TIMELINE TABS & STORY
    // =====================================================================
    const storyTimelineTabs = document.querySelectorAll('.timeline-tab');
    const storyTimelineCards = document.querySelectorAll('.timeline-card');

    storyTimelineTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const year = tab.dataset.year;
            storyTimelineTabs.forEach(t => t.classList.remove('active'));
            storyTimelineCards.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.timeline-card[data-year="${year}"]`)?.classList.add('active');
        });
    });

    // =====================================================================
    // 9. GALLERY MASONRY LIGHTBOX
    // =====================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIdx = 0;

    const galleryDataList = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img')?.src || '',
        title: item.querySelector('h4')?.textContent || ''
    }));

    function openLightbox(idx) {
        if (!lightbox || !galleryDataList[idx]) return;
        currentLightboxIdx = idx;
        lightboxImg.src = galleryDataList[idx].src;
        lightboxCaption.textContent = galleryDataList[idx].title;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentLightboxIdx = (currentLightboxIdx - 1 + galleryDataList.length) % galleryDataList.length;
            openLightbox(currentLightboxIdx);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentLightboxIdx = (currentLightboxIdx + 1) % galleryDataList.length;
            openLightbox(currentLightboxIdx);
        });
    }

    // =====================================================================
    // 10. REVIEWS RENDERING
    // =====================================================================
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid) {
        reviewsGrid.innerHTML = testimonialsData.map(t => `
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"${t.text}"</p>
                <div class="review-author">
                    <div class="review-avatar">${t.avatar}</div>
                    <div>
                        <h4 class="review-name">${t.name}</h4>
                        <span class="review-source"><i class="fa-solid fa-circle-check" style="color: var(--color-secondary-dark);"></i> ${t.source}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // =====================================================================
    // 11. OWNER ADMIN DASHBOARD MODAL (CREATE/EDIT/DELETE OFFERS)
    // =====================================================================
    const openAdminBtn = document.getElementById('openAdminBtn');
    const openAdminFooterLink = document.getElementById('openAdminFooterLink');
    const manageOffersShortcut = document.getElementById('manageOffersShortcut');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const adminModalOverlay = document.getElementById('adminModalOverlay');
    const adminModal = document.getElementById('adminModal');

    const offerAdminForm = document.getElementById('offerAdminForm');
    const editOfferId = document.getElementById('editOfferId');
    const offerTitle = document.getElementById('offerTitle');
    const offerBadge = document.getElementById('offerBadge');
    const offerOriginalPrice = document.getElementById('offerOriginalPrice');
    const offerPrice = document.getElementById('offerPrice');
    const offerCoupon = document.getElementById('offerCoupon');
    const offerDesc = document.getElementById('offerDesc');
    const offerEndDate = document.getElementById('offerEndDate');
    const offerImagePreset = document.getElementById('offerImagePreset');
    const offerIsFeatured = document.getElementById('offerIsFeatured');
    const resetAdminFormBtn = document.getElementById('resetAdminFormBtn');
    const adminOffersTableBody = document.getElementById('adminOffersTableBody');

    const statActive = document.getElementById('statActive');
    const statExpired = document.getElementById('statExpired');

    function toggleAdminModal(open) {
        if (!adminModal || !adminModalOverlay) return;
        adminModal.classList.toggle('active', open);
        adminModalOverlay.classList.toggle('active', open);
        if (open) updateAdminDashboardUI();
    }

    if (openAdminBtn) openAdminBtn.addEventListener('click', () => toggleAdminModal(true));
    if (openAdminFooterLink) openAdminFooterLink.addEventListener('click', (e) => { e.preventDefault(); toggleAdminModal(true); });
    if (manageOffersShortcut) manageOffersShortcut.addEventListener('click', () => toggleAdminModal(true));
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => toggleAdminModal(false));
    if (adminModalOverlay) adminModalOverlay.addEventListener('click', () => toggleAdminModal(false));

    function updateAdminDashboardUI() {
        const now = Date.now();
        const activeCount = offers.filter(o => o.isActive && new Date(o.endDate).getTime() > now).length;
        const expiredCount = offers.filter(o => !o.isActive || new Date(o.endDate).getTime() <= now).length;

        if (statActive) statActive.textContent = activeCount;
        if (statExpired) statExpired.textContent = expiredCount;

        if (adminOffersTableBody) {
            adminOffersTableBody.innerHTML = offers.map(o => `
                <tr>
                    <td><strong>${o.title}</strong></td>
                    <td><span class="offer-badge">${o.badge}</span></td>
                    <td>₹${o.offerPrice} <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem;">₹${o.originalPrice}</span></td>
                    <td><code>${o.coupon}</code></td>
                    <td>${new Date(o.endDate).toLocaleDateString()}</td>
                    <td>${o.isFeatured ? '⭐ Yes' : 'No'}</td>
                    <td>
                        <button class="btn-table-action btn-table-action--edit edit-offer-btn" data-id="${o.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-table-action btn-table-action--delete delete-offer-btn" data-id="${o.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    }

    if (offerAdminForm) {
        offerAdminForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = editOfferId.value || `offer_${Date.now()}`;
            const origP = parseFloat(offerOriginalPrice.value);
            const offP = parseFloat(offerPrice.value);
            const disc = Math.round(((origP - offP) / origP) * 100);

            const newOffer = {
                id,
                title: offerTitle.value.trim(),
                badge: offerBadge.value,
                originalPrice: origP,
                offerPrice: offP,
                discount: disc,
                coupon: offerCoupon.value.trim().toUpperCase(),
                description: offerDesc.value.trim(),
                endDate: new Date(offerEndDate.value).toISOString(),
                image: offerImagePreset.value,
                isFeatured: offerIsFeatured.checked,
                isActive: true
            };

            if (newOffer.isFeatured) {
                offers.forEach(o => o.isFeatured = false);
            }

            const existingIdx = offers.findIndex(o => o.id === id);
            if (existingIdx >= 0) {
                offers[existingIdx] = newOffer;
                showToast('Offer updated successfully!', 'success');
            } else {
                offers.unshift(newOffer);
                showToast('New Special Offer Published!', 'success');
            }

            saveOffers();
            renderOffersSection();
            updateAdminDashboardUI();
            resetOfferForm();
        });
    }

    function resetOfferForm() {
        if (!offerAdminForm) return;
        offerAdminForm.reset();
        editOfferId.value = '';
        document.getElementById('adminFormTitle').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Create New Special Offer';
    }

    if (resetAdminFormBtn) resetAdminFormBtn.addEventListener('click', resetOfferForm);

    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-offer-btn');
        if (editBtn) {
            const id = editBtn.dataset.id;
            const target = offers.find(o => o.id === id);
            if (!target) return;

            editOfferId.value = target.id;
            offerTitle.value = target.title;
            offerBadge.value = target.badge;
            offerOriginalPrice.value = target.originalPrice;
            offerPrice.value = target.offerPrice;
            offerCoupon.value = target.coupon;
            offerDesc.value = target.description;
            offerImagePreset.value = target.image;
            offerIsFeatured.checked = target.isFeatured;

            const date = new Date(target.endDate);
            const iso = date.toISOString().slice(0, 16);
            offerEndDate.value = iso;

            document.getElementById('adminFormTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Special Offer';
        }

        const delBtn = e.target.closest('.delete-offer-btn');
        if (delBtn) {
            const id = delBtn.dataset.id;
            offers = offers.filter(o => o.id !== id);
            saveOffers();
            renderOffersSection();
            updateAdminDashboardUI();
            showToast('Offer deleted from system', 'info');
        }
    });

    // =====================================================================
    // 12. BACK TO TOP BUTTON
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
});
