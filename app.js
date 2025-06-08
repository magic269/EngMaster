import { auth, db, onAuthStateChanged, signOut, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, doc, setDoc, getDoc } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authButton = document.getElementById("authButton");
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.removeEventListener('submit', handleRegister);
        registerForm.addEventListener('submit', handleRegister);
    }

    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (currentPath.includes('login') || currentPath.includes('register')) {
                    window.location.href = "index.html"; // حذف التحقق من الاشتراك
                }

                if (authButton) {
                    authButton.textContent = "تسجيل الخروج";
                    authButton.onclick = handleLogout;
                }

                if (userDoc.exists() && userDoc.data().username && usernameDisplay) {
                    usernameDisplay.textContent = `مرحبًا، ${userDoc.data().username}`;
                }
            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
                alert('حدث خطأ غير متوقع، يرجى إعادة المحاولة لاحقًا');
            }
        } else {
            if (!currentPath.includes('login') && !currentPath.includes('register')) {
                window.location.href = "login.html";
            }

            if (authButton) {
                authButton.textContent = "تسجيل الدخول";
                authButton.onclick = () => {
                    localStorage.removeItem('authState');
                    window.location.href = "login.html";
                };
            }
        }
    });
});

async function handleLogout() {
    try {
        await signOut(auth);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html?logout=success";
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error);
        alert('حدث خطأ أثناء تسجيل الخروج: ' + error.message);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

        if (!userDoc.exists()) throw new Error('الحساب غير موجود!');
        
        window.location.href = "index.html"; 

        e.target.reset();
    } catch (error) {
        const errorMsg = error.code === 'auth/wrong-password' ? 'كلمة مرور خاطئة!' :
                        error.code === 'auth/user-not-found' ? 'الحساب غير مسجل!' : 
                        error.message;
        alert(`خطأ في التسجيل: ${errorMsg}`);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const username = formData.get('username');

    if (password !== confirmPassword) {
        alert('كلمة المرور غير متطابقة!');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("تم إنشاء المستخدم بنجاح:", userCredential.user.uid);

        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            username: username 
        });

        console.log("تم حفظ بيانات المستخدم في Firestore بنجاح!");
        alert('تم إنشاء الحساب بنجاح!');
        window.location.href = 'login.html';
    } catch (error) {
        console.error("خطأ في إنشاء الحساب:", error);
        alert('خطأ في إنشاء الحساب: ' + error.message);
    }
}