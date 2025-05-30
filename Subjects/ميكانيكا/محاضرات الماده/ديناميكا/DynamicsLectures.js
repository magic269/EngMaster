const videoUrls = {
    video1: "https://www.youtube.com/embed/v8U39hOVhoc",
    video2: "https://www.youtube.com/embed/3MVG5aCJqfs",
    video3: "https://www.youtube.com/embed/ZA6jfjDsJGE",
    video4: "https://www.youtube.com/embed/3wY-b-mqnDQ",
    video5: "https://www.youtube.com/embed/XJ6_VsS8hWs",
    video6: "https://www.youtube.com/embed/F7DuzfPKTk0",
    video7: "https://www.youtube.com/embed/QCZL3Boj5ns",
    video8: "https://www.youtube.com/embed/lQdda2KChvQ",
    video9: "https://www.youtube.com/embed/0_A65W1-_gY",
    video10: "https://www.youtube.com/embed/qdB5qlaEHC4",
    video11: "https://www.youtube.com/embed/gpljcKXn7l0",
    video12: "https://www.youtube.com/embed/TKYrD7Pwgno",
    video13: "https://www.youtube.com/embed/oVcC7-579lM",
    video14: "https://www.youtube.com/embed/saCMfXps1u4",
    video15: "https://www.youtube.com/embed/hM_3a7OpSbc",
    video16: "https://www.youtube.com/embed/yjacW_M9e-s",
    video17: "https://www.youtube.com/embed/6R8CJh5vS5U",
    video18: "https://www.youtube.com/embed/r-vhUdvT9b0"
};

const isValidUrl = (url) => /^https:\/\/www\.youtube\.com\/embed\//.test(url);

const showVideo = (element, videoId) => {
    const videoContainer = document.getElementById(videoId);
    if (!videoContainer) return;
    const videoUrl = videoUrls[videoId];
    if (!videoUrl || !isValidUrl(videoUrl)) return;
    const allLinks = document.querySelectorAll(".subject li a");
    const allContainers = document.querySelectorAll(".video-container");
    allLinks.forEach((link) => link.classList.remove("active"));
    allContainers.forEach((container) => {
        container.innerHTML = "";
        container.classList.remove("visible");
    });
    element.classList.add("active");
    if (videoContainer.querySelector("iframe")?.src === videoUrl) return;
    const iframe = document.createElement("iframe");
    iframe.src = videoUrl;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    videoContainer.innerHTML = "";
    videoContainer.appendChild(iframe);
    videoContainer.classList.add("visible");
    videoContainer.scrollIntoView({ behavior: "smooth", block: "center" });
};

document.addEventListener("click", (e) => {
    const videoContainer = e.target.closest(".video-container");
    const link = e.target.closest(".subject li a");
    if (!videoContainer && !link) {
        document.querySelectorAll(".video-container").forEach((container) => {
            container.innerHTML = "";
            container.classList.remove("visible");
        });
        document.querySelectorAll(".subject li a").forEach((link) => link.classList.remove("active"));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".subject li a");
    links.forEach((link) => {
        if (link.getAttribute("href") && link.getAttribute("href").startsWith("https://www.youtube.com")) {
            return;
        }
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const videoId = link.getAttribute("data-video-id") || link.getAttribute("onclick")?.match(/'video\d+'/)[0].replace(/'/g, "");
            if (videoId) {
                showVideo(link, videoId);
            }
        });
    });
    if ("IntersectionObserver" in window) {
        const containers = document.querySelectorAll(".video-container");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        entry.target.innerHTML = "";
                        entry.target.classList.remove("visible");
                    }
                });
            },
            { threshold: 0 }
        );
        containers.forEach((container) => observer.observe(container));
    }
});

window.addEventListener("error", (e) => {
    if (e.target.tagName === "IFRAME") {
        const container = e.target.closest(".video-container");
        if (container) {
            const errorMsg = document.createElement("p");
            errorMsg.style.color = "red";
            errorMsg.style.textAlign = "center";
            errorMsg.style.padding = "20px";
            errorMsg.innerHTML = `عذرًا، هذا الفيديو غير متاح للتشغيل هنا. <a href="${e.target.src.replace('/embed/', '/watch?v=')}" target="_blank" style="color: #007bff; text-decoration: underline;">شاهد الفيديو على يوتيوب</a>`;
            container.innerHTML = "";
            container.appendChild(errorMsg);
            container.classList.add("visible");
        }
    }
}, true);