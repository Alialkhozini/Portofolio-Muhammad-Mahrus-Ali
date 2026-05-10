// active hamburger menu 
const menuIcon = document.querySelector(".menu-icon");
const navlist = document.querySelector(".navlist");

menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("active");
    navlist.classList.toggle("active");
    document.body.classList.toggle("open");
});

navlist.addEventListener("click", () => {
    navlist.classList.remove("active");
    menuIcon.classList.remove("active");
    document.body.classList.remove("open");
});

// rotate text
const text = document.querySelector(".text p");

if (text) {
    text.innerHTML = text.innerHTML.split("").map((char, i) =>
        `<b style="transform:rotate(${i * 6.3}deg)">${char}</b>`
    ).join("");
}

// switch between about buttons 
const buttons = document.querySelectorAll(".about-btn button");
const contents = document.querySelectorAll(".content");

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        contents.forEach(content => content.style.display = "none");
        contents[index].style.display = "block";

        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

// portfolio filter
if (document.querySelector(".portfolio-gallery")) {
    mixitup(".portfolio-gallery", {
        selectors: {
            target: ".portfolio-box"
        },
        animation: {
            duration: 500
        }
    });
}

// swiper
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        576: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
    }
});

// skill progress bar
const firstSkill = document.querySelector(".skill:first-child");
const skCounters = document.querySelectorAll(".counter span");
const progressBars = document.querySelectorAll(".skills svg circle");

let skillsPlayed = false;

function hasReached(el) {
    if (!el) return false;
    const topPosition = el.getBoundingClientRect().top;
    return window.innerHeight >= topPosition + el.offsetHeight;
}

function updateCount(num, maxNum) {
    let currentNum = +num.innerText;

    if (currentNum < maxNum) {
        num.innerText = currentNum + 1;
        setTimeout(() => {
            updateCount(num, maxNum);
        }, 12);
    }
}

function skillsCounter() {
    if (!hasReached(firstSkill)) return;

    skillsPlayed = true;

    skCounters.forEach((counter, i) => {
        const target = +counter.dataset.target;
        const strokeValue = 465 - 465 * (target / 100);

        progressBars[i].style.setProperty("--target", strokeValue);

        setTimeout(() => {
            updateCount(counter, target);
        }, 400);
    });

    progressBars.forEach(p => {
        p.style.animation = "progress 2s ease-in-out forwards";
    });
}

window.addEventListener("scroll", () => {
    if (!skillsPlayed) skillsCounter();
});

// scroll progress button
const scrollProgress = document.getElementById("progress");

function calcScrollValue() {
    const pos = document.documentElement.scrollTop;
    const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollValue = Math.round((pos * 100) / calcHeight);

    if (pos > 100) {
        scrollProgress.style.display = "grid";
    } else {
        scrollProgress.style.display = "none";
    }

    scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%, #e6006d ${scrollValue}%)`;
}

if (scrollProgress) {
    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });

    window.addEventListener("scroll", calcScrollValue);
    window.addEventListener("load", calcScrollValue);
}

// active menu
const menuLi = document.querySelectorAll("header ul li a");
const sections = document.querySelectorAll("section");

function activeMenu() {
    let len = sections.length;

    while (--len && window.scrollY + 97 < sections[len].offsetTop) {}

    menuLi.forEach(sec => sec.classList.remove("active"));

    if (menuLi[len]) {
        menuLi[len].classList.add("active");
    }
}

activeMenu();
window.addEventListener("scroll", activeMenu);

// scroll reveal
ScrollReveal({
    distance: "90px",
    duration: 2000,
    delay: 200,
});

ScrollReveal().reveal(".hero-info, .main-text, .proposal, .heading", { origin: "top" });
ScrollReveal().reveal(".about-img, .fillter-buttons, .contact-info", { origin: "left" });
ScrollReveal().reveal(".about-content, .skills", { origin: "right" });
ScrollReveal().reveal(".allServices, .portfolio-gallery, .blog-box, footer, .img-hero", { origin: "bottom" });