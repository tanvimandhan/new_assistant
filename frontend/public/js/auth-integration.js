// Authentication Integration for Main App
class AuthIntegration {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthEventListeners();
        this.setupTabSwitching();
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.showAuthenticatedState();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        } else {
            this.showUnauthenticatedState();
        }
    }

    setupAuthEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        // Register form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    setupTabSwitching() {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const formType = tab.dataset.tab;
                const loginForm = document.getElementById('loginForm');
                const registerForm = document.getElementById('registerForm');
                
                if (formType === 'login') {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            });
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');

        // Clear previous errors
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';

        try {
            const response = await fetch('/api/auth/login', {
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
                
                this.currentUser = data.user;
                this.showAuthenticatedState();
                
                // Show success message
                this.showSuccess('Login successful! Welcome back.');
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'An error occurred during login', 'loginError');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }

    async handleRegister() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const nativeLanguage = document.getElementById('nativeLanguage').value;
        const errorDiv = document.getElementById('registerError');
        const submitBtn = document.querySelector('#registerForm button[type="submit"]');

        // Clear previous errors
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        try {
            const response = await fetch('/api/auth/register', {
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
                
                this.currentUser = data.user;
                this.showAuthenticatedState();
                
                // Show success message
                this.showSuccess('Account created successfully! Welcome to Language Learning Assistant.');
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showError(error.message || 'An error occurred during registration', 'registerError');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    }

    showAuthenticatedState() {
        // Hide authentication forms
        const authForms = document.getElementById('authForms');
        if (authForms) {
            authForms.style.display = 'none';
        }

        // Show main app and auth header
        const mainApp = document.getElementById('mainApp');
        const authHeader = document.getElementById('authHeader');
        
        if (mainApp) mainApp.style.display = 'block';
        if (authHeader) {
            authHeader.style.display = 'flex';
            const userGreeting = document.getElementById('userGreeting');
            if (userGreeting) {
                userGreeting.textContent = `Welcome, ${this.currentUser.username}!`;
            }
        }

        // Dispatch event to notify main app that user is authenticated
        document.dispatchEvent(new CustomEvent('userAuthenticated', {
            detail: { user: this.currentUser }
        }));
    }

    showUnauthenticatedState() {
        // Show authentication forms
        const authForms = document.getElementById('authForms');
        if (authForms) {
            authForms.style.display = 'block';
        }

        // Hide main app and auth header
        const mainApp = document.getElementById('mainApp');
        const authHeader = document.getElementById('authHeader');
        
        if (mainApp) mainApp.style.display = 'none';
        if (authHeader) authHeader.style.display = 'none';

        // Dispatch event to notify main app that user is not authenticated
        document.dispatchEvent(new CustomEvent('userUnauthenticated'));
    }

    logout() {
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Reset current user
        this.currentUser = null;
        
        // Show unauthenticated state
        this.showUnauthenticatedState();
        
        // Show logout message
        this.showSuccess('You have been logged out successfully.');
    }

    showError(message, elementId = 'errorMessage') {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.className = 'error-message show';
        }
    }

    showSuccess(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.textContent = message;
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '1000';
        successDiv.style.maxWidth = '300px';
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Method to check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Method to get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Method to get auth token
    getAuthToken() {
        return localStorage.getItem('authToken');
    }
}

// Initialize authentication integration when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.authIntegration = new AuthIntegration();
});
