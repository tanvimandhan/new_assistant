// Authentication Handler for Login and Signup Pages
class AuthHandler {
    constructor() {
        this.baseUrl = window.location.origin;
        this.init();
    }

    init() {
        // Check if we're on login or signup page
        const isLoginPage = window.location.pathname.includes('login');
        const isSignupPage = window.location.pathname.includes('signup');
        
        if (isLoginPage) {
            this.setupLoginForm();
        } else if (isSignupPage) {
            this.setupSignupForm();
        }

        // Check if user is already authenticated
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            // User is already logged in, redirect to main app
            window.location.href = '/';
        }
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }
    }

    setupSignupForm() {
        const form = document.getElementById('signupForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSignup();
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');

        // Clear previous errors
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';

        try {
            const response = await fetch(`${this.baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Show success message
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect to main app after a short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'An error occurred during login');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }

    async handleSignup() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const nativeLanguage = document.getElementById('nativeLanguage').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = document.querySelector('#signupForm button[type="submit"]');

        // Clear previous errors
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        try {
            const response = await fetch(`${this.baseUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    nativeLanguage
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Show success message
                this.showSuccess('Account created successfully! Redirecting...');
                
                // Redirect to main app after a short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showError(error.message || 'An error occurred during registration');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.className = 'error-message show';
        }
    }

    showSuccess(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.className = 'success-message show';
        }
    }
}

// Initialize authentication handler when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthHandler();
});
