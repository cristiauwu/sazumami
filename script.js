document.addEventListener("DOMContentLoaded", () => {
    // === Elementos del DOM ===
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    
    const scrollIndicator = document.getElementById("scroll-indicator");
    const contentContainer = document.getElementById("content-container");
    const subtitleEl = document.getElementById("subtitle");
    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");
    const regulatorySeal = document.getElementById("regulatory-seal");
    const ctaButton = document.getElementById("cta-button");
    const brandLogo = document.querySelector(".brand-logo");

    // === Cursor Personalizado ===
    const customCursor = document.getElementById("custom-cursor");
    let cursorTargetX = window.innerWidth / 2;
    let cursorTargetY = window.innerHeight / 2;
    let cursorActualX = cursorTargetX;
    let cursorActualY = cursorTargetY;
    
    // === Botón Magnético ===
    let ctaTargetX = 0;
    let ctaTargetY = 0;
    let ctaActualX = 0;
    let ctaActualY = 0;
    let ctaTargetScale = 1;
    let ctaActualScale = 1;

    if (ctaButton) {
        ctaButton.addEventListener("mousemove", (e) => {
            const rect = ctaButton.getBoundingClientRect();
            // Calcular distancia desde el centro del botón
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Factor de atracción magnética (0.4)
            ctaTargetX = x * 0.4;
            ctaTargetY = y * 0.4;
        });

        ctaButton.addEventListener("mouseenter", () => {
            if (customCursor) customCursor.classList.add("hovering");
            ctaTargetScale = 1.05;
        });

        ctaButton.addEventListener("mouseleave", () => {
            if (customCursor) customCursor.classList.remove("hovering");
            ctaTargetX = 0;
            ctaTargetY = 0;
            ctaTargetScale = 1;
        });
    }

    // === Variables de Mouse Parallax ===
    let mouseX = 0;
    let mouseY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    window.addEventListener("mousemove", (e) => {
        // Normalizar posición del ratón de -1 a 1 para parallax
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        // Actualizar objetivo del cursor personalizado
        cursorTargetX = e.clientX;
        cursorTargetY = e.clientY;
    });

    // === Configuración de Animación ===
    const frameCount = 240;
    const images = [];
    const imagePath = (index) => `sequence/ezgif-frame-${index.toString().padStart(3, '0')}.webp`;

    // === Scroll Lerp (Amortiguador de Frames) ===
    let targetFrame = 0;
    let currentFrame = 0;
    let lastRenderedFrame = -1;
    
    // Datos de las Etapas (Stages)
    const stages = [
        {
            threshold: 0,
            title: "Saz<span style='color: var(--accent-gold)'>u</span>mami",
            subtitle: "SAZÓN DE MAR",
            htmlContent: "",
            showSeal: false,
            showCTA: false
        },
        {
            threshold: 0.14,
            title: "El <span style='color: var(--accent-gold)'>Origen</span>",
            subtitle: "",
            htmlContent: "El sabor puro del océano, capturado y molido artesanalmente para elevar tus platillos a nivel gourmet.",
            showSeal: false,
            showCTA: false
        },
        {
            threshold: 0.28,
            title: "Nuestra <span style='color: var(--accent-gold)'>Receta</span>",
            subtitle: "",
            htmlContent: `
                <p style="margin-bottom: 8px;">El alma de nuestro sazón es 100% natural:</p>
                <span class="highlight-text" style="display:block; font-size:1.15rem; margin-bottom: 10px; line-height: 1.2;">Camarón Seco Premium (53%)</span>
                <p style="font-size: 0.85rem; opacity: 0.8; line-height: 1.4;">Combinado magistralmente con Sal de mar, Ajo, Cebolla, Paprika, Pimienta, Chile y Hierbas finas.</p>
            `,
            showSeal: false,
            showCTA: false
        },
        {
            threshold: 0.42,
            title: "Ingredientes y <span style='color: var(--accent-gold)'>Composición</span>",
            subtitle: "",
            htmlContent: `
                <ul class="ingredient-list">
                    <li><span>Harina de camarón</span><span>53.42%</span><span>Umami puro, 51.7g proteína/100g.</span></li>
                    <li><span>Sal de mesa</span><span>32.05%</span><span>Conservador natural.</span></li>
                    <li><span>Ajo en polvo</span><span>4.27%</span><span>Notas terrosas.</span></li>
                    <li><span>Cebolla en polvo</span><span>4.27%</span><span>Dulzura y cuerpo.</span></li>
                    <li><span>Paprika</span><span>2.56%</span><span>Color y humo sutil.</span></li>
                    <li><span>Pimienta negra</span><span>1.28%</span><span>Calidez equilibrada.</span></li>
                    <li><span>Chile en polvo</span><span>1.28%</span><span>Carácter mexicano.</span></li>
                    <li><span>Hierbas finas</span><span>0.85%</span><span>Complejidad aromática.</span></li>
                </ul>
                <div class="ingredient-note">Contenido neto: 117 g · 8 ingredientes puros sin aditivos</div>
            `,
            showSeal: false,
            showCTA: false
        },
        {
            threshold: 0.56,
            title: "Versatilidad <span style='color: var(--accent-gold)'>Absoluta</span>",
            subtitle: "",
            htmlContent: `
                <div class="tag-pill-container">
                    <div class="tag-pill">Carnes</div>
                    <div class="tag-pill">Mariscos</div>
                    <div class="tag-pill">Verduras</div>
                    <div class="tag-pill">Sopas</div>
                    <div class="tag-pill">Botanas</div>
                    <div class="tag-pill">Fruta fresca</div>
                </div>
            `,
            showSeal: false,
            showCTA: false
        },
        {
            threshold: 0.70,
            title: "Información <span style='color: var(--accent-gold)'>Nutrimental</span>",
            subtitle: "",
            htmlContent: `
                <table class="nutrition-table">
                    <tr><td>Contenido Neto:</td><td>117 g</td></tr>
                    <tr><td>Energía por 100g:</td><td>180 kcal</td></tr>
                    <tr><td>Proteínas:</td><td>30 g</td></tr>
                    <tr><td>Grasas totales:</td><td>3 g</td></tr>
                    <tr><td>Grasas saturadas:</td><td>0.4 g</td></tr>
                    <tr><td>Carbohidratos:</td><td>9.9 g</td></tr>
                    <tr><td>Azúcares:</td><td>0.8 g</td></tr>
                    <tr><td>Fibra dietética:</td><td>3 g</td></tr>
                    <tr><td>Sodio:</td><td>13,800 mg</td></tr>
                </table>
                <div class="ingredient-note" style="color: var(--accent-red); margin-top:0;">CONTIENE CAMARÓN/MARISCOS</div>
            `,
            showSeal: true,
            showCTA: false
        },
        {
            threshold: 0.85,
            title: "Saz<span style='color: var(--accent-gold)'>u</span>mami",
            subtitle: "SAZÓN DE MAR",
            htmlContent: `
                <p style="text-align: center; margin-bottom: 20px;">Consérvese en lugar fresco y seco.</p>
                <div class="footer-text">Hecho en México. Todos los derechos reservados.</div>
            `,
            showSeal: false,
            showCTA: true
        }
    ];

    let currentStage = -1;

    // === Preloader de Imágenes ===
    body.classList.add("loading");
    let loadedImages = 0;

    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = imagePath(i);
        
        img.onload = () => {
            loadedImages++;
            const progress = (loadedImages / frameCount) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.innerText = `${Math.floor(progress)}%`;

            if (loadedImages === frameCount) {
                initExperience();
            }
        };

        // Si hay error en un frame, lo contamos igual para no bloquear todo
        img.onerror = () => {
            loadedImages++;
            console.error(`Error cargando el frame ${i}`);
            if (loadedImages === frameCount) initExperience();
        };

        images.push(img);
    }

    // === Inicializar Experiencia ===
    function initExperience() {
        // Desvanecer preloader
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
            body.classList.remove("loading");
            // Setear el texto inicial sin animación
            updateUI(0);
        }, 800);

        // Configurar Canvas
        resizeCanvas();
        
        let resizeTimeout;
        window.addEventListener("resize", () => {
            // Debounce the resize event to prevent lag while the address bar is hiding
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                // Forzar redibujado
                lastRenderedFrame = -1;
            }, 100);
        });

        // Dibujar primer frame
        requestAnimationFrame(() => renderFrame(0));

        // Setup Scroll Listener con { passive: true } para rendimiento móvil
        window.addEventListener("scroll", handleScroll, { passive: true });
        
        // Ejecutar por si el usuario recarga la página a la mitad del scroll
        handleScroll();

        // Iniciar el bucle de animación para el Mouse Parallax
        requestAnimationFrame(animationLoop);
    }

    // === Lógica de Mouse Parallax y Cursor ===
    function animationLoop() {
        // Interpolación lineal (lerp) para suavidad
        parallaxX += (mouseX - parallaxX) * 0.08;
        parallaxY += (mouseY - parallaxY) * 0.08;
        
        cursorActualX += (cursorTargetX - cursorActualX) * 0.3;
        cursorActualY += (cursorTargetY - cursorActualY) * 0.3;

        // Aplicar transformaciones al cursor
        if (customCursor) {
            customCursor.style.setProperty('--cx', `${cursorActualX}px`);
            customCursor.style.setProperty('--cy', `${cursorActualY}px`);
        }

        // Aplicar transformaciones (movimiento opuesto al ratón para efecto 3D)
        if (contentContainer) {
            contentContainer.style.transform = `translate(${parallaxX * -15}px, ${parallaxY * -15}px)`;
        }
        if (brandLogo) {
            brandLogo.style.transform = `translate(${parallaxX * -6}px, ${parallaxY * -6}px)`;
        }

        // Lerp para Botón Magnético
        ctaActualX += (ctaTargetX - ctaActualX) * 0.15;
        ctaActualY += (ctaTargetY - ctaActualY) * 0.15;
        ctaActualScale += (ctaTargetScale - ctaActualScale) * 0.15;

        // Aplicar física magnética al botón (solo si está visible)
        if (ctaButton && !ctaButton.classList.contains("hidden")) {
            ctaButton.style.transform = `translate(${ctaActualX}px, ${ctaActualY}px) scale(${ctaActualScale})`;
        }

        // === Lerp de Frames (Scroll Suave como Mantequilla) ===
        currentFrame += (targetFrame - currentFrame) * 0.12;
        const frameToRender = Math.round(currentFrame);
        if (frameToRender !== lastRenderedFrame) {
            lastRenderedFrame = frameToRender;
            renderFrame(frameToRender);
        }

        requestAnimationFrame(animationLoop);
    }

    // === Lógica del Canvas (Emular Object-Fit: Cover + Retina DPR) ===
    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Resolución interna alta (Retina) con tamaño visual normal
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.scale(dpr, dpr);
        
        // Redibujar el frame actual al cambiar el tamaño de ventana
        const currentScrollPercent = getScrollProgress();
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(currentScrollPercent * frameCount)
        );
        renderFrame(frameIndex);
    }

    function renderFrame(index) {
        if (!images[index] || !images[index].complete) return;
        
        const img = images[index];
        // Usar dimensiones visuales (no las internas de Retina)
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Matemáticas para object-fit: contain (evita recortes y estiramientos)
        const scale = Math.min(cw / iw, ch / ih);
        const x = (cw / 2) - (iw / 2) * scale;
        const y = (ch / 2) - (ih / 2) * scale;

        // Limpiar lienzo y dibujar (en coordenadas visuales, el DPR ya lo maneja ctx.scale)
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, iw * scale, ih * scale);
    }

    // === Lógica de Scroll y Sincronización de UI ===
    function getScrollProgress() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        return maxScroll > 0 ? scrollTop / maxScroll : 0;
    }

    function handleScroll() {
        const scrollPercent = getScrollProgress();
        
        // Ocultar el indicador de scroll después del 5%
        if (scrollPercent > 0.05) {
            scrollIndicator.style.opacity = "0";
        } else {
            scrollIndicator.style.opacity = "1";
        }

        // Calcular frame objetivo (el Lerp en animationLoop se encarga de suavizar)
        targetFrame = Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(scrollPercent * (frameCount - 1)))
        );

        // Determinar etapa actual
        let newStage = 0;
        for (let i = stages.length - 1; i >= 0; i--) {
            if (scrollPercent >= stages[i].threshold) {
                newStage = i;
                break;
            }
        }

        // Actualizar UI si cambió la etapa
        if (newStage !== currentStage) {
            updateUI(newStage);
        }
    }

    function updateUI(stageIndex) {
        currentStage = stageIndex;
        const stageData = stages[stageIndex];

        // Animar salida
        contentContainer.classList.add("fade-out");

        setTimeout(() => {
            // Actualizar contenido
            titleEl.innerHTML = stageData.title;
            subtitleEl.innerText = stageData.subtitle;
            descriptionEl.innerHTML = stageData.htmlContent;

            // Mostrar/Ocultar Sello Regulatorio
            if (stageData.showSeal) {
                regulatorySeal.classList.remove("hidden");
            } else {
                regulatorySeal.classList.add("hidden");
            }

            // Mostrar/Ocultar Botón CTA
            if (stageData.showCTA) {
                ctaButton.classList.remove("hidden");
            } else {
                ctaButton.classList.add("hidden");
            }

            // Re-asignar eventos de hover a tag-pills dinámicos
            const interactiveEls = descriptionEl.querySelectorAll('.tag-pill');
            if (customCursor) {
                interactiveEls.forEach(el => {
                    el.addEventListener("mouseenter", () => customCursor.classList.add("hovering"));
                    el.addEventListener("mouseleave", () => customCursor.classList.remove("hovering"));
                });
            }

            // Animar entrada
            contentContainer.classList.remove("fade-out");
        }, 400); // 400ms coincide con la transición CSS
    }
});
