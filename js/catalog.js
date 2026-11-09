// Catálogo de produtos (homens e mulheres), carregado do arquivo json/catalog.json
import { createProductCard } from './utils.js';

export function initCatalog() {
    const menGrid = document.getElementById('men-grid');
    const womenGrid = document.getElementById('women-grid');

    const menSection = document.getElementById('men-section');
    const womenSection = document.getElementById('women-section');

    // Todos os links/botões que abrem cada catálogo (seção "descobrir" e menu lateral)
    const descobrirMulheresBtns = document.querySelectorAll('a[href="#catalogo-mulheres"], #catalogo-mulheres-menu-btn');
    const descobrirHomensBtns = document.querySelectorAll('a[href="#catalogo-homens"], #catalogo-homens-menu-btn');

    // Para carregar o JSON só na primeira vez que abrir o catálogo
    let catalogLoaded = false;

    // Busca os produtos no JSON e coloca cada um no grid certo
    function loadCatalogData() {
        if (catalogLoaded) return;

        // No GitHub Pages o site fica dentro da pasta "/Glacie", então o caminho muda
        const isGitHubPages = window.location.hostname.includes('github.io');
        let jsonUrl = 'json/catalog.json';
        if (isGitHubPages) {
            jsonUrl = '/Glacie/json/catalog.json';
        }

        fetch(jsonUrl)
            .then(function (response) {
                if (!response.ok) throw new Error('Erro ao carregar o catálogo.');
                return response.json();
            })
            .then(function (data) {
                const products = data.glacie_catalog;

                // Limpa os grids antes de preencher
                if (menGrid) menGrid.innerHTML = '';
                if (womenGrid) womenGrid.innerHTML = '';

                // Cria um cartão para cada produto e coloca no grid do gênero dele
                products.forEach(function (product) {
                    const productCard = createProductCard(product);

                    if (product.gender === 'men' && menGrid) {
                        menGrid.appendChild(productCard);
                    } else if (product.gender === 'women' && womenGrid) {
                        womenGrid.appendChild(productCard);
                    }
                });

                catalogLoaded = true;
            })
            .catch(function (error) {
                console.error('Erro ao renderizar o catálogo:', error);
            });
    }

    // Abre o catálogo do gênero escolhido ('men' ou 'women')
    function openCatalog(targetGender) {
        loadCatalogData();

        // Fecha o menu lateral
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('active');
        }

        if (targetGender === 'men' && menSection) {
            menSection.classList.add('active');
            if (womenSection) womenSection.classList.remove('active');
        } else if (targetGender === 'women' && womenSection) {
            womenSection.classList.add('active');
            if (menSection) menSection.classList.remove('active');
        } else {
            // Qualquer outro valor: abre os dois
            if (menSection) menSection.classList.add('active');
            if (womenSection) womenSection.classList.add('active');
        }
    }

    // Tira a marca de "selecionado" de todos os botões de tamanho
    function resetSelectedSizes() {
        const allSizeButtons = document.querySelectorAll('.size-btn');
        allSizeButtons.forEach(function (btn) {
            btn.classList.remove('selected');
        });
    }

    // Botões de fechar cada catálogo
    const closeMenBtn = document.getElementById('close-men-catalog');
    const closeWomenBtn = document.getElementById('close-women-catalog');

    if (closeMenBtn) {
        closeMenBtn.addEventListener('click', function () {
            if (menSection) menSection.classList.remove('active');
            resetSelectedSizes();
        });
    }

    if (closeWomenBtn) {
        closeWomenBtn.addEventListener('click', function () {
            if (womenSection) womenSection.classList.remove('active');
            resetSelectedSizes();
        });
    }

    // Links que abrem o catálogo de mulheres
    descobrirMulheresBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openCatalog('women');
        });
    });

    // Links que abrem o catálogo de homens
    descobrirHomensBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openCatalog('men');
        });
    });
}
