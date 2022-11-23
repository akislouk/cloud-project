// Selectors
const drops = document.querySelectorAll(
    ".navbar-nav .dropdown, .navbar-nav .dropend"
);
const toggles = document.querySelectorAll(".navbar-nav .dropdown-toggle");
const collapses = document.querySelectorAll(".navbar-collapse");

// Transition
const transitionDuration = 200;

// Positioner
const overflowPadding = 16;

// Breakpoint
const desktopSize = 992;

// Show drop
function showDrop(e, menu) {
    if (window.innerWidth < desktopSize) {
        return;
    }

    menu.classList.add("showing");

    setTimeout(() => {
        menu.classList.remove("showing");
        menu.classList.add("show");
    }, 1);

    positionDrop(menu);
}

// Hide drop
function hideDrop(e, menu) {
    if (window.innerWidth < desktopSize) {
        return;
    }

    if (!menu.classList.contains("show")) {
        return;
    }

    if (e.type === "click" && e.target.closest(".dropdown-menu form")) {
        return;
    }

    menu.classList.add("showing");
    menu.classList.remove("show");

    setTimeout(() => {
        menu.classList.remove("showing");
    }, transitionDuration);
}

// Toggle drop
function toggleDrop(e, menu) {
    e.preventDefault();

    if (window.innerWidth >= desktopSize) {
        return;
    }

    const parentElement = menu.parentElement;
    const parentMenu = parentElement.closest(".navbar, .navbar .dropdown-menu");
    const siblingMenus = parentMenu.querySelectorAll(".dropdown-menu");

    siblingMenus.forEach((el) => {
        if (el !== menu) {
            el.classList.remove("show");
        }
    });

    menu.classList.toggle("show");
}

// Hide menus
function hideMenus(menus) {
    if (window.innerWidth >= desktopSize) {
        return;
    }

    menus.forEach((menu) => {
        menu.classList.remove("show");
    });
}

// Position drop
function positionDrop(menu) {
    const positioner = menu.parentElement;
    const drop = positioner.parentElement;

    const isDropright = drop.classList.contains("dropend");
    const menuOffset = isDropright ? [-32, 0] : [0, 0];
    const menuPlacement = isDropright ? "right-start" : "auto";

    Popper.createPopper(drop, positioner, {
        placement: menuPlacement,
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: menuOffset,
                },
            },
            {
                name: "preventOverflow",
                options: {
                    padding: overflowPadding,
                },
            },
        ],
    });
}

//
// Listeners
//

drops.forEach((dropdown) => {
    const menu = dropdown.querySelector(".dropdown-menu");

    // Show drop
    dropdown.addEventListener("mouseenter", (e) => {
        showDrop(e, menu);
    });

    // Hide drop
    dropdown.addEventListener("mouseleave", (e) => {
        hideDrop(e, menu);
    });
});

toggles.forEach((toggle) => {
    const menu = toggle.parentElement.querySelector(".dropdown-menu");

    // Toggle drop (mobile)
    toggle.addEventListener("click", (e) => {
        toggleDrop(e, menu);
    });
});

collapses.forEach((collapse) => {
    collapse.addEventListener("hide.bs.collapse", () => {
        const menus = collapse.querySelectorAll(".dropdown-menu");

        // Hide menus
        hideMenus(menus);
    });
});
