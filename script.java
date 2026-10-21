
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

    // Abrir / cerrar menú
    buttonMenu.addEventListener("click", function (event) {
        event.stopPropagation();

        const isOpen = panelMenu.classList.contains("open");

        setMenu(!isOpen);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", function () {
        setMenu(false);
    });

    // Cerrar con Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    // Cerrar al seleccionar una opción
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
    const slides = track.children;

    const totalSlides = slides.length;

    let currentSlide = 0;
    let timer;

    const dotsContainer = carousel.querySelector(".dots");

    const dots = [];


    /* ========================================
       CREAR PUNTOS DEL CARRUSEL
    ======================================== */

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


    /* ========================================
       CAMBIAR DE DIAPOSITIVA
    ======================================== */

    function goToSlide(index) {

        currentSlide =
            (index + totalSlides) % totalSlides;

        track.style.transform =
            "translateX(-" + (currentSlide * 100) + "%)";


        // Actualizar puntos
        for (let q = 0; q < totalSlides; q++) {

            dots[q].setAttribute(
                "aria-current",
                q === currentSlide
            );


            // Accesibilidad
            if (q === currentSlide) {

                slides[q].removeAttribute("inert");

            } else {

                slides[q].setAttribute("inert", "");

            }
        }
    }


    /* ========================================
       REPRODUCCIÓN AUTOMÁTICA
    ======================================== */

    function playCarousel() {

        stopCarousel();

        // No reproducir automáticamente
        // si el usuario tiene animaciones reducidas.
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

        clearInterval(timer);
    }


    /* ========================================
       BOTÓN ANTERIOR
    ======================================== */

    document
       