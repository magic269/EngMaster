import { auth, db, onAuthStateChanged, signOut, getDoc, doc } from './firebase-config.js';

(function () {
    "use strict";

    const body = document.body;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");
    
    const desktopSearchBar = document.querySelector("#desktop-search-bar");
    const mobileSearchTrigger = document.querySelector("#mobile-search-trigger");
    const mobileSearchOverlay = document.querySelector("#mobile-search-overlay");
    const mobileSearchInput = document.querySelector("#mobile-search-input");
    const closeSearchOverlayBtn = document.querySelector("#close-search-overlay");
    const searchResults = document.querySelector("#search-results");

    const readMoreBtn = document.querySelector(".read-more-btn");
    const readLessBtn = document.querySelector(".read-less-btn");
    const equationContent = document.querySelector(".equation-content");
    const darkModeToggle = document.querySelector(".dark-mode-toggle");
    const navLinks = document.querySelectorAll(".nav-link");
    const authButton = document.querySelector("#authButton");
    const usernameDisplay = document.querySelector("#usernameDisplay");
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuPanel = document.querySelector('.menu-links');

    const menuLoginBtn = document.querySelector('#menu-login-btn');
    const menuRegisterBtn = document.querySelector('#menu-register-btn');
    const menuLogoutBtn = document.querySelector('#menu-logout-btn');
    const loggedOutMenuItems = document.querySelectorAll('[data-auth-state="logged-out"]');
    const loggedInMenuItems = document.querySelectorAll('[data-auth-state="logged-in"]');
    const menuUserProfile = document.querySelector('#menu-user-profile');
    const menuUsername = document.querySelector('#menu-username');

    let currentSlide = 0;
    let slideInterval;

    const subjects = [
        { title: "مادة الإنجليزي", desc: "الصفحة الرئيسية لمادة اللغة الإنجليزية", link: "/Subjects/انجليزي/English.html" },
        { title: "كتب الإنجليزي", desc: "صفحة كتب مادة الإنجليزي", link: "/Subjects/انجليزي/الكتب/books.html" },
        { title: "كتاب شرح الإنجليزي", desc: "صفحة كتاب دراسي لشرح مادة الإنجليزي", link: "/Subjects/انجليزي/الكتب/كتاب الشرح/explanation-book.html" },
        { title: "كتاب مراجعة الإنجليزي", desc: "صفحة كتاب مراجعة نهائية للإنجليزي", link: "/Subjects/انجليزي/الكتب/كتاب المراجعة/review-book.html" },
        { title: "امتحانات سابقة إنجليزي", desc: "صفحة امتحانات سابقة لمادة الإنجليزي", link: "/Subjects/انجليزي/امتحانات سابقه/past-exams.html" },
        { title: "تمارين مراجعة إنجليزي", desc: "صفحة تمارين لمراجعة مادة الإنجليزي", link: "/Subjects/انجليزي/تمارين للمراجعه/review-exercises.html" },
        { title: "محاضرات مادة الإنجليزي", desc: "صفحة محاضرات مادة الإنجليزي", link: "/Subjects/انجليزي/محاضرات الماده/course-lectures.html" },
        { title: "مادة التفاضل والتكامل", desc: "الصفحة الرئيسية لمادة التفاضل والتكامل", link: "/Subjects/تفاضل و تكامل/Calculus.html" },
        { title: "كتب التفاضل والتكامل", desc: "صفحة كتب مادة التفاضل والتكامل", link: "/Subjects/تفاضل و تكامل/الكتب/Books.html" },
        { title: "امتحانات سابقة تفاضل وتكامل", desc: "صفحة امتحانات سابقة للتفاضل والتكامل", link: "/Subjects/تفاضل و تكامل/امتحانات سابقه/PastExams.html" },
        { title: "تمارين مراجعة تفاضل وتكامل", desc: "صفحة تمارين لمراجعة التفاضل والتكامل", link: "/Subjects/تفاضل و تكامل/تمارين للمراجعه/ReviewExercises.html" },
        { title: "محاضرات التفاضل والتكامل", desc: "صفحة محاضرات مادة التفاضل والتكامل", link: "/Subjects/تفاضل و تكامل/محاضرات الماده/CourseLectures.html" },
        { title: "محاضرة تفاضل", desc: "محاضرة عن التفاضل", link: "/Subjects/تفاضل و تكامل/محاضرات الماده/تفاضل/Differentiation.html" },
        { title: "محاضرة تكامل", desc: "محاضرة عن التكامل", link: "/Subjects/تفاضل و تكامل/محاضرات الماده/تكامل/Integration.html" },
        { title: "مادة الجبر والهندسة الفراغية", desc: "الصفحة الرئيسية للجبر والهندسة الفراغية", link: "/Subjects/جبر و هندسة فراغية/Algebra.html" },
        { title: "امتحانات سابقة جبر وهندسة", desc: "صفحة امتحانات سابقة للجبر والهندسة", link: "/Subjects/جبر و هندسة فراغية/امتحانات سابقه/PastExams.html" },
        { title: "تمارين مراجعة جبر وهندسة", desc: "صفحة تمارين لمراجعة الجبر والهندسة", link: "/Subjects/جبر و هندسة فراغية/تمارين للمراجعه/ReviewExercises.html" },
        { title: "كتب الجبر والهندسة", desc: "صفحة كتب الجبر والهندسة الفراغية", link: "/Subjects/جبر و هندسة فراغية/كتب/Books.html" },
        { title: "محاضرات الجبر والهندسة", desc: "صفحة محاضرات الجبر والهندسة الفراغية", link: "/Subjects/جبر و هندسة فراغية/محاضرات الماده/AlgebraGeometry.html" },
        { title: "محاضرة الجبر", desc: "محاضرة عن الجبر", link: "/Subjects/جبر و هندسة فراغية/محاضرات الماده/الجبر/AlgebraLectures.html" },
        { title: "محاضرة الهندسة الفراغية", desc: "محاضرة عن الهندسة الفراغية", link: "/Subjects/جبر و هندسة فراغية/محاضرات الماده/الفراغية/SpatialGeometry.html" },
        { title: "مادة الفيزياء", desc: "الصفحة الرئيسية لمادة الفيزياء", link: "/Subjects/فيزياء/Physics.html" },
        { title: "كتب الفيزياء", desc: "صفحة كتب مادة الفيزياء", link: "/Subjects/فيزياء/الكتب/Books.html" },
        { title: "امتحانات سابقة فيزياء", desc: "صفحة امتحانات سابقة لمادة الفيزياء", link: "/Subjects/فيزياء/امتحانات سابقه/PreviousExams.html" },
        { title: "تمارين مراجعة فيزياء", desc: "صفحة تمارين لمراجعة مادة الفيزياء", link: "/Subjects/فيزياء/تمارين للمراجعه/ReviewExercises.html" },
        { title: "حل كتاب الامتحان فيزياء", desc: "صفحة حلول كتاب الامتحان في الفيزياء", link: "/Subjects/فيزياء/حل كتاب الامتحان/Lectures.html" },
        { title: "محاضرات الفيزياء", desc: "صفحة محاضرات مادة الفيزياء", link: "/Subjects/فيزياء/محاضرات الماده/Lectures.html" },
        { title: "محاضرة Unit 1 فيزياء", desc: "محاضرة الوحدة الأولى في الفيزياء", link: "/Subjects/فيزياء/محاضرات الماده/unit 1/Unit1.html" },
        { title: "مادة الكيمياء", desc: "الصفحة الرئيسية لمادة الكيمياء", link: "/Subjects/كيمياء/Chemistry.html" },
        { title: "كتب الكيمياء", desc: "صفحة كتب مادة الكيمياء", link: "/Subjects/كيمياء/الكتب/Books.html" },
        { title: "كتاب شرح الكيمياء", desc: "صفحة كتاب دراسي لشرح مادة الكيمياء", link: "/Subjects/كيمياء/الكتب/كتاب الشرح/ExplanationBook.html" },
        { title: "كتاب مراجعة الكيمياء", desc: "صفحة كتاب مراجعة نهائية للكيمياء", link: "/Subjects/كيمياء/الكتب/كتاب المراجعة/index.html" },
        { title: "امتحانات سابقة كيمياء", desc: "صفحة امتحانات سابقة لمادة الكيمياء", link: "/Subjects/كيمياء/امتحانات سابقه/Exams.html" },
        { title: "تمارين مراجعة كيمياء", desc: "صفحة تمارين لمراجعة مادة الكيمياء", link: "/Subjects/كيمياء/تمارين للمراجعه/Exercises.html" },
        { title: "محاضرات الكيمياء", desc: "صفحة محاضرات مادة الكيمياء", link: "/Subjects/كيمياء/محاضرات الماده/ChemistryLectures.html" },
        { title: "محاضرة Unit 1 كيمياء", desc: "محاضرة الوحدة الأولى في الكيمياء", link: "/Subjects/كيمياء/محاضرات الماده/unit1/Unit1.html" },
        { title: "محاضرة Unit 2 كيمياء", desc: "محاضرة الوحدة الثانية في الكيمياء", link: "/Subjects/كيمياء/محاضرات الماده/unit2/Unit2.html" },
        { title: "محاضرة Unit 3 كيمياء", desc: "محاضرة الوحدة الثالثة في الكيمياء", link: "/Subjects/كيمياء/محاضرات الماده/unit3/Unit3.html" },
        { title: "محاضرة Unit 4 كيمياء", desc: "محاضرة الوحدة الرابعة في الكيمياء", link: "/Subjects/كيمياء/محاضرات الماده/unit4/Unit4.html" },
        { title: "محاضرة Unit 5 كيمياء", desc: "محاضرة الوحدة الخامسة في الكيمياء", link: "/Subjects/كيمياء/محاضرات الماده/unit5/Unit5.html" },
        { title: "مادة الميكانيكا", desc: "الصفحة الرئيسية لمادة الميكانيكا", link: "/Subjects/ميكانيكا/Mechanics.html" },
        { title: "كتب الميكانيكا", desc: "صفحة كتب مادة الميكانيكا", link: "/Subjects/ميكانيكا/الكتب/Books.html" },
        { title: "كتب الاستاتيكا", desc: "صفحة كتب الاستاتيكا في الميكانيكا", link: "/Subjects/ميكانيكا/الكتب/استاتيكا/StaticsBooks.html" },
        { title: "كتب الديناميكا", desc: "صفحة كتب الديناميكا في الميكانيكا", link: "/Subjects/ميكانيكا/الكتب/ديناميكا/DynamicsBooks.html" },
        { title: "امتحانات سابقة ميكانيكا", desc: "صفحة امتحانات سابقة لمادة الميكانيكا", link: "/Subjects/ميكانيكا/امتحانات سابقه/Exams.html" },
        { title: "تمارين مراجعة ميكانيكا", desc: "صفحة تمارين لمراجعة مادة الميكانيكا", link: "/Subjects/ميكانيكا/تمارين للمراجعه/Exercises.html" },
        { title: "محاضرات الميكانيكا", desc: "صفحة محاضرات مادة الميكانيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/Lectures.html" },
        { title: "محاضرات الاستاتيكا", desc: "صفحة محاضرات الاستاتيكا في الميكانيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/StaticsLectures.html" },
        { title: "محاضرات الوحدة الأولى استاتيكا", desc: "صفحة محاضرات الوحدة الأولى في الاستاتيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الأولى/index.html" },
        { title: "محاضرات الوحدة الثانية استاتيكا", desc: "صفحة محاضرات الوحدة الثانية في الاستاتيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الثانية/index.html" },
        { title: "محاضرات الوحدة الثالثة استاتيكا", desc: "صفحة محاضرات الوحدة الثالثة في الاستاتيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الثالثة/index.html" },
        { title: "محاضرات الوحدة الرابعة استاتيكا", desc: "صفحة محاضرات الوحدة الرابعة في الاستاتيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الرابعة/index.html" },
        { title: "محاضرات الوحدة الخامسة استاتيكا", desc: "صفحة محاضرات الوحدة الخامسة في الاستاتيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الخامسة/index.html" },
        { title: "محاضرة الدرس الأول استاتيكا وحدة 5", desc: "الدرس الأول في الوحدة الخامسة استاتيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/استاتيكا/الوحدة الخامسة/الدرس الأول/index.html" },
        { title: "محاضرات الديناميكا", desc: "صفحة محاضرات الديناميكا في الميكانيكا", link: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/DynamicsLectures.html" },
        { title: "محاضرات الوحدة الثانية ديناميكا", desc: "صفحة محاضرات الوحدة الثانية في الديناميكا", link: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/الوحدة الثانية/index.html" },
        { title: "محاضرة الوحدة الثالثة ديناميكا", desc: "محاضرة الوحدة الثالثة في الديناميكا", link: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/الوحدة الثالثة/index.html" },
        { title: "محاضرة الوحدة الرابعة ديناميكا", desc: "محاضرة الوحدة الرابعة في الديناميكا", link: "/Subjects/ميكانيكا/محاضرات الماده/ديناميكا/الوحدة الرابعة/index.html" }
    ];

    function sanitizeInput(input) {
        return (typeof input === "string") ? input : "";
    }

    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-family: 'Cairo', sans-serif;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s, bottom 0.3s;
            }
            .toast.show {
                opacity: 1;
                bottom: 40px;
            }
            .toast.error {
                background-color: #e74c3c;
            }
            .toast.success {
                background-color: #2ecc71;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
                document.head.removeChild(style);
            }, 300);
        }, 4000);
    }

    function showSlide(index) {
        if (!slides || slides.length === 0) return;
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }
    function startSlider() { slideInterval = setInterval(nextSlide, 5000); }
    function stopSlider() { clearInterval(slideInterval); }

    function toggleReadMore() {
        if (!equationContent || !readMoreBtn || !readLessBtn) return;
        const isVisible = equationContent.classList.toggle("visible");
        readMoreBtn.classList.toggle("hidden", isVisible);
        readLessBtn.classList.toggle("hidden", !isVisible);
        if (isVisible) {
            equationContent.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function handleSearch(query) {
        if (!searchResults) return;
        const sanitizedQuery = sanitizeInput(query.trim().toLowerCase());
        searchResults.innerHTML = "";
        
        if (!sanitizedQuery) {
            searchResults.classList.remove("show");
            return;
        }

        const filteredSubjects = subjects.filter(
            (subject) => subject.title.toLowerCase().includes(sanitizedQuery) || subject.desc.toLowerCase().includes(sanitizedQuery)
        );

        if (filteredSubjects.length === 0) {
            searchResults.innerHTML = `<div class="search-no-results">لا توجد نتائج لبحثك</div>`;
        } else {
            filteredSubjects.forEach((subject) => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-result-item");
                resultItem.innerHTML = `
                    <a href="${sanitizeInput(subject.link)}" class="search-link" rel="noopener noreferrer">
                        <h3>${sanitizeInput(subject.title)}</h3>
                        <p>${sanitizeInput(subject.desc)}</p>
                    </a>`;
                searchResults.appendChild(resultItem);
            });
        }
        searchResults.classList.add("show");
    }

    async function handleLogout() {
        try {
            await signOut(auth);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "login.html?logout=success";
        } catch (error) {
            console.error("خطأ في تسجيل الخروج:", error);
            showToast("حدث خطأ أثناء تسجيل الخروج: " + error.message, 'error');
        }
    }

    async function updateUIForAuthState(user) {
        if (user) {
            if (authButton) {
                authButton.textContent = "تسجيل الخروج";
                authButton.onclick = handleLogout;
            }
            loggedInMenuItems.forEach(item => item.style.display = 'flex');
            loggedOutMenuItems.forEach(item => item.style.display = 'none');

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().username) {
                    const username = sanitizeInput(userDoc.data().username);
                    if (usernameDisplay) usernameDisplay.textContent = `مرحبًا، ${username}`;
                    if (menuUsername) menuUsername.textContent = username;
                    if (menuUserProfile) menuUserProfile.style.display = 'flex';
                } else {
                     if (menuUserProfile) menuUserProfile.style.display = 'none';
                }
            } catch (error) {
                console.error("خطأ في جلب بيانات المستخدم:", error);
                if (usernameDisplay) usernameDisplay.textContent = "";
                if (menuUserProfile) menuUserProfile.style.display = 'none';
            }
        } else {
            if (authButton) {
                authButton.textContent = "تسجيل الدخول";
                authButton.onclick = () => { window.location.href = "login.html"; };
            }
            loggedInMenuItems.forEach(item => item.style.display = 'none');
            loggedOutMenuItems.forEach(item => item.style.display = 'flex');
            if (usernameDisplay) usernameDisplay.textContent = "";
            if (menuUserProfile) menuUserProfile.style.display = 'none';
        }
    }

    function setupAuthState() {
        onAuthStateChanged(auth, (user) => {
            updateUIForAuthState(user);
        });
    }

    function setupSmoothScroll() {
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href && href.startsWith("#")) {
                    e.preventDefault();
                    const sectionId = sanitizeInput(href.substring(1));
                    const section = document.getElementById(sectionId);
                    if (section) {
                        window.scrollTo({ top: section.offsetTop - 80, behavior: "smooth" });
                    }
                }
            });
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function setupEventListeners() {
        const nextBtn = document.querySelector(".slider-btn.next");
        const prevBtn = document.querySelector(".slider-btn.prev");
        if (nextBtn) nextBtn.addEventListener("click", debounce(() => { stopSlider(); nextSlide(); startSlider(); }, 300));
        if (prevBtn) prevBtn.addEventListener("click", debounce(() => { stopSlider(); prevSlide(); startSlider(); }, 300));
        dots.forEach((dot, i) => dot.addEventListener("click", debounce(() => { stopSlider(); showSlide(i); startSlider(); }, 300)));

        if (readMoreBtn) readMoreBtn.addEventListener("click", debounce(toggleReadMore, 300));
        if (readLessBtn) readLessBtn.addEventListener("click", debounce(toggleReadMore, 300));

        const debouncedSearchHandler = debounce((event) => {
            handleSearch(event.target.value);
        }, 300);

        if (desktopSearchBar) desktopSearchBar.addEventListener("input", debouncedSearchHandler);
        if (mobileSearchInput) mobileSearchInput.addEventListener("input", debouncedSearchHandler);

        document.addEventListener("click", (e) => {
            if (searchResults && !searchResults.contains(e.target) && e.target !== desktopSearchBar && e.target !== mobileSearchInput) {
                searchResults.classList.remove("show");
            }
        });

        if (searchResults) {
            searchResults.addEventListener('click', (e) => {
                const link = e.target.closest('.search-link');
                if (link) {
                    e.preventDefault(); 
                    const destination = link.getAttribute('href');
                    if (destination) {
                        window.location.href = destination; 
                    }
                }
            });
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
            });
        }

        if (hamburgerIcon && menuPanel) {
            const toggleMenu = (show) => {
                const shouldShow = typeof show === 'boolean' ? show : !menuPanel.classList.contains('show');
                hamburgerIcon.classList.toggle('open', shouldShow);
                hamburgerIcon.setAttribute('aria-expanded', shouldShow);
                menuPanel.classList.toggle('show', shouldShow);
                body.classList.toggle('menu-open', shouldShow);
            };
            hamburgerIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });
            menuPanel.addEventListener('click', (e) => {
                if (e.target.closest('.menu-link')) {
                    toggleMenu(false);
                }
            });
            document.addEventListener('click', (e) => {
                if (menuPanel.classList.contains('show') && !menuPanel.contains(e.target) && !hamburgerIcon.contains(e.target)) {
                    toggleMenu(false);
                }
            });
        }
        
        if (mobileSearchTrigger) {
            mobileSearchTrigger.addEventListener('click', () => {
                if(mobileSearchOverlay) mobileSearchOverlay.style.display = 'flex';
                if(mobileSearchInput) mobileSearchInput.focus();
            });
        }

        if (closeSearchOverlayBtn) {
            closeSearchOverlayBtn.addEventListener('click', () => {
                if(mobileSearchOverlay) mobileSearchOverlay.style.display = 'none';
                if(searchResults) searchResults.classList.remove('show');
                if(mobileSearchInput) mobileSearchInput.value = '';
            });
        }

        if (menuLoginBtn) menuLoginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
        if (menuRegisterBtn) menuRegisterBtn.addEventListener('click', () => { window.location.href = 'login.html?mode=signup'; });
        if (menuLogoutBtn) menuLogoutBtn.addEventListener('click', handleLogout);
    }

    function init() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
        }

        if (slides && slides.length > 0) {
            showSlide(currentSlide);
            startSlider();
        }

        setupAuthState();
        setupSmoothScroll();
        setupEventListeners();
    }

    document.addEventListener("DOMContentLoaded", init);

})();
