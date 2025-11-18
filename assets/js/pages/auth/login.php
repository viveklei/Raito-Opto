document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const submitBtn = document.querySelector('.btn-login');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('../../backend/api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (result.success) {
            // Store token
            localStorage.setItem('auth_token', result.data.token);
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify(result.data.user));
            
            showToast('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    }
});