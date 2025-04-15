import { auth, db, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc } from './firebase-config.js';

(function () {
  "use strict";

  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");
  const searchBar = document.querySelector("#search-bar");
  const searchResults = document.querySelector("#search-results");
  const readMoreBtn = document.querySelector(".read-more-btn");
  const readLessBtn = document.querySelector(".read-less-btn");
  const equationContent = document.querySelector(".equation-content");
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const authButton = document.querySelector("#authButton");
  const usernameDisplay = document.querySelector("#usernameDisplay");
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
    if (typeof input !== "string") return "";
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  function validateInput(input) {
    const maxLength = 100;
    return input.length <= maxLength && !/[<>{}]/.test(input);
  }

  function encodeData(data) {
    return btoa(encodeURIComponent(data));
  }

  function decodeData(data) {
    try {
      return decodeURIComponent(atob(data));
    } catch (e) {
      return "";
    }
  }

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", encodeData(isDarkMode ? "enabled" : "disabled"));
    updateDarkModeIcon();
  }

  function updateDarkModeIcon() {
    const icon = darkModeToggle.querySelector(".mode-icon");
    icon.innerHTML = document.body.classList.contains("dark-mode")
      ? `<path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 0-9 9 9 9 0 0 0-9-9 9 9 0 0 0 9-9z"/>`
      : `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/><circle cx="12" cy="12" r="4"/>`;
  }

  function toggleReadMore() {
    const equationContent = document.querySelector(".equation-content");
    const readMoreBtn = document.querySelector(".read-more-btn");
    const readLessBtn = document.querySelector(".read-less-btn");

    const isVisible = equationContent.classList.contains("visible");

    if (!isVisible) {
      equationContent.classList.add("visible");
      readMoreBtn.classList.add("hidden");
      readLessBtn.classList.remove("hidden");
    } else {
      equationContent.classList.remove("visible");
      readMoreBtn.classList.remove("hidden");
      readLessBtn.classList.add("hidden");
    }

    if (!isVisible) {
      equationContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSearch() {
    const query = sanitizeInput(searchBar.value.trim().toLowerCase());
    if (!validateInput(query)) {
      searchResults.innerHTML = `<div class="search-no-results">المدخلات غير صالحة</div>`;
      searchResults.classList.add("show");
      return;
    }

    searchResults.innerHTML = "";

    if (!query) {
      searchResults.classList.remove("show");
      return;
    }

    const filteredSubjects = subjects.filter(
      (subject) => subject.title.toLowerCase().includes(query) || subject.desc.toLowerCase().includes(query)
    );

    if (filteredSubjects.length === 0) {
      searchResults.innerHTML = `<div class="search-no-results">لا توجد نتائج لبحثك</div>`;
      searchResults.classList.add("show");
      return;
    }

    filteredSubjects.forEach((subject) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("search-result-item");
      resultItem.innerHTML = `
        <a href="${sanitizeInput(subject.link)}" class="search-link" rel="noopener noreferrer">
          <h3>${sanitizeInput(subject.title)}</h3>
          <p>${sanitizeInput(subject.desc)}</p>
        </a>
      `;
      searchResults.appendChild(resultItem);
    });

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
      alert("حدث خطأ أثناء تسجيل الخروج: " + error.message);
    }
  }

  function setupAuthState() {
    onAuthStateChanged(auth, async (user) => {
      const currentPath = window.location.pathname;
      const skipStatus = decodeData(localStorage.getItem("skip") || "");
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (currentPath.includes("login")) {
            window.location.href = "index.html";
          }
          if (authButton) {
            authButton.textContent = "تسجيل الخروج";
            authButton.onclick = handleLogout;
          }
          if (userDoc.exists() && userDoc.data().username && usernameDisplay) {
            usernameDisplay.textContent = `مرحبًا، ${sanitizeInput(userDoc.data().username)}`;
          }
        } catch (error) {
          console.error("خطأ في جلب بيانات المستخدم:", error);
          alert("حدث خطأ، يرجى إعادة المحاولة لاحقًا");
        }
      } else {
        if (!currentPath.includes("login") && skipStatus !== "true") {
          window.location.href = "login.html";
        }
        if (authButton) {
          authButton.textContent = "تسجيل الدخول";
          authButton.onclick = () => {
            localStorage.removeItem("authState");
            window.location.href = "login.html";
          };
        }
        if (usernameDisplay) {
          usernameDisplay.textContent = "";
        }
      }
    });
  }

  function setupSmoothScroll() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = sanitizeInput(link.getAttribute("href").substring(1));
        const section = document.getElementById(sectionId);
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function preventClickjacking() {
    if (window.self !== window.top) {
      document.body.style.display = "none";
      console.warn("Clickjacking attempt detected!");
    }
  }

  function setupEventListeners() {
    const nextBtn = document.querySelector(".slider-btn.next");
    const prevBtn = document.querySelector(".slider-btn.prev");
    if (nextBtn) {
      nextBtn.addEventListener("click", debounce(() => {
        stopSlider();
        nextSlide();
        startSlider();
      }, 300));
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", debounce(() => {
        stopSlider();
        prevSlide();
        startSlider();
      }, 300));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", debounce(() => {
        stopSlider();
        showSlide(index);
        startSlider();
      }, 300));
    });

    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", debounce(toggleDarkMode, 300));
    }

    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", debounce(toggleReadMore, 300));
    }
    if (readLessBtn) {
      readLessBtn.addEventListener("click", debounce(toggleReadMore, 300));
    }

    if (searchBar) {
      searchBar.addEventListener("input", debounce(handleSearch, 300));
      searchBar.addEventListener("paste", (e) => {
        const pastedData = e.clipboardData.getData("text");
        if (!validateInput(pastedData)) {
          e.preventDefault();
        }
      });
    }

    document.addEventListener("click", (e) => {
      if (!searchResults.contains(e.target) && e.target !== searchBar) {
        searchResults.classList.remove("show");
        searchResults.innerHTML = "";
      }
    });
  }

  function init() {
    preventClickjacking();

    const savedDarkMode = decodeData(localStorage.getItem("darkMode") || "");
    if (savedDarkMode === "enabled") {
      document.body.classList.add("dark-mode");
      updateDarkModeIcon();
    }

    if (slides.length > 0) {
      showSlide(currentSlide);
      startSlider();
    }

    setupAuthState();

    setupSmoothScroll();

    setupEventListeners();

    const metaCSP = document.createElement("meta");
    metaCSP.setAttribute("http-equiv", "Content-Security-Policy");
    metaCSP.setAttribute(
      "content",
      "default-src 'self'; script-src 'self' https://www.gstatic.com https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none';"
    );
    document.head.appendChild(metaCSP);
  }

  document.addEventListener("DOMContentLoaded", init);
})();