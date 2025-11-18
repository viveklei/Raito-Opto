// Global State - Now managed by DataManager
let currentEditingProduct = null;
let currentEditingSlide = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel loading...');
    console.log('Auth status:', localStorage.getItem('adminLoggedIn'));
    
    // Check if user is logged in
    if (!checkAuth()) {
        console.log('Not authenticated, redirecting to login...');
        alert('Please login first to access admin panel');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User authenticated successfully');
    
    // Load all data
    loadAllData();
    
    // Show dashboard by default
    showSection('dashboard');
    
    console.log('Admin panel loaded successfully');
});

// Authentication Check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    console.log('Checking auth, logged in:', isLoggedIn);
    return isLoggedIn;
}

// Load all data from DataManager
function loadAllData() {
    renderProductsTable();
    renderSlidesManager();
    loadDesignSettings();
    loadContactInfo();
    loadTeamMembers();
    loadTestimonials();
    updateDashboardStats();
}

// Section Management
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    const titles = {
        dashboard: 'Dashboard',
        products: 'Product Management',
        slider: 'Hero Slider',
        design: 'Design Settings',
        content: 'Content Management',
        contact: 'Contact Information',
        team: 'Team Members',
        testimonials: 'Testimonials',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
    
    document.getElementById('adminSidebar').classList.remove('active');
}

// Toggle Sidebar
function toggleSidebar() {
    document.getElementById('adminSidebar').classList.toggle('active');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.style.background = '#4caf50';
        toastIcon.textContent = '✓';
    } else if (type === 'error') {
        toastIcon.style.background = '#f44336';
        toastIcon.textContent = '✕';
    } else if (type === 'warning') {
        toastIcon.style.background = '#ff9800';
        toastIcon.textContent = '⚠';
    }
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== PRODUCTS MANAGEMENT ====================

