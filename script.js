
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
/* =========================================
   FORMULARIO DINÁMICO KEMBACODE
========================================= */

(function () {
    "use strict";

    const category = document.getElementById("serviceType");
    const project = document.getElementById("projectType");
    const mode = document.getElementById("serviceMode");
    const customField = document.getElementById("customProjectField");
    const customInput = document.getElementById("customProject");
    const message = document.getElementById("projectMessage");

    if (!category || !project || !mode || !message) return;

    const projects = {
        dominios: [
            ["hosting", "Hosting y creación de página web"],
            ["registro", "Registro de dominio"],
            ["dns", "Configuración DNS y SSL"],
            ["transferencia", "Renovación o transferencia"]
        ],

        reservas: [
            ["app-reservas", "App de reservas"],
            ["agenda", "Agenda de citas"],
            ["recordatorios", "Recordatorios automáticos"]
        ],

        servicios: [
            ["fidelizacion", "Fidelización con Wallet"],
            ["plataforma", "Plataforma de gestión"],
            ["portal", "Portal de clientes"]
        ],

        tienda: [
            ["financiamiento", "Soporte de financiamiento"],
            ["tienda-completa", "Tienda online completa"],
            ["catalogo", "Catálogo digital"],
            ["pagos", "Pagos y pedidos"]
        ],

        peticion: [
            ["personalizado", "Proyecto personalizado"]
        ]
    };

    const descriptions = {
        hosting: "Me interesa crear una página web con hosting, dominio y certificado SSL.",
        registro: "Me gustaría registrar un dominio para mi negocio.",
        dns: "Necesito configurar DNS y certificado SSL.",
        transferencia: "Necesito renovar o transferir mi dominio.",
        "app-reservas": "Quiero desarrollar una aplicación de reservas y citas.",
        agenda: "Necesito una agenda digital para organizar citas.",
        recordatorios: "Me gustaría implementar recordatorios automáticos.",
        fidelizacion: "Me interesa implementar tarjetas digitales de fidelización.",
        plataforma: "Quiero una plataforma para gestionar clientes y servicios.",
        portal: "Me interesa desarrollar un portal para mis clientes.",
        financiamiento: "Quisiera recibir asesoría para preparar mi proyecto de financiamiento.",
        "tienda-completa": "Quiero desarrollar una tienda online.",
        catalogo: "Me interesa crear un catálogo digital.",
        pagos: "Quiero implementar un sistema de pagos y pedidos.",
        personalizado: "Tengo una idea diferente y quisiera conversar sobre su desarrollo."
    };

    const categoryNames = {
        dominios: "Dominios",
        tienda: "Tienda online",
        servicios: "Servicios",
        reservas: "Reservas y citas",
        peticion: "Petición del cliente"
    };

    function updateMessage() {
        const categoryValue = category.value;
        const projectValue = project.value;
        const selectedProject = project.options[project.selectedIndex];

        if (!categoryValue || !projectValue || !selectedProject) {
            message.value = "";
            return;
        }

        const projectName = selectedProject.textContent;
        const customName = categoryValue === "peticion"
            ? customInput.value.trim()
            : "";

        message.value =
            "Hola KembaCode, me gustaría recibir información.\n\n" +
            "Categoría: " + categoryNames[categoryValue] + "\n" +
            "Proyecto: " + (customName || projectName) + "\n" +
            "Tipo de solicitud: " + mode.value + "\n\n" +
            (descriptions[projectValue] || "") +
            "\n\nMe gustaría conocer los detalles y el proceso de trabajo.";
    }

function updateProjects() {
    const selectedCategory = category.value;
    const available = projects[selectedCategory] || [];

    project.innerHTML = "";

    if (available.length === 0) {
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Primero selecciona una categoría";
        project.appendChild(placeholder);
        project.disabled = true;
    } else {
        available.forEach(item => {
            const option = document.createElement("option");
            option.value = item[0];
            option.textContent = item[1];
            project.appendChild(option);
        });

        // Seleccionar automáticamente el primer proyecto
        project.disabled = false;
        project.value = available[0][0];
    }

    const isCustom = selectedCategory === "peticion";

    if (customField) {
        customField.hidden = !isCustom;
    }

    if (customInput) {
        customInput.required = isCustom;

        if (!isCustom) {
            customInput.value = "";
        }
    }

    updateMessage();
}

    category.addEventListener("change", updateProjects);
    project.addEventListener("change", updateMessage);
    mode.addEventListener("change", updateMessage);

    if (customInput) {
        customInput.addEventListener("input", updateMessage);
    }

    // Actualizar al entrar desde una tarjeta del portafolio
    document.querySelectorAll(".portfolio-arrow[data-service]").forEach(link => {
        link.addEventListener("click", () => {
            category.value = link.dataset.service;
            updateProjects();
        });
    });

    // Generar mensaje también al editar el texto
    message.addEventListener("input", function () {
        message.dataset.edited = "true";
    });

    category.addEventListener("change", () => {
        message.dataset.edited = "false";
    });

    project.addEventListener("change", () => {
        message.dataset.edited = "false";
    });

    mode.addEventListener("change", () => {
        message.dataset.edited = "false";
        updateMessage();
    });

    // Inicializar
    updateProjects();

})();