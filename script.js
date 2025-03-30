// استيراد الدوال من Firebase
import { auth, db, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc } from './firebase-config.js';

const searchPaths = [
    { path: "/Subjects/انجليزي/English.html", title: "مادة الإنجليزي", desc: "الصفحة الرئيسية لمادة اللغة الإنجليزية" },
    { path: "/Subjects/انجليزي/الكتب/books.html", title: "كتب الإنجليزي", desc: "صفحة كتب مادة الإنجليزي" },
    { path: "/Subjects/انجليزي/الكتب/كتاب الشرح/explanation-book.html", title: "كتاب شرح الإنجليزي", desc: "صفحة كتاب دراسي لشرح مادة الإنجليزي" },
    { path: "/Subjects/انجليزي/الكتب/كتاب المراجعة/review-book.html", title: "كتاب مراجعة الإنجليزي", desc: "صفحة كتاب مراجعة نهائية للإنجليزي" },
    { path: "/Subjects/انجليزي/امتحانات سابقه/past-exams.html", title: "امتحانات سابقة إنجليزي", desc: "صفحة امتحانات سابقة لمادة الإنجليزي" },
    { path: "/Subjects/انجليزي/تمارين للمراجعه/review-exercises.html", title: "تمارين مراجعة إنجليزي", desc: "صفحة تمارين لمراجعة مادة الإنجليزي" },
    { path: "/Subjects/انجليزي/محاضرات الماده/course-lectures.html", title: "محاضرات مادة الإنجليزي", desc: "صفحة محاضرات مادة الإنجليزي" },
    { path: "/Subjects/تفاضل و تكامل/Calculus.html", title: "مادة التفاضل والتكامل", desc: "الصفحة الرئيسية لمادة التفاضل والتكامل" },
    { path: "/Subjects/تفاضل و تكامل/الكتب/Books.html", title: "كتب التفاضل والتكامل", desc: "صفحة كتب مادة التفاضل والتكامل" },
    { path: "/Subjects/تفاضل و تكامل/امتحانات سابقه/PastExams.html", title: "امتحانات سابقة تفاضل وتكامل", desc: "صفحة امتحانات سابقة للتفاضل والتكامل" },
    { path: "/Subjects/تفاضل و تكامل/تمارين للمراجعه/ReviewExercises.html", title: "تمارين مراجعة تفاضل وتكامل", desc: "صفحة تمارين لمراجعة التفاضل والتكامل" },
    { path: "/Subjects/تفاضل و تكامل/محاضرات الماده/CourseLectures.html", title: "محاضرات التفاضل والتكامل", desc: "صفحة محاضرات مادة التفاضل والتكامل" },
    { path: "/Subjects/تفاضل و تكامل/محاضرات الماده/تفاضل/Differentiation.html", title: "محاضرة تفاضل", desc: "محاضرة عن التفاضل" },
    { path: "/Subjects/تفاضل و تكامل/محاضرات الماده/تكامل/Integration.html", title: "محاضرة تكامل", desc: "محاضرة عن التكامل" },
    { path: "/Subjects/جبر و هندسة فراغية/Algebra.html", title: "مادة الجبر والهندسة الفراغية", desc: "الصفحة الرئيسية للجبر والهندسة الفراغية" },
    { path: "/Subjects/جبر و هندسة فراغية/امتحانات سابقه/PastExams.html", title: "امتحانات سابقة جبر وهندسة", desc: "صفحة امتحانات سابقة للجبر والهندسة" },
    { path: "/Subjects/جبر و هندسة فراغية/تمارين للمراجعه/ReviewExercises.html", title: "تمارين مراجعة جبر وهندسة", desc: "صفحة تمارين لمراجعة الجبر والهندسة" },
    { path: "/Subjects/جبر و هندسة فراغية/كتب/Books.html", title: "كتب الجبر والهندسة", desc: "صفحة كتب الجبر والهندسة الفراغية" },
    { path: "/Subjects/جبر و هندسة فراغية/محاضرات الماده/AlgebraGeometry.html", title: "محاضرات الجبر والهندسة", desc: "صفحة محاضرات الجبر والهندسة الفراغية" },
    { path: "/Subjects/جبر و هندسة فراغية/محاضرات الماده/الجبر/AlgebraLectures.html", title: "محاضرة الجبر", desc: "محاضرة عن الجبر" },
    { path: "/Subjects/جبر و هندسة فراغية/محاضرات الماده/الفراغية/SpatialGeometry.html", title: "محاضرة الهندسة الفراغية", desc: "محاضرة عن الهندسة الفراغية" },
    { path: "/Subjects/فيزياء/Physics.html", title: "مادة الفيزياء", desc: "الصفحة الرئيسية لمادة الفيزياء" },
    { path: "/Subjects/فيزياء/الكتب/Books.html", title: "كتب الفيزياء", desc: "صفحة كتب مادة الفيزياء" },
    { path: "/Subjects/فيزياء/امتحانات سابقه/PreviousExams.html", title: "امتحانات سابقة فيزياء", desc: "صفحة امتحانات سابقة لمادة الفيزياء" },
    { path: "/Subjects/فيزياء/تمارين للمراجعه/ReviewExercises.html", title: "تمارين مراجعة فيزياء", desc: "صفحة تمارين لمراجعة مادة الفيزياء" },
    { path: "/Subjects/فيزياء/حل كتاب الامتحان/Lectures.html", title: "حل كتاب الامتحان فيزياء", desc: "صفحة حلول كتاب الامتحان في الفيزياء" },
    { path: "/Subjects/فيزياء/محاضرات الماده/Lectures.html", title: "محاضرات الفيزياء", desc: "صفحة محاضرات مادة الفيزياء" },
    { path: "/Subjects/فيزياء/محاضرات الماده/unit 1/Unit1.html", title: "محاضرة Unit 1 فيزياء", desc: "محاضرة الوحدة الأولى في الفيزياء" },
    { path: "/Subjects/كيمياء/Chemistry.html", title: "مادة الكيمياء", desc: "الصفحة الرئيسية لمادة الكيمياء" },
    { path: "/Subjects/كيمياء/الكتب/Books.html", title: "كتب الكيمياء", desc: "صفحة كتب مادة الكيمياء" },
    { path: "/Subjects/كيمياء/الكتب/كتاب الشرح/ExplanationBook.html", title: "كتاب شرح الكيمياء", desc: "صفحة كتاب دراسي لشرح مادة الكيمياء" },
    { path: "/Subjects/كيمياء/الكتب/كتاب المراجعة/index.html", title: "كتاب مراجعة الكيمياء", desc: "صفحة كتاب مراجعة نهائية للكيمياء" },
    { path: "/Subjects/كيمياء/امتحانات سابقه/Exams.html", title: "امتحانات سابقة كيمياء", desc: "صفحة امتحانات سابقة لمادة الكيمياء" },
    { path: "/Subjects/كيمياء/تمارين للمراجعه/Exercises.html", title: "تمارين مراجعة كيمياء", desc: "صفحة تمارين لمراجعة مادة الكيمياء" },
    { path: "/Subjects/كيمياء/محاضرات الماده/ChemistryLectures.html", title: "محاضرات الكيمياء", desc: "صفحة محاضرات مادة الكيمياء" },
    { path: "/Subjects/كيمياء/محاضرات الماده/unit1/Unit1.html", title: "محاضرة Unit 1 كيمياء", desc: "محاضرة الوحدة الأولى في الكيمياء" },
    { path: "/Subjects/كيمياء/محاضرات الماده/unit2/Unit2.html", title: "محاضرة Unit 2 كيمياء", desc: "محاضرة الوحدة الثانية في الكيمياء" },
    { path: "/Subjects/كيمياء/محاضرات الماده/unit3/Unit3.html", title: "محاضرة Unit 3 كيمياء", desc: "محاضرة الوحدة الثالثة في الكيمياء" },
    { path: "/Subjects/كيمياء/محاضرات الماده/unit4/Unit4.html", title: "محاضرة Unit 4 كيمياء", desc: "محاضرة الوحدة الرابعة في الكيمياء" },
    { path: "/Subjects/كيمياء/محاضرات الماده/unit5/Unit5.html", title: "محاضرة Unit 5 كيمياء", desc: "محاضرة الوحدة الخامسة في الكيمياء" },
    { path: "/Subjects/ميكانيكا/Mechanics.html", title: "مادة الميكانيكا", desc: "الصفحة الرئيسية لمادة الميكانيكا" },
    { path: "/Subjects/ميكانيكا/الكتب/Books.html", title: "كتب الميكانيكا", desc: "صفحة كتب مادة الميكانيكا" },
    { path: "/Subjects/ميكانيكا/الكتب/استاتيكا/StaticsBooks.html", title: "كتب الاستاتيكا", desc: "صفحة كتب الاستاتيكا في الميكانيكا" },
    { path: "/Subjects/ميكانيكا/الكتب/ديناميكا/DynamicsBooks.html", title: "كتب الديناميكا", desc: "صفحة كتب الديناميكا في الميكانيكا" },
    { path: "/Subjects/ميكانيكا/امتحانات سابقه/Exams.html", title: "امتحانات سابقة ميكانيكا", desc: "صفحة امتحانات سابقة لمادة الميكانيكا" },
    { path: "/Subjects/ميكانيكا/تمارين للمراجعه/Exercises.html", title: "تمارين مراجعة ميكانيكا", desc: "صفحة تمارين لمراجعة مادة الميكانيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/Lectures.html", title: "محاضرات الميكانيكا", desc: "صفحة محاضرات مادة الميكانيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/StaticsLectures.html", title: "محاضرات الاستاتيكا", desc: "صفحة محاضرات الاستاتيكا في الميكانيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الأولى/index.html", title: "محاضرات الوحدة الأولى استاتيكا", desc: "صفحة محاضرات الوحدة الأولى في الاستاتيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الثانية/index.html", title: "محاضرات الوحدة الثانية استاتيكا", desc: "صفحة محاضرات الوحدة الثانية في الاستاتيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الثالثة/index.html", title: "محاضرات الوحدة الثالثة استاتيكا", desc: "صفحة محاضرات الوحدة الثالثة في الاستاتيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الرابعة/index.html", title: "محاضرات الوحدة الرابعة استاتيكا", desc: "صفحة محاضرات الوحدة الرابعة في الاستاتيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الخامسة/index.html", title: "محاضرات الوحدة الخامسة استاتيكا", desc: "صفحة محاضرات الوحدة الخامسة في الاستاتيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الخامسة/الدرس الأول/index.html", title: "محاضرة الدرس الأول استاتيكا وحدة 5", desc: "الدرس الأول في الوحدة الخامسة استاتيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/DynamicsLectures.html", title: "محاضرات الديناميكا", desc: "صفحة محاضرات الديناميكا في الميكانيكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/الوحدة الثانية/index.html", title: "محاضرات الوحدة الثانية ديناميكا", desc: "صفحة محاضرات الوحدة الثانية في الديناميكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/الوحدة الثالثة/index.html", title: "محاضرة الوحدة الثالثة ديناميكا", desc: "محاضرة الوحدة الثالثة في الديناميكا" },
    { path: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/الوحدة الرابعة/index.html", title: "محاضرة الوحدة الرابعة ديناميكا", desc: "محاضرة الوحدة الرابعة في الديناميكا" }
];

// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-link, .hero-cta-secondary').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval = slides.length ? setInterval(nextSlide, 5000) : null;

function showSlide(index) {
    if (slides.length) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
}

function nextSlide() {
    if (slides.length) {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (slides.length) {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
}

if (slides.length) {
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    heroSection.addEventListener('mouseleave', () => autoSlideInterval = setInterval(nextSlide, 5000));
}

// Dark Mode Logic
function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDark);
    const toggleButton = document.querySelector('.dark-mode-toggle');
    if (toggleButton) {
        toggleButton.textContent = isDark ? '☀️' : '🌙';
    }
}

// Read More Toggle
function toggleReadMore() {
    const content = document.querySelector('.equation-content');
    const readMoreBtn = document.querySelector('.read-more-btn');
    const readLessBtn = document.querySelector('.read-less-btn');
    
    if (content && readMoreBtn && readLessBtn) {
        const isVisible = content.classList.toggle('visible');
        readMoreBtn.classList.toggle('hidden', isVisible);
        readLessBtn.classList.toggle('hidden', !isVisible);
    }
}

// Authentication Logic
async function handleLogout() {
    try {
        await signOut(auth);
        sessionStorage.clear();
        window.location.href = "login.html?logout=success";
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error);
        alert('حدث خطأ أثناء تسجيل الخروج: ' + error.message);
    }
}

