// DOM elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.querySelector('.error-text');
const togglePassword = document.getElementById('togglePassword');
const rememberCheckbox = document.getElementById('remember');
const languageToggle = document.getElementById('languageToggle');

// API endpoint
const LOGIN_API_URL = 'http://localhost:5000/api/admin/login';

// Language management
let currentLanguage = localStorage.getItem('adminLanguage') || 'en';

// Initialize the login page
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    setLanguage(currentLanguage);
    
    // Check if user is already logged in (optional)
    checkExistingSession();
    
    // Set up event listeners
    setupEventListeners();
    
    // Focus on username input
    usernameInput.focus();
});

// Language functions
function setLanguage(lang) {
    document.querySelectorAll('[data-en][data-mr]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });

    document.querySelectorAll('[data-placeholder-en][data-placeholder-mr]').forEach(element => {
        element.placeholder = element.getAttribute(`data-placeholder-${lang}`);
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        document.title = titleElement.getAttribute(`data-${lang}`);
    }

    languageToggle.textContent = languageToggle.getAttribute(`data-${lang}`);
    document.documentElement.lang = lang === 'en' ? 'en' : 'mr';
    localStorage.setItem('adminLanguage', lang);
    currentLanguage = lang;
}

// Set up all event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    togglePassword.addEventListener('click', togglePasswordVisibility);
    languageToggle.addEventListener('click', () => {
        setLanguage(currentLanguage === 'en' ? 'mr' : 'en');
    });
    usernameInput.addEventListener('input', clearErrorMessage);
    passwordInput.addEventListener('input', clearErrorMessage);
    usernameInput.addEventListener('keypress', handleEnterKey);
    passwordInput.addEventListener('keypress', handleEnterKey);
    usernameInput.addEventListener('blur', validateUsername);
    passwordInput.addEventListener('blur', validatePassword);
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!validateForm(username, password)) {
        return;
    }
    
    setLoadingState(true);
    clearErrorMessage();
    
    try {
        const loginData = { username, password };
        
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            handleLoginSuccess(data, username);
        } else {
            const errorMsg = currentLanguage === 'en' ? 
                (data.message || 'Invalid username or password') : 
                'अवैध वापरकर्तानाव किंवा पासवर्ड';
            handleLoginError(errorMsg);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        const errorMsg = currentLanguage === 'en' ? 
            'Connection error. Please check your network and try again.' : 
            'कनेक्शन त्रुटी. कृपया आपले नेटवर्क तपासा आणि पुन्हा प्रयत्न करा.';
        handleLoginError(errorMsg);
    } finally {
        setLoadingState(false);
    }
}

// Handle successful login
function handleLoginSuccess(data, username) {
    if (rememberCheckbox.checked) {
        localStorage.setItem('adminUser', username);
        localStorage.setItem('loginTimestamp', Date.now().toString());
    }
    
    if (data.token) {
        sessionStorage.setItem('adminToken', data.token);
    }
    
    const successText = currentLanguage === 'en' ? 'Success!' : 'यशस्वी!';
    btnText.textContent = successText;
    loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    // 🔹 Redirect to dashboard.html instead of admin.html
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

// Handle login error
function handleLoginError(message) {
    showErrorMessage(message);
    loginForm.classList.add('shake');
    setTimeout(() => loginForm.classList.remove('shake'), 500);
    passwordInput.value = '';
    passwordInput.focus();
}

// Validate form inputs
function validateForm(username, password) {
    if (!username) {
        showErrorMessage(currentLanguage === 'en' ? 
            'Please enter your username' : 'कृपया आपले वापरकर्तानाव प्रविष्ट करा');
        usernameInput.focus();
        return false;
    }
    
    if (!password) {
        showErrorMessage(currentLanguage === 'en' ? 
            'Please enter your password' : 'कृपया आपला पासवर्ड प्रविष्ट करा');
        passwordInput.focus();
        return false;
    }
    
    if (username.length < 3) {
        showErrorMessage(currentLanguage === 'en' ? 
            'Username must be at least 3 characters long' : 
            'वापरकर्तानाव किमान 3 अक्षरांचे असावे');
        usernameInput.focus();
        return false;
    }
    
    if (password.length < 6) {
        showErrorMessage(currentLanguage === 'en' ? 
            'Password must be at least 6 characters long' : 
            'पासवर्ड किमान 6 अक्षरांचा असावा');
        passwordInput.focus();
        return false;
    }
    
    return true;
}

// Individual field validation
function validateUsername() {
    const username = usernameInput.value.trim();
    usernameInput.style.borderColor = (username && username.length < 3) ? '#ef4444' : '#e5e7eb';
}

function validatePassword() {
    const password = passwordInput.value;
    passwordInput.style.borderColor = (password && password.length < 6) ? '#ef4444' : '#e5e7eb';
}

// Toggle password visibility
function togglePasswordVisibility() {
    const icon = togglePassword.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        loginBtn.style.cursor = 'not-allowed';
    } else {
        loginBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        loginBtn.style.cursor = 'pointer';
        btnText.textContent = currentLanguage === 'en' ? 'Sign In' : 'साइन इन करा';
        loginBtn.style.background = 'linear-gradient(135deg, #e81a39 0%, #c51432 50%, #a01128 100%)';
    }
}

// Show error message
function showErrorMessage(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    setTimeout(() => errorMessage.style.display = 'none', 5000);
}

// Clear error message
function clearErrorMessage() {
    errorMessage.style.display = 'none';
}

// Handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (event.target === usernameInput) {
            passwordInput.focus();
        } else if (event.target === passwordInput) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
}

// Check for existing session (optional)
function checkExistingSession() {
    const savedUser = localStorage.getItem('adminUser');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    const token = sessionStorage.getItem('adminToken');
    
    if (savedUser && loginTimestamp && token) {
        const hoursPassed = (Date.now() - parseInt(loginTimestamp)) / (1000 * 60 * 60);
        if (hoursPassed < 24) {
            usernameInput.value = savedUser;
            rememberCheckbox.checked = true;
        }
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (!rememberCheckbox.checked) {
        sessionStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('loginTimestamp');
    }
});

// Prevent form resubmission
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Shake animation CSS
const shakeStyles = `
    .shake { animation: formShake 0.6s ease-in-out; }
    @keyframes formShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeStyles;
document.head.appendChild(styleSheet);
