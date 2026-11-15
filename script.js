
(function () {
    "use strict";

    const carousel = document.getElementById("car");
    if (!carousel) return;

    const track = carousel.querySelector(".track");
    const dotsContainer = carousel.querySelector(".dots");
    const prevButton = document.getElementById("cprev");
    const nextButton = document.getElementById("cnext");

    if (!track || !dotsContainer) return;

    const slides = Array.from(track.querySelectorAll(".slide"));
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    let currentSlide = 0;
    let timer = null;

    // Crear indicadores
    dotsContainer.innerHTML = "";

    const dots = slides.map((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.setAttribute("aria-label", "Ir a la diapositiva " + (index + 1));

        dot.addEventListener("click", () => {
            goToSlide(index);
            restartCarousel();
        });

        dotsContainer.appendChild(dot);
        return dot;
    });

    // Cambiar diapositiva
    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;

        const slideWidth = carousel.clientWidth;

        track.style.transform =
            `translate3d(-${currentSlide * slideWidth}px, 0, 0)`;

        dots.forEach((dot, i) => {
            dot.setAttribute(
                "aria-current",
                i === currentSlide ? "true" : "false"
            );
        });

        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.removeAttribute("inert");
            } else {
                slide.setAttribute("inert", "");
            }
        });
    }

    // Reproducción automática
    function playCarousel() {
        stopCarousel();

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            timer = setInterval(() => {
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

    // Flecha anterior
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            goToSlide(currentSlide - 1);
            restartCarousel();
        });
    }

    // Flecha siguiente
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            goToSlide(currentSlide + 1);
            restartCarousel();
        });
    }

    // Pausar al interactuar
    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", playCarousel);
    carousel.addEventListener("focusin", stopCarousel);

    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            playCarousel();
        }
    });

    // Adaptar posición al cambiar el tamaño
    window.addEventListener("resize", () => {
        goToSlide(currentSlide);
    });

    // Deslizamiento táctil
    let touchStartX = 0;
    let touchStartY = 0;

    carousel.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        stopCarousel();
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        const differenceX = event.changedTouches[0].clientX - touchStartX;
        const differenceY = event.changedTouches[0].clientY - touchStartY;

        if (
            Math.abs(differenceX) > 40 &&
            Math.abs(differenceX) > Math.abs(differenceY)
        ) {
            goToSlide(currentSlide + (differenceX < 0 ? 1 : -1));
        }

        restartCarousel();
    }, { passive: true });

    // Iniciar
    goToSlide(0);
    playCarousel();

})();