// Header Hide/Show on Scroll
let lastScrollTop = 0;
const header = document.querySelector('.app-header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Search Logic
document.getElementById('search-bar')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = ''; // تفريغ النتائج

    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '<div class="search-no-results">اكتب أكثر من حرفين للبحث</div>';
        return;
    }

    const filteredPaths = searchPaths.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.desc.toLowerCase().includes(searchTerm)
    );

    if (filteredPaths.length > 0) {
        filteredPaths.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.innerHTML = `
                <a href="${item.path}" class="search-link">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </a>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<div class="search-no-results">لا توجد نتائج مطابقة</div>';
    }
});

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(isDark);

    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentMode = document.body.classList.contains('dark-mode');
            applyDarkMode(!currentMode);
        });
    }

    const authButton = document.getElementById("authButton");
    const usernameDisplay = document.getElementById('usernameDisplay');

    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        const hasSkipped = localStorage.getItem('skip') === 'true';

        if (user) {
            if (currentPath.includes('login') || currentPath.includes('register')) {
                window.location.href = "index.html";
            }
            if (authButton) {
                authButton.textContent = "تسجيل الخروج";
                authButton.onclick = handleLogout;
            }
            if (usernameDisplay) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().username) {
                        usernameDisplay.textContent = `مرحبًا، ${userDoc.data().username}`;
                    }
                } catch (error) {
                    console.error("خطأ في جلب البيانات:", error);
                }
            }
        } else {
            if (currentPath.includes('login') || currentPath.includes('register')) {
                if (authButton) {
                    authButton.textContent = "تسجيل الدخول";
                    authButton.onclick = () => {
                        localStorage.removeItem('authState');
                        window.location.href = "login.html";
                    };
                }
            } else {
                if (hasSkipped) {
                    if (authButton) {
                        authButton.textContent = "تسجيل الدخول";
                        authButton.onclick = () => {
                            localStorage.removeItem('authState');
                            window.location.href = "login.html";
                        };
                    }
                } else if (window.location.search.includes('skip=true')) {
                    localStorage.setItem('skip', 'true');
                    if (authButton) {
                        authButton.textContent = "تسجيل الدخول";
                        authButton.onclick = () => {
                            localStorage.removeItem('authState');
                            window.location.href = "login.html";
                        };
                    }
                } else {
                    window.location.href = "login.html";
                }
            }
        }
    });

    const readMoreBtn = document.querySelector('.read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', toggleReadMore);
    }

    const readLessBtn = document.querySelector('.read-less-btn');
    if (readLessBtn) {
        readLessBtn.addEventListener('click', toggleReadMore);
    }

    if (slides.length) {
        showSlide(currentSlide);
    }
});

// Reveal on Scroll
function revealOnScroll() {
    let elements = document.querySelectorAll('.hidden');
    elements.forEach(element => {
        let position = element.getBoundingClientRect().top;
        let screenHeight = window.innerHeight;
        if (position < screenHeight - 50) {
            element.classList.add('show');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
document.addEventListener("DOMContentLoaded", revealOnScroll);

// Fade-in Animation
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));
});