import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.querySelector('.login-container');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    const skipLinks = document.querySelectorAll('#skip-link, #skip-link-signup');

    // التبديل بين تسجيل الدخول وإنشاء الحساب
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('signup-mode');
    });
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.remove('signup-mode');
    });

    // تخطي للموقع الرئيسي مع علامة في الـ URL
    skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('skip', 'true'); // نحط حالة التخطي
            window.location.href = 'index.html?skip=true';
        });
    });

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // تسجيل الدخول
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordInput = e.target.querySelector('input[name="password"]');
        const errorMessage = document.getElementById('error-message');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'index.html';
            e.target.reset();
        } catch (error) {
            console.error("خطأ في تسجيل الدخول:", error);
            const errorMsg = error.code === 'auth/wrong-password' ? 'كلمة المرور خاطئة!' :
                             error.code === 'auth/user-not-found' ? 'الحساب غير مسجل!' : 
                             error.message;
            errorMessage.textContent = `خطأ: ${errorMsg}`;
            errorMessage.style.display = 'block';
            passwordInput.classList.add('shake');
            setTimeout(() => {
                errorMessage.style.display = 'none';
                passwordInput.classList.remove('shake');
            }, 5000);
        }
    });

    // إنشاء الحساب
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const username = formData.get('username');
        const errorMessage = document.getElementById('error-message-signup');

        if (password !== confirmPassword) {
            errorMessage.textContent = 'كلمة المرور غير متطابقة!';
            errorMessage.style.display = 'block';
            setTimeout(() => errorMessage.style.display = 'none', 5000);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = 'login.html';
        } catch (error) {
            console.error("خطأ في إنشاء الحساب:", error);
            errorMessage.textContent = `خطأ: ${error.message}`;
            errorMessage.style.display = 'block';
            setTimeout(() => errorMessage.style.display = 'none', 5000);
        }
    });
});