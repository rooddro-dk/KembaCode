
(function () {

    /* ========================================
       MENÚ DE CONTACTO
    ======================================== */

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


    /* ========================================
       CARRUSEL
    ======================================== */

    const carousel = document.getElementById("car");
    const track = carousel.querySelector(".track");
    const slides = Array.from(track.children);

    const totalSlides = slides.length;

    let currentSlide = 0;
    let timer = null;

    const dotsContainer = carousel.querySelector(".dots");
    const dots = [];


    /* ========================================
       CREAR PUNTOS
    ======================================== */

    slides.forEach(function (_, index) {

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

        dots.push(dot);
    });


    /* ========================================
       CAMBIAR SLIDE
    ======================================== */

    function goToSlide(index) {

        currentSlide =
            (index + totalSlides) % totalSlides;

        track.style.transform =
            `translateX(-${currentSlide * 100}%)`;


        /* Actualizar puntos */

        dots.forEach(function (dot, index) {

            dot.setAttribute(
                "aria-current",
                index === currentSlide
            );

        });


        /* Accesibilidad */

        slides.forEach(function (slide, index) {

            if (index === currentSlide) {

                slide.removeAttribute("inert");

            } else {

                slide.setAttribute("inert", "");

            }

        });
    }


    /* ========================================
       CARRUSEL AUTOMÁTICO
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


    /* ========================================
       DETENER CARRUSEL
    ======================================== */

    function stopCarousel() {

        if (timer !== null) {

            clearInterval(timer);

            timer = null;
        }
    }


    /* ========================================
       REINICIAR TEMPORIZADOR
    ======================================== */

    function restartCarousel() {

        stopCarousel();
        playCarousel();
    }


    /* ========================================
       BOTÓN ANTERIOR
    ======================================== */

    document
        .getElementById("cprev")
        .addEventListener("click", function () {

            goToSlide(currentSlide - 1);
            restartCarousel();

        });


    /* ========================================
       BOTÓN SIGUIENTE
    ======================================== */

    document
        .getElementById("cnext")
        .addEventListener("click", function () {

            goToSlide(currentSlide + 1);
            restartCarousel();

        });


    /* ========================================
       MOUSE
    ======================================== */

    carousel.addEventListener(
        "mouseenter",
        stopCarousel
    );

    carousel.addEventListener(
        "mouseleave",
        playCarousel
    );


    /* ========================================
       TECLADO
    ======================================== */

    carousel.addEventListener(
        "focusin",
        stopCarousel
    );

    carousel.addEventListener(
        "focusout",
        playCarousel
    );


    /* ========================================
       DESLIZAMIENTO TÁCTIL
    ======================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    carousel.addEventListener(
        "touchstart",
        function (event) {

            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;

            stopCarousel();

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

            const touchEndY =
                event.changedTouches[0].clientY;


            const differenceX =
                touchEndX - touchStartX;

            const differenceY =
                touchEndY - touchStartY;


            /*
             * Solo hacemos swipe si el movimiento
             * horizontal es mayor que el vertical.
             */

            if (
                Math.abs(differenceX) > 40 &&
                Math.abs(differenceX) > Math.abs(differenceY)
            ) {

                if (differenceX < 0) {

                    // Deslizar hacia la izquierda
                    goToSlide(currentSlide + 1);

                } else {

                    // Deslizar hacia la derecha
                    goToSlide(currentSlide - 1);

                }
            }


            restartCarousel();

        },
        {
            passive: true
        }
    );


    /* ========================================
       INICIO
    ======================================== */

    goToSlide(0);

    playCarousel();

})();
