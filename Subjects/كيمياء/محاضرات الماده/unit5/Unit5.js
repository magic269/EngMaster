const videoUrls = {
    video1: "https://www.youtube.com/embed/bMo1s96ssx4",
    video2: "https://www.youtube.com/embed/ZiFRYK_BBb0",
    video3: "https://www.youtube.com/embed/syvZ-SWdzMc",
    video4: "https://www.youtube.com/embed/mWEeR9AaF6k",
    video5: "https://www.youtube.com/embed/3S9-slPf8co",
    video6: "https://www.youtube.com/embed/0OcGtTwpLj4",
    video7: "https://www.youtube.com/embed/dng8Xp31fSQ",
    video8: "https://www.youtube.com/embed/wg4LRlhtqoQ",
    video9: "https://www.youtube.com/embed/videoseries?list=PLJwyTXdjPfG1F4vvTymM0Hywvun8NBjWa",
    video10: "https://www.youtube.com/embed/ZplxMcCsE5A",
    video11: "https://www.youtube.com/embed/jlUQZXE5mqw",
    video12: "https://www.youtube.com/embed/zjFcZOO0tmg",
    video13: "https://www.youtube.com/embed/KdiiKSNYK9A",
    video14: "https://www.youtube.com/embed/7PrrAkJ9gs4"
};

const isValidUrl = (url) => /^https:\/\/www\.youtube\.com\/embed\//.test(url);

const showVideo = (element, videoId) => {
    const videoContainer = document.getElementById(videoId);
    if (!videoContainer) return;
    const videoUrl = videoUrls[videoId];
    if (!videoUrl || !isValidUrl(videoUrl)) return;
    const allLinks = document.querySelectorAll(".subject li a:not(.coming-soon)");
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
    const link = e.target.closest(".subject li a:not(.coming-soon)");
    if (!videoContainer && !link) {
        document.querySelectorAll(".video-container").forEach((container) => {
            container.innerHTML = "";
            container.classList.remove("visible");
        });
        document.querySelectorAll(".subject li a:not(.coming-soon)").forEach((link) => link.classList.remove("active"));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".subject li a:not(.coming-soon)");
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const videoId = link.getAttribute("data-video-id") || link.getAttribute("onclick").match(/'video\d+'/)[0].replace(/'/g, "");
            showVideo(link, videoId);
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
            errorMsg.textContent = "خطأ في تحميل الفيديو، حاول مرة أخرى لاحقًا.";
            container.innerHTML = "";
            container.appendChild(errorMsg);
        }
    }
}, true);