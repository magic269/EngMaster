import { auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc } from './firebase-config.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;
const CSRF_TOKEN = generateCsrfToken();

function generateCsrfToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

function validateInput(input, type) {
    const maxLength = type === 'username' ? 50 : 100;
    const minLength = type === 'password' ? 8 : 3;
    const regex = type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : type === 'password' ? /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/ : /^[\w\s\u0600-\u06FF-]+$/;
    return input.length >= minLength && input.length <= maxLength && regex.test(input);
}

function checkLoginAttempts() {
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    const lockoutStart = parseInt(localStorage.getItem('lockoutStart') || '0');
    const now = Date.now();

    if (lockoutStart && now - lockoutStart < LOCKOUT_TIME) {
        const remaining = Math.ceil((LOCKOUT_TIME - (now - lockoutStart)) / 1000 / 60);
        throw new Error(`تم حظر المحاولات. حاول مرة أخرى بعد ${remaining} دقيقة.`);
    }

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
        localStorage.setItem('lockoutStart', now);
        localStorage.setItem('loginAttempts', '0');
        throw new Error('تم حظر المحاولات بسبب التكرار. حاول لاحقًا.');
    }

    return attempts;
}

function incrementLoginAttempts() {
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
    localStorage.setItem('loginAttempts', attempts);
}

function resetLoginAttempts() {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutStart');
}

async function handleLogin(e) {
    e.preventDefault();
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    try {
        checkLoginAttempts();

        const formData = new FormData(e.target);
        const email = sanitizeInput(formData.get('email'));
        const password = formData.get('password');
        const csrf = formData.get('csrf');

        if (csrf !== CSRF_TOKEN) {
            throw new Error('فشل التحقق من الأمان. حاول مرة أخرى.');
        }

        if (!email || !password) {
            throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

        if (!userDoc.exists()) {
            throw new Error('الحساب غير موجود!');
        }

        resetLoginAttempts();
        e.target.reset();
        window.location.href = 'index.html';
    } catch (error) {
        incrementLoginAttempts();
        const errorMsg = error.code === 'auth/wrong-password' ? 'كلمة المرور غير صحيحة!' :
                         error.code === 'auth/user-not-found' ? 'البريد الإلكتروني غير مسجل!' : 
                         error.message;
        errorMessage.textContent = errorMsg || 'خطأ في تسجيل الدخول. حاول مرة أخرى.';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const errorMessage = document.getElementById('error-message-signup');
    errorMessage.textContent = '';

    try {
        const formData = new FormData(e.target);
        const username = sanitizeInput(formData.get('username'));
        const email = sanitizeInput(formData.get('email'));
        const password = formData.get('password');
        const csrf = formData.get('csrf');

        if (csrf !== CSRF_TOKEN) {
            throw new Error('فشل التحقق من الأمان. حاول مرة أخرى.');
        }

        if (!validateInput(username, 'username')) {
            throw new Error('اسم المستخدم يجب أن يكون بين 3 و50 حرفًا ويحتوي على أحرف مسموح بها فقط.');
        }

        if (!validateInput(email, 'email')) {
            throw new Error('البريد الإلكتروني غير صالح.');
        }

        if (!validateInput(password, 'password')) {
            throw new Error('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، بما في ذلك رقم وحرف.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            username,
            email,
            createdAt: new Date().toISOString(),
        });

        e.target.reset();
        alert('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.');
        document.querySelector('.login-container').classList.remove('signup-mode');
    } catch (error) {
        const errorMsg = error.code === 'auth/email-already-in-use' ? 'البريد الإلكتروني مستخدم بالفعل!' :
                         error.code === 'auth/invalid-email' ? 'البريد الإلكتروني غير صالح!' :
                         error.code === 'auth/weak-password' ? 'كلمة المرور ضعيفة جدًا!' :
                         error.message;
        errorMessage.textContent = errorMsg || 'خطأ في إنشاء الحساب. حاول مرة أخرى.';
    }
}

function handleSkip() {
    localStorage.setItem('skip', btoa(encodeURIComponent('true')));
    window.location.href = 'index.html';
}

function toggleForms() {
    const container = document.querySelector('.login-container');
    container.classList.toggle('signup-mode');
}

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    const skipLink = document.getElementById('skip-link');
    const skipLinkSignup = document.getElementById('skip-link-signup');

    [loginForm, signupForm].forEach((form) => {
        if (form) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf';
            csrfInput.value = CSRF_TOKEN;
            form.appendChild(csrfInput);
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleRegister);
    }

    if (signupLink) {
        signupLink.addEventListener('click', toggleForms);
    }

    if (loginLink) {
        loginLink.addEventListener('click', toggleForms);
    }

    if (skipLink) {
        skipLink.addEventListener('click', handleSkip);
    }

    if (skipLinkSignup) {
        skipLinkSignup.addEventListener('click', handleSkip);
    }

    document.querySelectorAll('input[type="password"]').forEach((input) => {
        input.addEventListener('paste', (e) => e.preventDefault());
    });

    document.querySelectorAll('input:not([type="password"])').forEach((input) => {
        input.addEventListener('input', () => {
            input.value = sanitizeInput(input.value);
        });
    });
}

function preventClickjacking() {
    if (window.self !== window.top) {
        document.body.style.display = 'none';
        console.warn('Clickjacking attempt detected!');
    }
}

function setupCSP() {
    const metaCSP = document.createElement('meta');
    metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
    metaCSP.setAttribute(
        'content',
        "default-src 'self'; script-src 'self' https://www.gstatic.com https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com; frame-ancestors 'none';"
    );
    document.head.appendChild(metaCSP);
}

function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
        const container = document.querySelector('.login-container');
        if (container) {
            container.classList.add('signup-mode');
        }
    }
    
    preventClickjacking();
    setupCSP();
    setupEventListeners();

    onAuthStateChanged(auth, (user) => {
        if (user && window.location.pathname.includes('login')) {
            window.location.href = 'index.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', init);