// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    // Verify token
    try {
        const response = await fetch('../../backend/api/auth/verify.php', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        
        const result = await response.json();
        
        if (!result.success) {
            alert('Session expired. Please login again.');
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }
        
        // Load admin panel data
        loadAllData();
        
    } catch (error) {
        console.error('Auth verification error:', error);
        alert('Authentication failed');
        window.location.href = 'login.html';
    }
});

// Logout function
function logout() {
    const token = localStorage.getItem('auth_token');
    
    fetch('../../backend/api/auth/logout.php', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(() => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}