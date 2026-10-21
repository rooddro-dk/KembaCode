(function () {

    /* ==============================
       MENÚ DE CONTACTO
    ============================== */

    const buttonMenu = document.getElementById("mbtn");
    const panelMenu = document.getElementById("mpanel");

    function setMenu(open) {
        panelMenu.classList.toggle("open", open);
        buttonMenu.setAttribute("aria-expanded", open);
    }

    buttonMenu.addEventListener("click", function (event) {
        event.stopPropagation();

        const isOpen = panelMenu.classList.contains("open");

        setMenu(!isOpen);
    });

    document.addEventListener("click", function () {
        setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    panelMenu.addEventListener("click", function (event) {
        event.stopPropagation();

        if (event.target.closest("a")) {
            setMenu(false);
        }
    });


    /* ==============================
       CARRUSEL
    ============================== */

    const carousel = document.getElementById("car");
    const track = carousel.querySelector(".track");
    const slides = track.children;

    const totalSlides = slides.length;

    let currentSlide = 0;
    let timer;

    const dotsContainer = carousel.querySelector(".dots");
    const dots = [];


    /* ==============================
       CREAR PUNTOS
    ============================== */

    for (let k = 0; k < totalSlides; k++) {

        const dot = document.createElement("button");

        dot.type = "button";

        dot.setAttribute(
            "aria-label",
            "Ir a la diapositiva " + (k + 1)
        );

        dot.addEventListener("click", function () {
            goToSlide(k);
        });

        dotsContainer.appendChild(dot);

        dots.push(dot);
    }


    /* ==============================
       CAMBIAR SLIDE
    ============================== */

    function goToSlide(index) {

        currentSlide =
            (index + totalSlides) % totalSlides;

        track.style.transform =
            "translateX(-" + (currentSlide * 100) + "%)";

        for (let q = 0; q < totalSlides; q++) {

            dots[q].setAttribute(
                "aria-current",
                q === currentSlide
            );

            if (q === currentSlide) {
                slides[q].removeAttribute("inert");
            } else {
                slides[q].setAttribute("inert", "");
            }
        }
    }


    /* ==============================
       REPRODUCCIÓN AUTOMÁTICA
    ============================== */

    function playCarousel() {

        stopCarousel();

        if (
            !window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            timer = setInterval(function () {
                goToSlide(currentSlide + 1);
            }, 6000);
        }
    }


    /* ==============================
       DETENER CARRUSEL
    ============================== */

    function stopCarousel() {
        clearInterval(timer);
    }


    /* ==============================
       BOTONES ANTERIOR / SIGUIENTE
    ============================== */

    document
        .getElementById("cprev")
        .addEventListener("click", function () {

            goToSlide(currentSlide - 1);

        });

    document
        .getElementById("cnext")
        .addEventListener("click", function () {

            goToSlide(currentSlide + 1);

        });


    /* ==============================
       PAUSAR AL PASAR EL MOUSE
    ============================== */

    carousel.addEventListener(
        "mouseenter",
        stopCarousel
    );

    carousel.addEventListener(
        "mouseleave",
        playCarousel
    );


    /* ==============================
       PAUSAR AL USAR EL TECLADO
    ============================== */

    carousel.addEventListener(
        "focusin",
        stopCarousel
    );

    carousel.addEventListener(
        "focusout",
        playCarousel
    );


    /* ==============================
       DESLIZAR EN CELULAR
    ============================== */

    let touchStartX = 0;

    carousel.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );

    carousel.addEventListener(
        "touchend",
        function (event) {

            const touchEndX =
                event.changedTouches[0].clientX;

            const difference =
                touchEndX - touchStartX;

            if (Math.abs(difference) > 40) {

                if (difference < 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }

            }

        }
    );


    /* ==============================
       INICIAR
    ============================== */

    goToSlide(0);
    playCarousel();

})();