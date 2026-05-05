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

    // === Configuración de Animación ===
    const frameCount = 240;
    const images = [];
    const imagePath = (index) => `sequence/ezgif-frame-${index.toString().padStart(3, '0')}.png`;
    
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
            htmlContent: "Una mezcla artesanal nacida de la necesidad de llevar el auténtico y profundo sabor del mar directamente a tu mesa.",
            showSeal: false,
            showCTA: false
        },
        {
            threshold: 0.28,
            title: "Nuestra <span style='color: var(--accent-gold)'>Receta</span>",
            subtitle: "",
            htmlContent: `
                <p>El perfil umami marino se define por nuestro ingrediente dominante:</p>
                <span class="highlight-text">Camarón seco molido (53.42%)</span>
                <p style="font-size: 0.85rem; opacity: 0.8;">Sal de mesa (32.05%), Ajo, Cebolla, Paprika, Pimienta, Chile y Hierbas finas secas.</p>
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
        window.addEventListener("resize", resizeCanvas);

        // Dibujar primer frame
        requestAnimationFrame(() => renderFrame(0));

        // Configurar Scroll
        window.addEventListener("scroll", handleScroll);
        
        // Ejecutar por si el usuario recarga la página a la mitad del scroll
        handleScroll();
    }

    // === Lógica del Canvas (Emular Object-Fit: Cover) ===
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
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
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        // Matemáticas para object-fit: cover
        const scale = Math.max(cw / iw, ch / ih);
        const x = (cw / 2) - (iw / 2) * scale;
        const y = (ch / 2) - (ih / 2) * scale;

        // Limpiar lienzo y dibujar
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

        // Calcular frame basado en scroll
        const frameIndex = Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(scrollPercent * (frameCount - 1)))
        );
        
        requestAnimationFrame(() => renderFrame(frameIndex));

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

            // Animar entrada
            contentContainer.classList.remove("fade-out");
        }, 400); // 400ms coincide con la transición CSS
    }
});
