/**
 * Data Manager - Centralized data management system
 * This file handles all data operations between admin panel and website
 */

const DataManager = {
    // Default website data structure
    defaultData: {
        siteInfo: {
            companyName: 'Raito Opto Electronics Private Limited',
            tagline: 'World Leader in Laser Cutting Solutions',
            description: 'Founded in 1999, Raito Opto Electronics Private Limited has been at the forefront of laser cutting innovation.',
            logo: '⚡'
        },
        
        contactInfo: {
            email: 'sales@raitoopto.com',
            phone: '+91 (422) 123-4567',
            supportEmail: 'support@raitoopto.com',
            whatsapp: '+91 98765 43210',
            address: '123 Industrial Park, Palladam, Tamil Nadu 641664, India',
            businessHours: 'Mon-Fri: 8AM-6PM EST',
            socialMedia: {
                facebook: 'https://facebook.com/raitoopto',
                twitter: 'https://twitter.com/raitoopto',
                linkedin: 'https://linkedin.com/company/raitoopto',
                youtube: 'https://youtube.com/raitoopto'
            }
        },
        
        colors: {
            primary: '#d32f2f',
            secondary: '#b71c1c',
            background: '#f8f8f8',
            text: '#1a1a1a'
        },
        
        heroSlides: [
            {
                id: 1,
                title: 'Precision Fiber Laser Cutting Systems',
                subtitle: 'World Leader in Laser Technology',
                description: 'Experience unmatched cutting speed, accuracy, and efficiency with our advanced fiber laser technology.',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            {
                id: 2,
                title: 'Cutting-Edge Performance & Reliability',
                subtitle: 'Innovation That Drives Industry',
                description: 'Achieve superior cutting results with speeds up to 150m/min and positioning accuracy of ±0.03mm.',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            },
            {
                id: 3,
                title: '10,000+ Installations Worldwide',
                subtitle: 'Trusted Globally',
                description: 'Join industry leaders across 50+ countries who trust TechCut for their laser cutting needs.',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }
        ],
        
        products: [
            {
                id: 1,
                name: 'Fiber Laser Cutter Pro 3015',
                category: 'fiber',
                price: '₹45,00,000',
                description: 'High-performance fiber laser cutting system with exceptional speed and precision.',
                icon: '⚡',
                specs: {
                    power: '1kW - 30kW',
                    cuttingArea: '3000 x 1500mm',
                    maxSpeed: '150m/min',
                    accuracy: '±0.03mm'
                },
                status: 'active',
                badge: 'BESTSELLER'
            },
            {
                id: 2,
                name: 'CO2 Laser System Standard',
                category: 'co2',
                price: '₹15,00,000',
                description: 'Versatile CO2 laser cutting solution for non-metal materials.',
                icon: '🔷',
                specs: {
                    power: '80W - 300W',
                    cuttingArea: '1300 x 900mm',
                    maxThickness: '25mm',
                    precision: '±0.05mm'
                },
                status: 'active',
                badge: 'NEW'
            },
            {
                id: 3,
                name: 'Tube Cutting Machine TC-300',
                category: 'tube',
                price: '₹35,00,000',
                description: 'Advanced tube and pipe cutting solution for complex geometries.',
                icon: '🎯',
                specs: {
                    tubeDiameter: '20-300mm',
                    maxLength: '6500mm',
                    precision: '±0.05mm',
                    capacity: '24/7 Operation'
                },
                status: 'active',
                badge: 'ADVANCED'
            }
        ],
        
        teamMembers: [
            {
                id: 1,
                name: 'Rajesh Kumar',
                position: 'CEO & Founder',
                bio: '25+ years of experience in laser technology and manufacturing innovation',
                avatar: '👨‍💼'
            },
            {
                id: 2,
                name: 'Dr. Priya Sharma',
                position: 'CTO',
                bio: 'Leading R&D efforts with PhD in Optical Engineering from MIT',
                avatar: '👩‍🔬'
            },
            {
                id: 3,
                name: 'Amit Patel',
                position: 'VP of Operations',
                bio: 'Expert in manufacturing excellence and global supply chain management',
                avatar: '👨‍💻'
            }
        ],
        
        testimonials: [
            {
                id: 1,
                name: 'John Davidson',
                company: 'MetalWorks Inc.',
                position: 'Manufacturing Director',
                text: 'Raito Opto\'s fiber laser has revolutionized our production line. We\'ve seen a 40% increase in throughput.',
                avatar: 'JD',
                rating: 5
            },
            {
                id: 2,
                name: 'Sarah Martinez',
                company: 'Precision Parts Co.',
                position: 'Operations Manager',
                text: 'The precision and reliability of Raito Opto machines are unmatched. We run 24/7 operations with minimal downtime.',
                avatar: 'SM',
                rating: 5
            }
        ],
        
        stats: {
            machinesSold: '10,000+',
            countriesServed: '50+',
            yearsExperience: '25',
            satisfactionRate: '99.8%'
        }
    },
    
    // Initialize data
    init() {
        const saved = localStorage.getItem('websiteData');
        if (!saved) {
            this.saveData(this.defaultData);
        }
    },
    
    // Get all data
    getData() {
        const saved = localStorage.getItem('websiteData');
        return saved ? JSON.parse(saved) : this.defaultData;
    },
    
    // Save all data
    saveData(data) {
        localStorage.setItem('websiteData', JSON.stringify(data));
        localStorage.setItem('lastUpdated', new Date().toISOString());
        return true;
    },
    
    // Update specific section
    updateSection(section, data) {
        const allData = this.getData();
        allData[section] = data;
        this.saveData(allData);
        return true;
    },
    
    // Get specific section
    getSection(section) {
        const data = this.getData();
        return data[section] || null;
    },
    
    // Products operations
    products: {
        getAll() {
            return DataManager.getSection('products');
        },
        
        add(product) {
            const products = this.getAll();
            product.id = Date.now();
            product.status = 'active';
            products.push(product);
            DataManager.updateSection('products', products);
            return product;
        },
        
        update(id, updatedData) {
            const products = this.getAll();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedData };
                DataManager.updateSection('products', products);
                return products[index];
            }
            return null;
        },
        
        delete(id) {
            let products = this.getAll();
            products = products.filter(p => p.id !== id);
            DataManager.updateSection('products', products);
            return true;
        },
        
        get(id) {
            const products = this.getAll();
            return products.find(p => p.id === id);
        }
    },
    
    // Slides operations
    slides: {
        getAll() {
            return DataManager.getSection('heroSlides');
        },
        
        add(slide) {
            const slides = this.getAll();
            slide.id = Date.now();
            slides.push(slide);
            DataManager.updateSection('heroSlides', slides);
            return slide;
        },
        
        update(id, updatedData) {
            const slides = this.getAll();
            const index = slides.findIndex(s => s.id === id);
            if (index !== -1) {
                slides[index] = { ...slides[index], ...updatedData };
                DataManager.updateSection('heroSlides', slides);
                return slides[index];
            }
            return null;
        },
        
        delete(id) {
            let slides = this.getAll();
            slides = slides.filter(s => s.id !== id);
            DataManager.updateSection('heroSlides', slides);
            return true;
        }
    },
    
    // Team operations
    team: {
        getAll() {
            return DataManager.getSection('teamMembers');
        },
        
        add(member) {
            const team = this.getAll();
            member.id = Date.now();
            team.push(member);
            DataManager.updateSection('teamMembers', team);
            return member;
        },
        
        update(id, updatedData) {
            const team = this.getAll();
            const index = team.findIndex(m => m.id === id);
            if (index !== -1) {
                team[index] = { ...team[index], ...updatedData };
                DataManager.updateSection('teamMembers', team);
                return team[index];
            }
            return null;
        },
        
        delete(id) {
            let team = this.getAll();
            team = team.filter(m => m.id !== id);
            DataManager.updateSection('teamMembers', team);
            return true;
        }
    },
    
    // Testimonials operations
    testimonials: {
        getAll() {
            return DataManager.getSection('testimonials');
        },
        
        add(testimonial) {
            const testimonials = this.getAll();
            testimonial.id = Date.now();
            testimonials.push(testimonial);
            DataManager.updateSection('testimonials', testimonials);
            return testimonial;
        },
        
        update(id, updatedData) {
            const testimonials = this.getAll();
            const index = testimonials.findIndex(t => t.id === id);
            if (index !== -1) {
                testimonials[index] = { ...testimonials[index], ...updatedData };
                DataManager.updateSection('testimonials', testimonials);
                return testimonials[index];
            }
            return null;
        },
        
        delete(id) {
            let testimonials = this.getAll();
            testimonials = testimonials.filter(t => t.id !== id);
            DataManager.updateSection('testimonials', testimonials);
            return true;
        }
    },
    
    // Contact info operations
    contact: {
        get() {
            return DataManager.getSection('contactInfo');
        },
        
        update(data) {
            DataManager.updateSection('contactInfo', data);
            return data;
        }
    },
    
    // Colors operations
    colors: {
        get() {
            return DataManager.getSection('colors');
        },
        
        update(colors) {
            DataManager.updateSection('colors', colors);
            // Apply colors to CSS variables
            if (typeof document !== 'undefined') {
                document.documentElement.style.setProperty('--primary-red', colors.primary);
                document.documentElement.style.setProperty('--dark-red', colors.secondary);
                document.documentElement.style.setProperty('--light-gray', colors.background);
                document.documentElement.style.setProperty('--dark-gray', colors.text);
            }
            return colors;
        }
    },
    
    // Site info operations
    siteInfo: {
        get() {
            return DataManager.getSection('siteInfo');
        },
        
        update(info) {
            DataManager.updateSection('siteInfo', info);
            return info;
        }
    },
    
    // Export data
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `website-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Import data
    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            this.saveData(data);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    },
    
    // Reset to default
    reset() {
        this.saveData(this.defaultData);
        if (typeof document !== 'undefined') {
            location.reload();
        }
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    DataManager.init();
    window.DataManager = DataManager;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}