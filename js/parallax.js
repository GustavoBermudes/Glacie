// Efeitos de rolagem da página: parallax da section2, troca dos óculos da section3 e footer.

// =====================================================
// 1) PARALLAX DA SECTION2 (imagens de mulheres e homens)
// =====================================================
// Conforme a pessoa rola a página, as duas imagens entram na tela
// (uma vinda de cima e outra de baixo) e ficam visíveis aos poucos.
export function initParallax() {
    const section = document.getElementById('section2');
    if (!section) return;

    const womanBox = section.querySelector('.woman_intersect');
    const menBox = section.querySelector('.men_intersect');

    // Evita rodar o cálculo muitas vezes seguidas durante a rolagem
    let ticking = false;

    // Calcula o progresso (p) de 0 a 1 e aplica nas duas imagens
    function update() {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.6;
        const total = (section.offsetHeight - vh) * 0.6;

        // p = quanto da animação já aconteceu (0 = começo, 1 = fim)
        let p = (start - rect.top) / (total + start);
        p = Math.min(1, Math.max(0, p));

        // Suaviza o movimento (começa e termina mais devagar)
        p = p * p * (3 - 2 * p);
        p = Number(p.toFixed(4));

        // Mulheres: vem de cima (-110vh) até a posição final
        womanBox.style.opacity = p;
        womanBox.style.transform = 'translateY(' + ((1 - p) * -110) + 'vh) rotateY(-22deg) rotateZ(-3deg)';

        // Homens: vem de baixo (110vh) até a posição final
        menBox.style.opacity = p;
        menBox.style.transform = 'translateY(' + ((1 - p) * 110) + 'vh) rotateY(22deg) rotateZ(2deg)';

        ticking = false;
    }

    // Roda o update no próximo quadro da tela, só uma vez por vez
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    update(); // ajusta já na abertura da página
}

// =====================================================
// PROGRESSO DA SECTION3 (usado pelos óculos e pelo footer)
// =====================================================
// Mantém um número dentro do intervalo de 0 a 1
function clamp(value) {
    return Math.max(0, Math.min(1, value));
}

// Devolve quanto da section3 já foi rolado: 0 = início, 1 = fim
function getSection3Progress(section) {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;

    if (scrollable > 0) {
        return clamp(-rect.top / scrollable);
    }
    return 0;
}

// =====================================================
// 2) TROCA DOS TRÊS ÓCULOS (section3)
// =====================================================
// Durante a rolagem, mostra um óculos por vez (com seu texto)
function initGlasses() {
    const section = document.querySelector('.section3');
    if (!section) return;

    // As três imagens e os três textos
    const glasses = [
        document.querySelector('.glasses1'),
        document.querySelector('.glasses2'),
        document.querySelector('.glasses3')
    ];

    const texts = [
        document.querySelector('.text1'),
        document.querySelector('.text2'),
        document.querySelector('.text3')
    ];

    // Pontos da rolagem em que troca de óculos (25% e 40%)
    const TRIGGERS = [0.25, 0.40];

    // Duração e tipo de movimento da animação
    const DURATION = '0.9s';
    const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

    // Qual óculos está aparecendo agora (-1 = nenhum ainda)
    let currentIndex = -1;

    // Liga ou desliga a animação suave
    function setTransitions(enabled) {
        const allElements = glasses.concat(texts);
        allElements.forEach(function (element) {
            if (enabled) {
                element.style.transition = 'transform ' + DURATION + ' ' + EASING + ', opacity ' + DURATION + ' ease';
            } else {
                element.style.transition = 'none';
            }
        });
    }

    // Mostra o óculos e o texto de número "activeIndex" e esconde os outros
    function showSlide(activeIndex) {
        glasses.forEach(function (element, index) {
            // Os anteriores saem para a esquerda, os próximos esperam à direita
            let x = 0;
            if (index < activeIndex) x = -120;
            if (index > activeIndex) x = 120;

            element.style.transform = 'translate3d(' + x + '%, 0, 0)';

            if (index === activeIndex) {
                element.style.opacity = '1';
            } else {
                element.style.opacity = '0';
            }
        });

        texts.forEach(function (text, index) {
            if (index === activeIndex) {
                text.style.opacity = '1';
                text.style.transform = 'translate3d(0, 0, 0)';
            } else {
                text.style.opacity = '0';
                text.style.transform = 'translate3d(20px, 0, 0)';
            }
        });
    }

    // Descobre qual óculos deve aparecer, de acordo com a rolagem
    function getIndex() {
        const progress = getSection3Progress(section);

        if (progress >= TRIGGERS[1]) return 2;
        if (progress >= TRIGGERS[0]) return 1;
        return 0;
    }

    // Só atualiza se o óculos mudou
    function update() {
        const index = getIndex();
        if (index === currentIndex) return;

        currentIndex = index;
        showSlide(index);
    }

    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    // Posiciona tudo sem animação na abertura...
    setTransitions(false);
    update();

    // ...e só liga a animação depois que a página já desenhou
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            setTransitions(true);
        });
    });
}

// =====================================================
// 3) FOOTER QUE SOBE POR CIMA DA TELA
// =====================================================
// Quando chega ao fim da section3 rolando para baixo, o footer sobe.
// Rolando para cima, ele desce de novo.
function initFooter() {
    const section = document.querySelector('.section3');
    const footer = document.getElementById('footer');
    const header = document.querySelector('header');
    if (!section || !footer) return;

    // Ponto da rolagem (75%) a partir do qual o footer pode abrir
    const FOOTER_TRIGGER = 0.75;

    // null = ainda não decidiu | true = aberto | false = fechado
    let isOpen = null;

    // Posição anterior da rolagem (para saber se está descendo ou subindo)
    let lastY = window.scrollY;

    function update() {
        const y = window.scrollY;
        const delta = y - lastY; // positivo = descendo, negativo = subindo
        lastY = y;

        let open = (isOpen === true);

        if (getSection3Progress(section) < FOOTER_TRIGGER) {
            open = false;      // ainda não chegou perto do fim
        } else if (delta > 2) {
            open = true;       // descendo: abre
        } else if (delta < -2) {
            open = false;      // subindo: fecha
        } else if (isOpen === null) {
            open = true;       // primeira vez, sem rolar: abre
        }

        // Nada mudou: não faz nada
        if (open === isOpen) return;
        isOpen = open;

        // Mostra/esconde o footer, escurece a section3 e deixa o header escuro
        footer.classList.toggle('show', open);
        document.body.classList.toggle('footer-open', open);
        if (header) header.classList.toggle('on-light', open);
    }

    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
}

// Estas duas partes começam sozinhas quando o arquivo carrega
initGlasses();
initFooter();
