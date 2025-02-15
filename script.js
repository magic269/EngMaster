document.addEventListener("DOMContentLoaded", function () {
    // ✅ زر القائمة الجانبية (الهامبرجر)
    const menuButton = document.querySelector(".hamburger-menu");
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".overlay");

    menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    // ✅ فتح/إغلاق القوائم الفرعية داخل القائمة الجانبية
    document.querySelectorAll(".mobile-menu .subject > a").forEach(subject => {
        subject.addEventListener("click", function (event) {
            event.preventDefault();
            this.parentElement.classList.toggle("open");
        });
    });

    // ✅ إخفاء زر القائمة عند التمرير لأسفل
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let heroSectionHeight = document.querySelector(".hero").offsetHeight;

        if (scrollTop > heroSectionHeight - 100) {
            menuButton.style.opacity = "0";
            menuButton.style.pointerEvents = "none";
        } else {
            menuButton.style.opacity = "1";
            menuButton.style.pointerEvents = "auto";
        }

        if (scrollTop > lastScrollTop) {
            menuButton.style.opacity = "0";
            menuButton.style.pointerEvents = "none";
        } else {
            menuButton.style.opacity = "1";
            menuButton.style.pointerEvents = "auto";
        }
        lastScrollTop = scrollTop;
    });

    // ✅ التحقق من توفر الروابط وتلوين الروابط غير المتاحة بالأحمر
    document.querySelectorAll(".subject a").forEach(link => {
        fetch(link.href, { method: "HEAD" })
            .then(response => {
                if (!response.ok) {
                    link.style.color = "red";
                    link.textContent += " (غير متاح)";
                }
            })
            .catch(() => {
                link.style.color = "red";
                link.textContent += " (غير متاح)";
            });
    });

    // ✅ منع النقر بزر الفأرة الأيمن
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        alert("🚫 ممنوع النقر بزر الفأرة الأيمن!");
    });

    // ✅ منع تحديد النص
    document.addEventListener("selectstart", function (event) {
        event.preventDefault();
    });

    // ✅ منع النسخ
    document.addEventListener("copy", function (event) {
        event.preventDefault();
        alert("🚫 النسخ غير مسموح!");
    });

    // ✅ منع فتح أدوات المطور
    document.addEventListener("keydown", function (event) {
        if (event.key === "F12" || 
            (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "U" || event.key === "C"))) {
            event.preventDefault();
            alert("🚫 ممنوع الوصول إلى أدوات المطور!");
        }
    });

    // ✅ إخفاء Console لمنع التلاعب
    setInterval(function () {
        if (window.console && (console.log || console.error || console.warn)) {
            console.clear();
        }
    }, 100);
});
