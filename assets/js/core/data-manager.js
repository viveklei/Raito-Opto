/**
 * API Manager - Replace DataManager with Backend API
 */

const API_BASE = 'http://localhost/raito-website/backend/api';
let authToken = localStorage.getItem('auth_token');

const APIManager = {
    // Authentication
    async login(email, password) {
        const response = await fetch(`${API_BASE}/auth/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            authToken = result.data.token;
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        return result;
    },
    
    async logout() {
        const response = await fetch(`${API_BASE}/auth/logout.php`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        localStorage.clear();
        return await response.json();
    },
    
    async verify() {
        const response = await fetch(`${API_BASE}/auth/verify.php`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        return await response.json();
    },
    
    // Products
    async getProducts(category = null, status = 'active') {
        let url = `${API_BASE}/products/read.php?status=${status}`;
        if (category) url += `&category=${category}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        return result.success ? result.data.products : [];
    },
    
    async createProduct(productData) {
        const response = await fetch(`${API_BASE}/products/create.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(productData)
        });
        
        return await response.json();
    },
    
    async updateProduct(id, productData) {
        const response = await fetch(`${API_BASE}/products/update.php`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ id, ...productData })
        });
        
        return await response.json();
    },
    
    async deleteProduct(id) {
        const response = await fetch(`${API_BASE}/products/delete.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ id })
        });
        
        return await response.json();
    }
};

// Make globally available
window.APIManager = APIManager;