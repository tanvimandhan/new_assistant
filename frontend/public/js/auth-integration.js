// // Authentication Integration for Main App
// class AuthIntegration {
//     constructor() {
//         this.currentUser = null;
//         this.init();
//     }

//     init() {
//         this.checkAuthStatus();
//         this.setupAuthEventListeners();
//         this.setupTabSwitching();
//     }

//     checkAuthStatus() {
//         const token = localStorage.getItem('authToken');
//         const userData = localStorage.getItem('userData');
        
//         if (token && userData) {
//             try {
//                 this.currentUser = JSON.parse(userData);
//                 this.showAuthenticatedState();
//             } catch (error) {
//                 console.error('Error parsing user data:', error);
//                 this.logout();
//             }
//         } else {
//             this.showUnauthenticatedState();
//         }
//     }

//     setupAuthEventListeners() {
//         // Login form submission
//         const loginForm = document.getElementById('loginForm');
//         if (loginForm) {
//             loginForm.addEventListener('submit', async (e) => {
//                 e.preventDefault();
//                 await this.handleLogin();
//             });
//         }

//         // Register form submission
//         const registerForm = document.getElementById('registerForm');
//         if (registerForm) {
//             registerForm.addEventListener('submit', async (e) => {
//                 e.preventDefault();
//                 await this.handleRegister();
//             });
//         }

//         // Logout button
//         const logoutBtn = document.getElementById('logoutBtn');
//         if (logoutBtn) {
//             logoutBtn.addEventListener('click', () => {
//                 this.logout();
//             });
//         }
//     }

//     setupTabSwitching() {
//         const tabs = document.querySelectorAll('.auth-tab');
//         tabs.forEach(tab => {
//             tab.addEventListener('click', () => {
//                 tabs.forEach(t => t.classList.remove('active'));
//                 tab.classList.add('active');
                
//                 const formType = tab.dataset.tab;
//                 const loginForm = document.getElementById('loginForm');
//                 const registerForm = document.getElementById('registerForm');
                
//                 if (formType === 'login') {
//                     loginForm.style.display = 'block';
//                     registerForm.style.display = 'none';
//                 } else {
//                     loginForm.style.display = 'none';
//                     registerForm.style.display = 'block';
//                 }
//             });
//         });
//     }

//     async handleLogin() {
//         const email = document.getElementById('loginEmail').value;
//         const password = document.getElementById('loginPassword').value;
//         const errorDiv = document.getElementById('loginError');
//         const submitBtn = document.querySelector('#loginForm button[type="submit"]');

//         // Clear previous errors
//         errorDiv.textContent = '';
//         errorDiv.style.display = 'none';

//         // Show loading state
//         submitBtn.disabled = true;
//         submitBtn.textContent = 'Signing In...';

//         try {
//             const response = await fetch('/api/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // Store token and user data
//                 localStorage.setItem('authToken', data.token);
//                 localStorage.setItem('userData', JSON.stringify(data.user));
                
//                 this.currentUser = data.user;
//                 this.showAuthenticatedState();
                
//                 // Show success message
//                 this.showSuccess('Login successful! Welcome back.');
//             } else {
//                 throw new Error(data.error || 'Login failed');
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             this.showError(error.message || 'An error occurred during login', 'loginError');
//         } finally {
//             // Reset button state
//             submitBtn.disabled = false;
//             submitBtn.textContent = 'Sign In';
//         }
//     }

//     async handleRegister() {
//         const username = document.getElementById('registerUsername').value;
//         const email = document.getElementById('registerEmail').value;
//         const password = document.getElementById('registerPassword').value;
//         const nativeLanguage = document.getElementById('nativeLanguage').value;
//         const errorDiv = document.getElementById('registerError');
//         const submitBtn = document.querySelector('#registerForm button[type="submit"]');

//         // Clear previous errors
//         errorDiv.textContent = '';
//         errorDiv.style.display = 'none';

//         // Show loading state
//         submitBtn.disabled = true;
//         submitBtn.textContent = 'Creating Account...';

//         try {
//             const response = await fetch('/api/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username,
//                     email,
//                     password,
//                     nativeLanguage
//                 })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // Store token and user data
//                 localStorage.setItem('authToken', data.token);
//                 localStorage.setItem('userData', JSON.stringify(data.user));
                