function renderProductsTable() {
    const products = DataManager.products.getAll();
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><div class="product-thumb">${product.icon}</div></td>
            <td>${product.name}</td>
            <td><span class="badge badge-${product.category}">${product.category.toUpperCase()}</span></td>
            <td>${product.price}</td>
            <td><span class="status-badge ${product.status}">${product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span></td>
            <td>
                <button class="btn-icon-action" onclick="editProduct(${product.id})" title="Edit">✏️</button>
                <button class="btn-icon-action" onclick="deleteProduct(${product.id})" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    
    const products = DataManager.products.getAll();
    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    const tbody = document.getElementById('productsTableBody');
    if (tbody) {
        tbody.innerHTML = filtered.map(product => `
            <tr>
                <td><div class="product-thumb">${product.icon}</div></td>
                <td>${product.name}</td>
                <td><span class="badge badge-${product.category}">${product.category.toUpperCase()}</span></td>
                <td>${product.price}</td>
                <td><span class="status-badge ${product.status}">${product.status}</span></td>
                <td>
                    <button class="btn-icon-action" onclick="editProduct(${product.id})">✏️</button>
                    <button class="btn-icon-action" onclick="deleteProduct(${product.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
}

function openAddProductModal() {
    currentEditingProduct = null;
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = 'fiber';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productIcon').value = '📦';
    document.getElementById('addProductModal').classList.add('show');
}

function editProduct(id) {
    const product = DataManager.products.get(id);
    if (!product) return;
    
    currentEditingProduct = product;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productIcon').value = product.icon;
    document.getElementById('addProductModal').classList.add('show');
}

function saveProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: document.getElementById('productPrice').value,
        description: document.getElementById('productDescription').value,
        icon: document.getElementById('productIcon').value,
        specs: {} // Add specs handling if needed
    };
    
    if (!productData.name || !productData.price) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (currentEditingProduct) {
        DataManager.products.update(currentEditingProduct.id, productData);
        showToast('Product updated successfully!');
    } else {
        DataManager.products.add(productData);
        showToast('Product added successfully!');
    }
    
    renderProductsTable();
    closeModal('addProductModal');
    applyChangesToWebsite();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        DataManager.products.delete(id);
        renderProductsTable();
        showToast('Product deleted successfully!');
        applyChangesToWebsite();
    }
}

// ==================== SLIDER MANAGEMENT ====================

function renderSlidesManager() {
    const slides = DataManager.slides.getAll();
    const container = document.querySelector('.slider-manager');
    
    if (!container) return;
    
    container.innerHTML = slides.map((slide, index) => `
        <div class="slide-item">
            <div class="slide-preview">
                <div class="slide-number">Slide ${index + 1}</div>
                <div class="slide-content-preview">
                    <h4>${slide.title}</h4>
                    <p>${slide.description}</p>
                </div>
            </div>
            <div class="slide-actions">
                <button class="btn-secondary" onclick="editSlide(${slide.id})">✏️ Edit</button>
                <button class="btn-danger" onclick="deleteSlide(${slide.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function addNewSlide() {
    currentEditingSlide = null;
    document.getElementById('slideModalTitle').textContent = 'Add New Slide';
    document.getElementById('slideTitle').value = '';
    document.getElementById('slideSubtitle').value = '';
    document.getElementById('slideDescription').value = '';
    document.getElementById('slideGradient').value = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.getElementById('slideModal').classList.add('show');
}

function editSlide(id) {
    const slides = DataManager.slides.getAll();
    const slide = slides.find(s => s.id === id);
    if (!slide) return;
    
    currentEditingSlide = slide;
    document.getElementById('slideModalTitle').textContent = 'Edit Slide';
    document.getElementById('slideTitle').value = slide.title;
    document.getElementById('slideSubtitle').value = slide.subtitle;
    document.getElementById('slideDescription').value = slide.description;
    document.getElementById('slideGradient').value = slide.gradient || '';
    document.getElementById('slideModal').classList.add('show');
}

function saveSlide() {
    const slideData = {
        title: document.getElementById('slideTitle').value,
        subtitle: document.getElementById('slideSubtitle').value,
        description: document.getElementById('slideDescription').value,
        gradient: document.getElementById('slideGradient').value
    };
    
    if (!slideData.title) {
        showToast('Please enter slide title', 'error');
        return;
    }
    
    if (currentEditingSlide) {
        DataManager.slides.update(currentEditingSlide.id, slideData);
        showToast('Slide updated successfully!');
    } else {
        DataManager.slides.add(slideData);
        showToast('Slide added successfully!');
    }
    
    renderSlidesManager();
    closeModal('slideModal');
    applyChangesToWebsite();
}

function deleteSlide(id) {
    if (confirm('Are you sure you want to delete this slide?')) {
        DataManager.slides.delete(id);
        renderSlidesManager();
        showToast('Slide deleted successfully!');
        applyChangesToWebsite();
    }
}

// ==================== DESIGN SETTINGS ====================

function loadDesignSettings() {
    const colors = DataManager.colors.get();
    if (!colors) return;
    
    const primaryInput = document.getElementById('primaryColor');
    const secondaryInput = document.getElementById('secondaryColor');
    const bgInput = document.getElementById('bgColor');
    const textInput = document.getElementById('textColor');
    
    if (primaryInput) primaryInput.value = colors.primary;
    if (secondaryInput) secondaryInput.value = colors.secondary;
    if (bgInput) bgInput.value = colors.background;
    if (textInput) textInput.value = colors.text;
    
    updatePreview();
}

function updatePreview() {
    const primary = document.getElementById('primaryColor')?.value;
    const secondary = document.getElementById('secondaryColor')?.value;
    const bg = document.getElementById('bgColor')?.value;
    const text = document.getElementById('textColor')?.value;
    
    if (!primary) return;
    
    const preview = document.getElementById('colorPreview');
    if (preview) {
        preview.style.setProperty('--preview-primary', primary);
        preview.style.setProperty('--preview-bg', bg);
        preview.style.setProperty('--preview-text', text);
    }
    
    document.querySelectorAll('.color-picker-item').forEach(item => {
        const input = item.querySelector('input[type="color"]');
        const span = item.querySelector('.color-value');
        if (input && span) {
            span.textContent = input.value;
        }
    });
}

function saveDesignSettings() {
    const colors = {
        primary: document.getElementById('primaryColor').value,
        secondary: document.getElementById('secondaryColor').value,
        background: document.getElementById('bgColor').value,
        text: document.getElementById('textColor').value
    };
    
    DataManager.colors.update(colors);
    showToast('Design settings saved successfully!');
    applyChangesToWebsite();
}

// ==================== CONTACT INFO ====================

function loadContactInfo() {
    const contact = DataManager.contact.get();
    if (!contact) return;
    
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const supportInput = document.getElementById('contactSupport');
    const whatsappInput = document.getElementById('contactWhatsapp');
    const addressInput = document.getElementById('contactAddress');
    const hoursInput = document.getElementById('contactHours');
    
    if (emailInput) emailInput.value = contact.email;
    if (phoneInput) phoneInput.value = contact.phone;
    if (supportInput) supportInput.value = contact.supportEmail;
    if (whatsappInput) whatsappInput.value = contact.whatsapp;
    if (addressInput) addressInput.value = contact.address;
    if (hoursInput) hoursInput.value = contact.businessHours;
}

function saveContactInfo() {
    const contactData = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        supportEmail: document.getElementById('contactSupport').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        address: document.getElementById('contactAddress').value,
        businessHours: document.getElementById('contactHours').value,
        socialMedia: DataManager.contact.get().socialMedia // Keep existing social media
    };
    
    DataManager.contact.update(contactData);
    showToast('Contact information updated successfully!');
    applyChangesToWebsite();
}

// ==================== TEAM MEMBERS ====================

function loadTeamMembers() {
    const team = DataManager.team.getAll();
    const container = document.querySelector('.team-grid');
    
    if (!container) return;
    
    container.innerHTML = team.map(member => `
        <div class="team-member-card">
            <div class="team-member-avatar">${member.avatar}</div>
            <h4>${member.name}</h4>
            <p class="team-role">${member.position}</p>
            <div class="team-actions">
                <button class="btn-small" onclick="editTeamMember(${member.id})">✏️ Edit</button>
                <button class="btn-small btn-danger" onclick="deleteTeamMember(${member.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addTeamMember() {
    showToast('Team member form opening...', 'warning');
    // Open modal implementation
}

function editTeamMember(id) {
    showToast(`Editing team member ${id}`, 'warning');
    // Edit implementation
}

function deleteTeamMember(id) {
    if (confirm('Remove this team member?')) {
        DataManager.team.delete(id);
        loadTeamMembers();
        showToast('Team member removed!');
        applyChangesToWebsite();
    }
}

// ==================== TESTIMONIALS ====================

function loadTestimonials() {
    const testimonials = DataManager.testimonials.getAll();
    const container = document.querySelector('.testimonials-list');
    
    if (!container) return;
    
    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-author">
                    <div class="author-avatar">${t.avatar}</div>
                    <div>
                        <h4>${t.name}</h4>
                        <p>${t.position}, ${t.company}</p>
                    </div>
                </div>
                <div class="testimonial-actions">
                    <button class="btn-icon-action" onclick="editTestimonial(${t.id})">✏️</button>
                    <button class="btn-icon-action" onclick="deleteTestimonial(${t.id})">🗑️</button>
                </div>
            </div>
            <p class="testimonial-text">"${t.text}"</p>
        </div>
    `).join('');
}

function addTestimonial() {
    showToast('Testimonial form opening...', 'warning');
}

function editTestimonial(id) {
    showToast(`Editing testimonial ${id}`, 'warning');
}

function deleteTestimonial(id) {
    if (confirm('Delete this testimonial?')) {
        DataManager.testimonials.delete(id);
        loadTestimonials();
        showToast('Testimonial deleted!');
        applyChangesToWebsite();
    }
}

// ==================== DASHBOARD STATS ====================

function updateDashboardStats() {
    const products = DataManager.products.getAll();
    const slides = DataManager.slides.getAll();
    
    // Update stat cards if they exist
    const statElements = document.querySelectorAll('.stat-value');
    if (statElements[0]) statElements[0].textContent = products.length;
}

// ==================== APPLY CHANGES TO WEBSITE ====================

function applyChangesToWebsite() {
    console.log('Changes applied! Website will reflect updates on next page load.');
    
    // In a real implementation, this would:
    // 1. Send data to backend API
    // 2. Regenerate static files
    // 3. Update database
    // 4. Clear caches
    
    // For this demo, data is already in localStorage
    // and will be used when pages load
}

// ==================== MODAL MANAGEMENT ====================

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('show');
}

// ==================== UTILITIES ====================

function showNotifications() {
    alert('Notifications:\n\n1. New contact form submission\n2. Product inquiry from ABC Corp\n3. System update available');
}

function showContentTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    showToast(`Showing ${tab} content`, 'warning');
}

function saveContent() {
    showToast('Content saved!');
}

function saveSettings() {
    showToast('Settings saved!');
}

// Close modals on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

console.log('Admin Panel with DataManager initialized! 🚀');