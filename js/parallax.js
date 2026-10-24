<<<<<<< HEAD
/* Parallax da section2 */
export function initParallax() {
=======
export function initParallax () {
>>>>>>> babbb4fc884ea5c83d1118b80ada178816afb6b9
    const section = document.getElementById('section2');
    if (!section) return;
    const stage = section.querySelector('.stage');
    let ticking = false;

    function update() {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.6;
        const total = (section.offsetHeight - vh) * 0.6;
        let p = (start - rect.top) / (total + start);
        p = Math.min(1, Math.max(0, p));
        p = p * p * (3 - 2 * p);
        stage.style.setProperty('--p', p.toFixed(4));
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
<<<<<<< HEAD
}

/* Progresso da rolagem da section3 */
function clamp(value) {
    return Math.max(0, Math.min(1, value));
}

function getSection3Progress(section) {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;

    return scrollable > 0
        ? clamp(-rect.top / scrollable)
        : 0;
}

/* Troca dos três óculos (section3) */
let glassesStarted = false;

export function initGlasses() {
    if (glassesStarted) return;
    glassesStarted = true;

    const section = document.querySelector(".section3");
    if (!section) return;

    const glasses = [
        document.querySelector(".glasses1"),
        document.querySelector(".glasses2"),
        document.querySelector(".glasses3")
    ];

    const texts = [
        document.querySelector(".text1"),
        document.querySelector(".text2"),
        document.querySelector(".text3")
    ];

    const TRIGGERS = [0.25, 0.50];
    const DURATION = "0.9s";
    const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

    let currentIndex = -1;

    function setTransitions(enabled) {
        glasses.concat(texts).forEach((element) => {
            element.style.transition = enabled
                ? `transform ${DURATION} ${EASING}, opacity ${DURATION} ease`
                : "none";
        });
    }

    function showSlide(activeIndex) {
        glasses.forEach((element, index) => {
            const x = index < activeIndex ? -120
                    : index > activeIndex ? 120
                    : 0;

            element.style.transform = `translate3d(${x}%, 0, 0)`;
            element.style.opacity = index === activeIndex ? "1" : "0";
        });

        texts.forEach((text, index) => {
            const active = index === activeIndex;

            text.style.opacity = active ? "1" : "0";
            text.style.transform = active
                ? "translate3d(0, 0, 0)"
                : "translate3d(20px, 0, 0)";
        });
    }

    function getIndex() {
        const progress = getSection3Progress(section);

        if (progress >= TRIGGERS[1]) return 2;
        if (progress >= TRIGGERS[0]) return 1;
        return 0;
    }

    function update() {
        const index = getIndex();

        if (index === currentIndex) return;

        currentIndex = index;
        showSlide(index);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    setTransitions(false);
    update();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitions(true));
    });
}

/* Footer que sobe por cima da tela */
let footerStarted = false;

export function initFooter() {
    if (footerStarted) return;
    footerStarted = true;

    const section = document.querySelector(".section3");
    const footer = document.getElementById("footer");
    const header = document.querySelector("header");
    if (!section || !footer) return;

    const FOOTER_TRIGGER = 0.75;

    let isOpen = null;
    let lastY = window.scrollY;

    function update() {
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;

        let open = isOpen === true;

        if (getSection3Progress(section) < FOOTER_TRIGGER) open = false;
        else if (delta > 2) open = true;
        else if (delta < -2) open = false;
        else if (isOpen === null) open = true;

        if (open === isOpen) return;
        isOpen = open;

        footer.classList.toggle("show", open);
        document.body.classList.toggle("footer-open", open);
        if (header) header.classList.toggle("on-light", open);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
}

/* Inicialização automática */
initGlasses();
initFooter();
=======
}
>>>>>>> babbb4fc884ea5c83d1118b80ada178816afb6b9
