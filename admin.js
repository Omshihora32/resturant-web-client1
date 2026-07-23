/**
 * Forno Rosso — Admin Dashboard JavaScript
 * Handles admin authentication, offer CRUD, and dashboard UI
 */

(function () {
    'use strict';

    // ===================== CONSTANTS =====================
    const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };
    const AUTH_KEY = 'fornorosso_admin_auth';

    // ===================== DOM ELEMENTS =====================
    const loginScreen = document.getElementById('adminLogin');
    const dashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebar = document.getElementById('adminSidebar');
    const menuToggle = document.getElementById('adminMenuToggle');
    const navItems = document.querySelectorAll('.admin__nav-item[data-section]');
    const pageTitle = document.getElementById('adminPageTitle');

    // Offer Modal
    const offerModal = document.getElementById('offerModal');
    const offerForm = document.getElementById('offerForm');
    const addOfferBtn = document.getElementById('addOfferBtn');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalTitle = document.getElementById('modalTitle');

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const deleteConfirm = document.getElementById('deleteConfirm');
    const deleteCancel = document.getElementById('deleteCancel');
    const deleteModalClose = document.getElementById('deleteModalClose');

    // File upload
    const fileInput = document.getElementById('offerImage');
    const filePreview = document.getElementById('filePreview');
    const filePlaceholder = document.getElementById('filePlaceholder');
    const fileUploadArea = document.getElementById('fileUploadArea');

    // Price auto-calculate
    const originalPriceInput = document.getElementById('offerOriginalPrice');
    const offerPriceInput = document.getElementById('offerPrice');
    const discountInput = document.getElementById('offerDiscount');

    let deleteTargetId = null;
    let currentImageData = '';

    // ===================== AUTH =====================
    function checkAuth() {
        if (!loginScreen || !dashboard) return;
        const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
        if (isAuth) {
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            initDashboard();
        } else {
            loginScreen.style.display = 'flex';
            dashboard.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;

            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem(AUTH_KEY, 'true');
                loginScreen.style.display = 'none';
                dashboard.style.display = 'flex';
                initDashboard();
                showToast('Welcome back, Admin!', 'success');
            } else {
                showToast('Invalid credentials. Please try again.', 'error');
                document.getElementById('adminPassword').value = '';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem(AUTH_KEY);
            loginScreen.style.display = 'flex';
            dashboard.style.display = 'none';
            showToast('Logged out successfully.', 'info');
        });
    }

    // ===================== SIDEBAR NAVIGATION =====================
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    navItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.dataset.section;

            navItems.forEach(function (nav) { nav.classList.remove('active'); });
            this.classList.add('active');

            document.querySelectorAll('.admin__section').forEach(function (sec) {
                sec.style.display = 'none';
            });

            const target = document.getElementById('section' + capitalize(section));
            if (target) {
                target.style.display = 'block';
            }

            pageTitle.textContent = capitalize(section);

            if (section === 'offers') renderOffersTable();
            if (section === 'dashboard') updateStats();

            // Close sidebar on mobile
            sidebar.classList.remove('active');
        });
    });

    // ===================== OFFERS CRUD =====================
    function getOffers() {
        try {
            return JSON.parse(localStorage.getItem('fornorosso_offers')) || [];
        } catch (e) {
            return [];
        }
    }

    function saveOffers(offers) {
        localStorage.setItem('fornorosso_offers', JSON.stringify(offers));
    }

    function addOffer(data) {
        const offers = getOffers();
        data.id = Date.now().toString();
        offers.push(data);
        saveOffers(offers);
        return data;
    }

    function editOffer(id, data) {
        const offers = getOffers();
        const index = offers.findIndex(function (o) { return o.id === id; });
        if (index !== -1) {
            data.id = id;
            offers[index] = data;
            saveOffers(offers);
        }
    }

    function deleteOffer(id) {
        const offers = getOffers().filter(function (o) { return o.id !== id; });
        saveOffers(offers);
    }

    function toggleOfferStatus(id) {
        const offers = getOffers();
        const offer = offers.find(function (o) { return o.id === id; });
        if (offer) {
            offer.isActive = !offer.isActive;
            saveOffers(offers);
        }
    }

    // ===================== RENDER TABLE =====================
    function renderOffersTable() {
        const tbody = document.getElementById('offersTableBody');
        if (!tbody) return;
        const offers = getOffers();

        if (offers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="admin__empty">No offers yet. Click "Add New Offer" to create one.</td></tr>';
            return;
        }

        tbody.innerHTML = offers.map(function (offer) {
            const now = new Date();
            const endDate = new Date(offer.endDate);
            const isExpired = endDate < now;
            const status = !offer.isActive ? 'inactive' : isExpired ? 'expired' : 'active';
            const statusLabels = { active: 'Active', expired: 'Expired', inactive: 'Inactive' };

            return '<tr>' +
                '<td>' +
                    '<div class="admin__offer-cell">' +
                        (offer.image ? '<img src="' + offer.image + '" alt="' + offer.title + '" class="admin__offer-thumb">' : '<div class="admin__offer-thumb admin__offer-thumb--placeholder">🍕</div>') +
                        '<div>' +
                            '<strong>' + escapeHTML(offer.title) + '</strong>' +
                            '<small>' + escapeHTML(offer.description).substring(0, 50) + (offer.description.length > 50 ? '...' : '') + '</small>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<span class="admin__price-original">₹' + offer.originalPrice + '</span>' +
                    '<span class="admin__price-offer">₹' + offer.offerPrice + '</span>' +
                '</td>' +
                '<td><span class="admin__discount-badge">' + offer.discount + '% OFF</span></td>' +
                '<td>' + formatDate(offer.endDate) + '</td>' +
                '<td><span class="admin__status admin__status--' + status + '">' + statusLabels[status] + '</span></td>' +
                '<td>' +
                    '<div class="admin__actions">' +
                        '<button class="admin__action-btn admin__action-btn--edit" onclick="window.adminEditOffer(\'' + offer.id + '\')" title="Edit">' +
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
                        '</button>' +
                        '<button class="admin__action-btn admin__action-btn--toggle" onclick="window.adminToggleOffer(\'' + offer.id + '\')" title="' + (offer.isActive ? 'Deactivate' : 'Activate') + '">' +
                            (offer.isActive
                                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
                                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
                            ) +
                        '</button>' +
                        '<button class="admin__action-btn admin__action-btn--delete" onclick="window.adminDeleteOffer(\'' + offer.id + '\')" title="Delete">' +
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
                        '</button>' +
                    '</div>' +
                '</td>' +
            '</tr>';
        }).join('');
    }

    // ===================== OFFER MODAL =====================
    if (addOfferBtn) {
        addOfferBtn.addEventListener('click', function () {
            openOfferModal();
        });
    }

    function openOfferModal(offer) {
        offerForm.reset();
        currentImageData = '';
        filePreview.style.display = 'none';
        filePlaceholder.style.display = 'flex';

        if (offer) {
            modalTitle.textContent = 'Edit Offer';
            document.getElementById('offerId').value = offer.id;
            document.getElementById('offerTitle').value = offer.title;
            document.getElementById('offerDescription').value = offer.description;
            document.getElementById('offerOriginalPrice').value = offer.originalPrice;
            document.getElementById('offerPrice').value = offer.offerPrice;
            document.getElementById('offerDiscount').value = offer.discount;
            document.getElementById('offerStartDate').value = toLocalDatetime(offer.startDate);
            document.getElementById('offerEndDate').value = toLocalDatetime(offer.endDate);
            document.getElementById('offerCategory').value = offer.category || 'combo';
            document.getElementById('offerActive').checked = offer.isActive;
            document.getElementById('toggleLabel').textContent = offer.isActive ? 'Active' : 'Inactive';
            if (offer.image) {
                currentImageData = offer.image;
                filePreview.src = offer.image;
                filePreview.style.display = 'block';
                filePlaceholder.style.display = 'none';
            }
        } else {
            modalTitle.textContent = 'Add New Offer';
            document.getElementById('offerId').value = '';
            // Set default dates
            const now = new Date();
            document.getElementById('offerStartDate').value = toLocalDatetime(now.toISOString());
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            document.getElementById('offerEndDate').value = toLocalDatetime(tomorrow.toISOString());
            document.getElementById('toggleLabel').textContent = 'Active';
        }

        offerModal.style.display = 'flex';
        setTimeout(function () { offerModal.classList.add('active'); }, 10);
    }

    function closeOfferModal() {
        offerModal.classList.remove('active');
        setTimeout(function () { offerModal.style.display = 'none'; }, 300);
    }

    if (modalClose) modalClose.addEventListener('click', closeOfferModal);
    if (modalCancel) modalCancel.addEventListener('click', closeOfferModal);

    // Auto-calculate discount
    function calcDiscount() {
        const orig = parseFloat(originalPriceInput.value) || 0;
        const offer = parseFloat(offerPriceInput.value) || 0;
        if (orig > 0 && offer > 0 && offer < orig) {
            discountInput.value = Math.round(((orig - offer) / orig) * 100);
        } else {
            discountInput.value = '';
        }
    }
    if (originalPriceInput) originalPriceInput.addEventListener('input', calcDiscount);
    if (offerPriceInput) offerPriceInput.addEventListener('input', calcDiscount);

    // Toggle label
    const activeToggle = document.getElementById('offerActive');
    const toggleLabel = document.getElementById('toggleLabel');
    if (activeToggle && toggleLabel) {
        activeToggle.addEventListener('change', function () {
            toggleLabel.textContent = this.checked ? 'Active' : 'Inactive';
        });
    }

    // File upload
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image too large. Max 5MB allowed.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (ev) {
                currentImageData = ev.target.result;
                filePreview.src = currentImageData;
                filePreview.style.display = 'block';
                filePlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    // Drag and drop
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        fileUploadArea.addEventListener('dragleave', function () {
            this.classList.remove('dragover');
        });
        fileUploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }

    // Form submit
    if (offerForm) {
        offerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const id = document.getElementById('offerId').value;
            const data = {
                title: document.getElementById('offerTitle').value.trim(),
                description: document.getElementById('offerDescription').value.trim(),
                originalPrice: parseFloat(document.getElementById('offerOriginalPrice').value),
                offerPrice: parseFloat(document.getElementById('offerPrice').value),
                discount: parseInt(document.getElementById('offerDiscount').value) || 0,
                startDate: new Date(document.getElementById('offerStartDate').value).toISOString(),
                endDate: new Date(document.getElementById('offerEndDate').value).toISOString(),
                category: document.getElementById('offerCategory').value,
                isActive: document.getElementById('offerActive').checked,
                image: currentImageData || ''
            };

            if (data.offerPrice >= data.originalPrice) {
                showToast('Offer price must be less than original price.', 'error');
                return;
            }

            if (new Date(data.endDate) <= new Date(data.startDate)) {
                showToast('End date must be after start date.', 'error');
                return;
            }

            if (id) {
                editOffer(id, data);
                showToast('Offer updated successfully!', 'success');
            } else {
                addOffer(data);
                showToast('Offer created successfully!', 'success');
            }

            closeOfferModal();
            renderOffersTable();
            updateStats();
        });
    }

    // ===================== DELETE MODAL =====================
    if (deleteCancel) deleteCancel.addEventListener('click', closeDeleteModal);
    if (deleteModalClose) deleteModalClose.addEventListener('click', closeDeleteModal);
    if (deleteConfirm) {
        deleteConfirm.addEventListener('click', function () {
            if (deleteTargetId) {
                deleteOffer(deleteTargetId);
                showToast('Offer deleted.', 'info');
                renderOffersTable();
                updateStats();
            }
            closeDeleteModal();
        });
    }

    function openDeleteModal(id) {
        deleteTargetId = id;
        deleteModal.style.display = 'flex';
        setTimeout(function () { deleteModal.classList.add('active'); }, 10);
    }

    function closeDeleteModal() {
        deleteModal.classList.remove('active');
        setTimeout(function () { deleteModal.style.display = 'none'; }, 300);
        deleteTargetId = null;
    }

    // ===================== GLOBAL FUNCTIONS (for inline onclick) =====================
    window.adminEditOffer = function (id) {
        const offer = getOffers().find(function (o) { return o.id === id; });
        if (offer) openOfferModal(offer);
    };

    window.adminDeleteOffer = function (id) {
        openDeleteModal(id);
    };

    window.adminToggleOffer = function (id) {
        toggleOfferStatus(id);
        renderOffersTable();
        updateStats();
        showToast('Offer status updated.', 'success');
    };

    // ===================== STATS =====================
    function updateStats() {
        const offers = getOffers();
        const now = new Date();
        const total = offers.length;
        const active = offers.filter(function (o) { return o.isActive && new Date(o.endDate) > now; }).length;
        const expiring = offers.filter(function (o) {
            const end = new Date(o.endDate);
            const hoursLeft = (end - now) / (1000 * 60 * 60);
            return o.isActive && hoursLeft > 0 && hoursLeft <= 24;
        }).length;
        const expired = offers.filter(function (o) { return new Date(o.endDate) <= now; }).length;

        animateNumber('statTotal', total);
        animateNumber('statActive', active);
        animateNumber('statExpiring', expiring);
        animateNumber('statExpired', expired);
    }

    function animateNumber(elementId, target) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const current = parseInt(el.textContent) || 0;
        if (current === target) return;

        const duration = 500;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(current + (target - current) * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ===================== INITIALIZE =====================
    function initDashboard() {
        updateStats();
        renderOffersTable();
    }

    // ===================== UTILS =====================
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    function toLocalDatetime(isoStr) {
        const d = new Date(isoStr);
        const pad = function (n) { return n.toString().padStart(2, '0'); };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
            'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function showToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast--' + (type || 'info');

        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = (icons[type] || icons.info) + '<span>' + message + '</span>';
        container.appendChild(toast);

        requestAnimationFrame(function () { toast.classList.add('toast--visible'); });

        setTimeout(function () {
            toast.classList.remove('toast--visible');
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    }

    // Close modals on overlay click
    if (offerModal) {
        offerModal.addEventListener('click', function (e) {
            if (e.target === offerModal) closeOfferModal();
        });
    }
    if (deleteModal) {
        deleteModal.addEventListener('click', function (e) {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }

    // Init
    checkAuth();
})();
