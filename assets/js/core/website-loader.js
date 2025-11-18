/**
 * Website Loader - Loads data from DataManager and updates website content
 * Add this script to all website pages to display admin panel changes
 */

(function() {
    'use strict';
    
    // Wait for DOM and DataManager to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWebsite);
    } else {
        initWebsite();
    }
    
    function initWebsite() {
        // Check if DataManager is available
        if (typeof DataManager === 'undefined') {
            console.warn('DataManager not loaded. Using default content.');
            return;
        }
        
        try {
            updateContactInfo();
            updateColors();
            updateHeroSlides();
            updateStats();
            updateProducts();
            updateTeamMembers();
            updateTestimonials();
            updateSiteInfo();
            
            console.log('✅ Website content loaded from admin panel data');
        } catch (error) {
            console.error('Error loading website data:', error);
        }
    }
    
    // Update Contact Information
    function updateContactInfo() {
        const contact = DataManager.contact.get();
        if (!contact) return;
        
        // Update email links and text
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
            if (el.textContent.includes('sales')) {
                el.href = `mailto:${contact.email}`;
                if (el.textContent.startsWith('📧')) {
                    el.textContent = `📧 ${contact.email}`;
                }
            }
        });
        
        // Update phone numbers
        document.querySelectorAll('a[href^="tel:"], span').forEach(el => {
            if (el.textContent.includes('422') || el.textContent.includes('+91')) {
                if (el.tagName === 'A') {
                    el.href = `tel:${contact.phone.replace(/[^0-9+]/g, '')}`;
                }
                if (el.textContent.startsWith('📞')) {
                    el.textContent = `📞 ${contact.phone}`;
                }
            }
        });
        
        // Update business hours
        document.querySelectorAll('span').forEach(el => {
            if (el.textContent.includes('Mon-Fri') || el.textContent.includes('🕐')) {
                if (el.textContent.startsWith('🕐')) {
                    el.textContent = `🕐 ${contact.businessHours}`;
                }
            }
        });
        
        // Update address in footer or contact page
        document.querySelectorAll('p, div').forEach(el => {
            if (el.textContent.includes('Industrial Park') || el.textContent.includes('Tamil Nadu')) {
                if (el.children.length === 0 && el.textContent.includes('India')) {
                    el.textContent = contact.address;
                }
            }
        });
    }
    
    // Update Color Scheme
    function updateColors() {
        const colors = DataManager.colors.get();
        if (!colors) return;
        
        // Apply colors to CSS variables
        document.documentElement.style.setProperty('--primary-red', colors.primary);
        document.documentElement.style.setProperty('--dark-red', colors.secondary);
        document.documentElement.style.setProperty('--light-gray', colors.background);
        document.documentElement.style.setProperty('--dark-gray', colors.text);
        
        console.log('Colors applied:', colors);
    }
    
    // Update Hero Slides
    function updateHeroSlides() {
        const slides = DataManager.slides.getAll();
        if (!slides || slides.length === 0) return;
        
        const slideElements = document.querySelectorAll('.slide');
        
        slides.forEach((slideData, index) => {
            const slideEl = slideElements[index];
            if (!slideEl) return;
            
            // Update title
            const titleEl = slideEl.querySelector('h1');
            if (titleEl) titleEl.textContent = slideData.title;
            
            // Update subtitle
            const subtitleEl = slideEl.querySelector('.slide-subtitle');
            if (subtitleEl) subtitleEl.textContent = slideData.subtitle;
            
            // Update description
            const descEl = slideEl.querySelector('.slide-content p');
            if (descEl) descEl.textContent = slideData.description;
            
            // Update background gradient
            if (slideData.gradient) {
                slideEl.style.background = slideData.gradient;
            }
        });
    }
    
    // Update Statistics
    function updateStats() {
        const stats = DataManager.getSection('stats');
        if (!stats) return;
        
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            const label = item.querySelector('.stat-label')?.textContent.toLowerCase();
            const numberEl = item.querySelector('.stat-number');
            
            if (!numberEl) return;
            
            if (label?.includes('machine')) {
                numberEl.textContent = stats.machinesSold;
            } else if (label?.includes('countries')) {
                numberEl.textContent = stats.countriesServed;
            } else if (label?.includes('experience') || label?.includes('years')) {
                numberEl.textContent = stats.yearsExperience;
            } else if (label?.includes('satisfaction')) {
                numberEl.textContent = stats.satisfactionRate;
            }
        });
    }
    
    // Update Products (for products page)
    function updateProducts() {
        const products = DataManager.products.getAll();
        if (!products || products.length === 0) return;
        
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        // Clear existing products
        productsGrid.innerHTML = '';
        
        // Add products from admin panel
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        console.log(`Loaded ${products.length} products from admin panel`);
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        const badgeHTML = product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : '';
        
        card.innerHTML = `
            <div class="product-image">
                ${badgeHTML}
                <div class="image-placeholder">${product.icon}</div>
                <div class="product-overlay">
                    <button class="quick-view-btn">Quick View</button>
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <ul class="product-specs">
                    ${Object.entries(product.specs || {}).map(([key, value]) => `
                        <li>
                            <span class="spec-label">${formatSpecLabel(key)}</span>
                            <span class="spec-value">${value}</span>
                        </li>
                    `).join('')}
                </ul>
                <div class="product-actions">
                    <a href="#" class="btn-primary">Learn More</a>
                    <button class="btn-secondary" onclick="openQuoteForm()">Get Quote</button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function formatSpecLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
    
    // Update Team Members (for about page)
    function updateTeamMembers() {
        const team = DataManager.team.getAll();
        if (!team || team.length === 0) return;
        
        const teamGrid = document.querySelector('.team-grid');
        if (!teamGrid) return;
        
        teamGrid.innerHTML = team.map(member => `
            <div class="team-card">
                <div class="team-avatar">${member.avatar}</div>
                <h3>${member.name}</h3>
                <p class="team-role">${member.position}</p>
                <p class="team-bio">${member.bio}</p>
            </div>
        `).join('');
    }
    
    // Update Testimonials
    function updateTestimonials() {
        const testimonials = DataManager.testimonials.getAll();
        if (!testimonials || testimonials.length === 0) return;
        
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;
        
        slider.innerHTML = testimonials.map((t, index) => `
            <div class="testimonial ${index === 0 ? 'active' : ''}">
                <div class="testimonial-icon">"</div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${t.avatar}</div>
                    <div class="author-info">
                        <h4>${t.name}</h4>
                        <p>${t.position}, ${t.company}</p>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Reinitialize testimonial slider if function exists
        if (typeof initializeTestimonials === 'function') {
            initializeTestimonials();
        }
    }
    
    // Update Site Info (company name, tagline, etc.)
    function updateSiteInfo() {
        const siteInfo = DataManager.siteInfo.get();
        if (!siteInfo) return;
        
        // Update company name in logo and throughout site
        document.querySelectorAll('.logo-main').forEach(el => {
            el.textContent = siteInfo.companyName;
        });
        
        // Update tagline
        document.querySelectorAll('.logo-sub, .hero-subtitle').forEach(el => {
            if (el.classList.contains('logo-sub')) {
                el.textContent = 'Private Limited';
            }
        });
        
        // Update meta tags
        document.title = `${siteInfo.companyName} - ${siteInfo.tagline}`;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = siteInfo.description;
    }
    
    // Expose reload function globally
    window.reloadWebsiteData = initWebsite;
    
})();

console.log('Website Loader initialized - Content will update from admin panel');