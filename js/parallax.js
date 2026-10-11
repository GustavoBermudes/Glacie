export function initParallax () {
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
}