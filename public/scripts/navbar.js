// Reveal navbar when scrolling
const navbarReveal = document.querySelector(".navbar-reveal");
const windowEvents = ["load", "scroll"];
let windowScroll = window.scrollY;

if (navbarReveal)
    windowEvents.forEach((e) => {
        window.addEventListener(e, () => {
            const currentScroll = window.scrollY;
            const navbarOffset =
                windowScroll < currentScroll && currentScroll > 0 ? "-100%" : "0";
            const navbarCollapse = navbarReveal.querySelector(".navbar-collapse");

            if (!navbarCollapse.classList.contains("show"))
                navbarReveal.style.transform = `translateY(${navbarOffset})`;

            windowScroll = currentScroll;
        });
    });

// Popper.js dropdown on hover functionality
const drops = document.querySelectorAll(".navbar-nav .dropdown, .navbar-nav");
const toggles = document.querySelectorAll(".navbar-nav .dropdown-toggle");
const collapses = document.querySelectorAll(".navbar-collapse");

const transitionDuration = 200;
const overflowPadding = 16;
const desktopSize = 992;

function showDrop(e, menu) {
    if (window.innerWidth < desktopSize) return;
    menu.classList.add("showing");

    setTimeout(() => {
        menu.classList.remove("showing");
        menu.classList.add("show");
    }, 1);

    positionDrop(menu);
}

function hideDrop(e, menu) {
    if (window.innerWidth < desktopSize) return;
    if (!menu.classList.contains("show")) return;
    if (e.type === "click" && e.target.closest(".dropdown-menu form")) return;

    menu.classList.add("showing");
    menu.classList.remove("show");

    setTimeout(() => menu.classList.remove("showing"), transitionDuration);
}

function toggleDrop(e, menu) {
    e.preventDefault();

    if (window.innerWidth >= desktopSize) return;

    const parentElement = menu.parentElement;
    const parentMenu = parentElement.closest(".navbar, .navbar .dropdown-menu");
    const siblingMenus = parentMenu.querySelectorAll(".dropdown-menu");

    siblingMenus.forEach((el) => {
        if (el !== menu) el.classList.remove("show");
    });

    menu.classList.toggle("show");
}

function hideMenus(menus) {
    if (window.innerWidth >= desktopSize) return;
    menus.forEach((menu) => menu.classList.remove("show"));
}

function positionDrop(menu) {
    const positioner = menu.parentElement;
    const drop = positioner.parentElement;

    const menuOffset = [0, 0];
    const menuPlacement = "auto";

    Popper.createPopper(drop, positioner, {
        placement: menuPlacement,
        modifiers: [
            { name: "offset", options: { offset: menuOffset } },
            { name: "preventOverflow", options: { padding: overflowPadding } },
        ],
    });
}

drops.forEach((dropdown) => {
    const menu = dropdown.querySelector(".dropdown-menu");
    dropdown.addEventListener("mouseenter", (e) => showDrop(e, menu));
    dropdown.addEventListener("mouseleave", (e) => hideDrop(e, menu));
});

toggles.forEach((toggle) => {
    const menu = toggle.parentElement.querySelector(".dropdown-menu");
    toggle.addEventListener("click", (e) => toggleDrop(e, menu));
});

collapses.forEach((collapse) => {
    collapse.addEventListener("hide.bs.collapse", () => {
        const menus = collapse.querySelectorAll(".dropdown-menu");
        hideMenus(menus);
    });
});