//                 this.currentUser = data.user;
//                 this.showAuthenticatedState();
                
//                 // Show success message
//                 this.showSuccess('Account created successfully! Welcome to Language Learning Assistant.');
//             } else {
//                 throw new Error(data.error || 'Registration failed');
//             }
//         } catch (error) {
//             console.error('Signup error:', error);
//             this.showError(error.message || 'An error occurred during registration', 'registerError');
//         } finally {
//             // Reset button state
//             submitBtn.disabled = false;
//             submitBtn.textContent = 'Create Account';
//         }
//     }

//     showAuthenticatedState() {
//         // Hide authentication forms
//         const authForms = document.getElementById('authForms');
//         if (authForms) {
//             authForms.style.display = 'none';
//         }

//         // Show main app and auth header
//         const mainApp = document.getElementById('mainApp');
//         const authHeader = document.getElementById('authHeader');
        
//         if (mainApp) mainApp.style.display = 'block';
//         if (authHeader) {
//             authHeader.style.display = 'flex';
//             const userGreeting = document.getElementById('userGreeting');
//             if (userGreeting) {
//                 userGreeting.textContent = `Welcome, ${this.currentUser.username}!`;
//             }
//         }

//         // Dispatch event to notify main app that user is authenticated
//         document.dispatchEvent(new CustomEvent('userAuthenticated', {
//             detail: { user: this.currentUser }
//         }));
//     }

//     showUnauthenticatedState() {
//         // Show authentication forms
//         const authForms = document.getElementById('authForms');
//         if (authForms) {
//             authForms.style.display = 'block';
//         }

//         // Hide main app and auth header
//         const mainApp = document.getElementById('mainApp');
//         const authHeader = document.getElementById('authHeader');
        
//         if (mainApp) mainApp.style.display = 'none';
//         if (authHeader) authHeader.style.display = 'none';

//         // Dispatch event to notify main app that user is not authenticated
//         document.dispatchEvent(new CustomEvent('userUnauthenticated'));
//     }

//     logout() {
//         // Clear stored data
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
        
//         // Reset current user
//         this.currentUser = null;
        
//         // Show unauthenticated state
//         this.showUnauthenticatedState();
        
//         // Show logout message
//         this.showSuccess('You have been logged out successfully.');
//     }

//     showError(message, elementId = 'errorMessage') {
//         const errorDiv = document.getElementById(elementId);
//         if (errorDiv) {
//             errorDiv.textContent = message;
//             errorDiv.style.display = 'block';
//             errorDiv.className = 'error-message show';
//         }
//     }

//     showSuccess(message) {
//         // Create a temporary success message
//         const successDiv = document.createElement('div');
//         successDiv.className = 'success-message show';
//         successDiv.textContent = message;
//         successDiv.style.position = 'fixed';
//         successDiv.style.top = '20px';
//         successDiv.style.right = '20px';
//         successDiv.style.zIndex = '1000';
//         successDiv.style.maxWidth = '300px';
        
//         document.body.appendChild(successDiv);
        
//         // Remove after 3 seconds
//         setTimeout(() => {
//             successDiv.remove();
//         }, 3000);
//     }

//     // Method to check if user is authenticated
//     isAuthenticated() {
//         return this.currentUser !== null;
//     }

//     // Method to get current user
//     getCurrentUser() {
//         return this.currentUser;
//     }

//     // Method to get auth token
//     getAuthToken() {
//         return localStorage.getItem('authToken');
//     }
// }

