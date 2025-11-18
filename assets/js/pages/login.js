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
        
        const data = await response.json();
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (data.success) {
            localStorage.setItem('auth_token', data.data.token);
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify(data.data.user));
            
            showToast('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showToast('Login failed. Please try again.', 'error');
        console.error('Login error:', error);
    }
});