
(function () {
    "use strict";

    /* ========================================
       CARRUSEL PRINCIPAL
    ======================================== */

    const carousel = document.getElementById("car");

    // Evita errores si el carrusel no existe
    if (!carousel) return;

    const track = carousel.querySelector(".track");
    const dotsContainer = carousel.querySelector(".dots");
    const prevButton = document.getElementById("cprev");
    const nextButton = document.getElementById("cnext");

    if (!track || !dotsContainer) return;

    const slides = Array.from(track.children);
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    let currentSlide = 0;
    let timer = null;

    /* ========================================
       CREAR INDICADORES
    ======================================== */

    dotsContainer.innerHTML = "";

    const dots = slides.map(function (_, index) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.setAttribute(
            "aria-label",
            "Ir a la diapositiva " + (index + 1)
        );

        dot.addEventListener("click", function () {
            goToSlide(index);
            restartCarousel();
        });

        dotsContainer.appendChild(dot);

        return dot;
    });

    /* ========================================
       CAMBIAR DIAPOSITIVA
    ======================================== */

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;

        track.style.transform =
            "translateX(-" + (currentSlide * 100) + "%)";

        // Actualizar indicadores
        dots.forEach(function (dot, i) {
            dot.setAttribute(
                "aria-current",
                i === currentSlide ? "true" : "false"
            );
        });

        // Accesibilidad
        slides.forEach(function (slide, i) {
            if (i === currentSlide) {
                slide.removeAttribute("inert");
            } else {
                slide.setAttribute("inert", "");
            }
        });
    }

    /* ========================================
       REPRODUCCIÓN AUTOMÁTICA
    ======================================== */

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

    function stopCarousel() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    function restartCarousel() {
        stopCarousel();
        playCarousel();
    }

    /* ========================================
       BOTÓN ANTERIOR
    ======================================== */

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            goToSlide(currentSlide - 1);
            restartCarousel();
        });
    }

    /* ========================================
       BOTÓN SIGUIENTE
    ======================================== */

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            goToSlide(currentSlide + 1);
            restartCarousel();
        });
    }

    /* ========================================
       PAUSAR AL PASAR EL MOUSE
    ======================================== */

    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", playCarousel);

    /* ========================================
       PAUSAR AL USAR EL TECLADO
    ======================================== */

    carousel.addEventListener("focusin", stopCarousel);
    carousel.addEventListener("focusout", function (event) {
        if (!carousel.contains(event.relatedTarget)) {
            playCarousel();
        }
    });

    /* ========================================
       DESLIZAMIENTO TÁCTIL
    ======================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    carousel.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        stopCarousel();
    }, { passive: true });

    carousel.addEventListener("touchend", function (event) {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const differenceX = touchEndX - touchStartX;
        const differenceY = touchEndY - touchStartY;

        if (
            Math.abs(differenceX) > 40 &&
            Math.abs(differenceX) > Math.abs(differenceY)
        ) {
            if (differenceX < 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
        }

        restartCarousel();
    }, { passive: true });

    /* ========================================
       INICIAR CARRUSEL
    ======================================== */

    goToSlide(0);
    playCarousel();

})();