// // Initialize authentication integration when page loads
// document.addEventListener('DOMContentLoaded', () => {
//     window.authIntegration = new AuthIntegration();
// });


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

        // Progress section toggle buttons
        this.setupProgressToggles();
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

        // Show main app, auth header, and progress section
        const mainApp = document.getElementById('mainApp');
        const authHeader = document.getElementById('authHeader');
        const userProgress = document.getElementById('userProgress');
        
        if (mainApp) mainApp.style.display = 'block';
        if (authHeader) {
            authHeader.style.display = 'flex';
            const userGreeting = document.getElementById('userGreeting');
            if (userGreeting) {
                userGreeting.textContent = `Welcome, ${this.currentUser.username}!`;
            }
        }
        if (userProgress) userProgress.style.display = 'block';

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

        // Hide main app, auth header, and progress section
        const mainApp = document.getElementById('mainApp');
        const authHeader = document.getElementById('authHeader');
        const userProgress = document.getElementById('userProgress');
        
        if (mainApp) mainApp.style.display = 'none';
        if (authHeader) authHeader.style.display = 'none';
        if (userProgress) userProgress.style.display = 'none';

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

    setupProgressToggles() {
        // Sessions toggle
        const toggleSessions = document.getElementById('toggleSessions');
        if (toggleSessions) {
            toggleSessions.addEventListener('click', () => {
                this.toggleProgressSection('sessions', toggleSessions);
            });
        }

        // Vocabulary toggle
        const toggleVocabulary = document.getElementById('toggleVocabulary');
        if (toggleVocabulary) {
            toggleVocabulary.addEventListener('click', () => {
                this.toggleProgressSection('vocabulary', toggleVocabulary);
            });
        }
    }

    async toggleProgressSection(sectionType, button) {
        const contentId = `${sectionType}Content`;
        const content = document.getElementById(contentId);
        
        if (!content) return;

        if (content.style.display === 'none') {
            // Show content
            content.style.display = 'block';
            button.textContent = 'Hide';
            button.classList.add('active');
            
            // Load data if not already loaded
            if (content.querySelector('.loading')) {
                await this.loadProgressData(sectionType, content);
            }
        } else {
            // Hide content
            content.style.display = 'none';
            button.textContent = 'Show';
            button.classList.remove('active');
        }
    }

    async loadProgressData(sectionType, contentElement) {
        try {
            const token = this.getAuthToken();
            if (!token) return;

            if (sectionType === 'sessions') {
                await this.loadSessions(contentElement);
            } else if (sectionType === 'vocabulary') {
                await this.loadVocabulary(contentElement);
            }
        } catch (error) {
            console.error(`Error loading ${sectionType}:`, error);
            contentElement.innerHTML = `
                <div class="error">
                    <p>Failed to load ${sectionType}. Please try again.</p>
                </div>
            `;
        }
    }

    async loadSessions(contentElement) {
        const response = await fetch('/api/user/sessions?limit=10', {
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sessions');
        }

        const sessions = await response.json();
        
        if (sessions.length === 0) {
            contentElement.innerHTML = `
                <div class="empty-state">
                    <p>No learning sessions yet.</p>
                    <p>Start practicing to see your history!</p>
                </div>
            `;
            return;
        }

        const sessionsHTML = sessions.map(session => `
            <div class="session-item">
                <div class="session-header">
                    <span class="session-language">${session.language}</span>
                    <span class="session-date">${new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="session-content">
                    <div class="session-text">
                        <strong>You said:</strong> "${session.originalText}"
                    </div>
                    <div class="session-correction">
                        <strong>Corrected:</strong> "${session.correctedText}"
                    </div>
                    <div class="session-score">
                        <strong>Fluency Score:</strong> ${session.fluencyScore}/100
                    </div>
                </div>
            </div>
        `).join('');

        contentElement.innerHTML = sessionsHTML;
    }

    async loadVocabulary(contentElement) {
        const response = await fetch('/api/user/vocabulary', {
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch vocabulary');
        }

        const vocabulary = await response.json();
        
        if (vocabulary.length === 0) {
            contentElement.innerHTML = `
                <div class="empty-state">
                    <p>No vocabulary words yet.</p>
                    <p>Start learning to build your vocabulary!</p>
                </div>
            `;
            return;
        }

        const vocabularyHTML = vocabulary.map(word => `
            <div class="vocab-item ${word.mastered ? 'mastered' : ''}">
                <div class="vocab-word">
                    <strong>${word.word}</strong>
                    <span class="difficulty-badge difficulty-${word.difficulty}">${word.difficulty}</span>
                </div>
                <div class="vocab-translation">${word.translation}</div>
                <div class="vocab-example">${word.usageExample}</div>
                <div class="vocab-stats">
                    Reviewed: ${word.reviewCount} times
                    ${word.mastered ? ' | ✅ Mastered' : ''}
                </div>
            </div>
        `).join('');

        contentElement.innerHTML = vocabularyHTML;
    }
}

// Initialize authentication integration when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.authIntegration = new AuthIntegration();
});
