document.addEventListener("DOMContentLoaded", function () {
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

    // ✅ التحكم في القائمة الجانبية (الهامبرجر) 🍔
    const menuBtn = document.querySelector(".hamburger-menu");
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".overlay");
    const body = document.body;

    // ✅ فتح القائمة عند النقر على زر الهامبرجر
    menuBtn.addEventListener("click", function () {
        mobileMenu.classList.add("active");
        overlay.classList.add("active");
        body.classList.add("no-scroll"); // تعطيل التمرير
    });

    // ✅ إغلاق القائمة عند النقر على الخلفية (Overlay)
    overlay.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");
        body.classList.remove("no-scroll"); // إعادة التمرير
    });

    // ✅ إغلاق القائمة عند الضغط على زر (Esc)
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            mobileMenu.classList.remove("active");
            overlay.classList.remove("active");
            body.classList.remove("no-scroll"); // إعادة التمرير
        }
    });

    // ✅ التحكم في القوائم الفرعية 📂
    document.querySelectorAll(".subject").forEach(subject => {
        subject.addEventListener("click", function () {
            // ✅ إغلاق أي قائمة فرعية مفتوحة قبل فتح القائمة الجديدة
            document.querySelectorAll(".subject.open").forEach(openSubject => {
                if (openSubject !== this) { // استثناء العنصر الحالي
                    openSubject.classList.remove("open");
                    let openSubmenu = openSubject.querySelector(".submenu");
                    if (openSubmenu) {
                        openSubmenu.style.display = "none";
                    }
                }
            });

            // ✅ تبديل القائمة الحالية بين الفتح والإغلاق
            this.classList.toggle("open");
            let submenu = this.querySelector(".submenu");
            if (submenu) {
                if (submenu.style.display === "block") {
                    submenu.style.display = "none";
                } else {
                    submenu.style.display = "block";
                }
            }
        });
    });

    // ✅ إخفاء زر الهامبرجر عند التمرير لأسفل وإظهاره فقط عند العودة للأعلى
    const hamburgerMenu = document.querySelector(".hamburger-menu");

    window.addEventListener("scroll", function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 0) {
            // المستخدم نزل لأسفل -> إخفاء الزر
            hamburgerMenu.classList.add("hamburger-hidden");
        } else {
            // المستخدم عاد لأعلى الصفحة تمامًا -> إظهار الزر
            hamburgerMenu.classList.remove("hamburger-hidden");
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // ✅ استعادة موضع التمرير عند تحميل الصفحة
    if (sessionStorage.getItem("scrollPosition")) {
        window.scrollTo(0, sessionStorage.getItem("scrollPosition"));
    }

    // ✅ حفظ موضع التمرير قبل مغادرة الصفحة
    window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("scrollPosition", window.scrollY);
    });
});
