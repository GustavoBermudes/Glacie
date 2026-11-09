// Pesquisa: abre o modal de busca e filtra os produtos do JSON enquanto a pessoa digita
import { createProductCard } from './utils.js';

export function initSearch() {
    // Botões que abrem a pesquisa (link do header e item do menu)
    const pesquisaTriggers = document.querySelectorAll('a[href="#pesquisa"], #pesquisa-btn-menu');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const resultsGrid = document.getElementById('search-results-grid');

    // Lista com todos os produtos (preenchida quando o JSON carregar)
    let allProducts = [];

     const isGitHubPages = window.location.hostname.includes('github.io');
        let jsonUrl = 'json/catalog.json';
        if (isGitHubPages) {
            jsonUrl = '/Glacie/json/catalog.json';
        }

    fetch(jsonUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            allProducts = data.glacie_catalog || [];
        })
        .catch(function (error) {
            console.error('Erro ao carregar produtos para a busca:', error);
        });

    // Abrir a pesquisa
    pesquisaTriggers.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Fecha o menu lateral
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu) dropdownMenu.classList.remove('active');

            if (searchModal) {
                searchModal.classList.add('active');

                // Limpa o campo de busca e coloca o cursor nele
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }

                // Mostra o texto inicial
                if (resultsGrid) {
                    resultsGrid.innerHTML = '<p class="search-placeholder-text">Digite algo para começar a buscar...</p>';
                }
            }
        });
    });

    // Botão de fechar
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', function () {
            if (searchModal) searchModal.classList.remove('active');
        });
    }

    // A cada letra digitada, filtra os produtos pelo nome ou categoria
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const query = e.target.value.toLowerCase().trim();

            // Campo vazio: volta ao texto inicial
            if (query === '') {
                resultsGrid.innerHTML = '<p class="search-placeholder-text">Digite algo para começar a buscar...</p>';
                return;
            }

            // Guarda só os produtos que contêm o texto digitado
            const filtered = [];
            for (let i = 0; i < allProducts.length; i++) {
                const product = allProducts[i];
                if (product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)) {
                    filtered.push(product);
                }
            }

            renderSearchResults(filtered);
        });
    }

    // Mostra os produtos encontrados no grid de resultados
    function renderSearchResults(products) {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = '';

        if (products.length === 0) {
            resultsGrid.innerHTML = '<p class="search-placeholder-text">Nenhum produto encontrado.</p>';
            return;
        }

        products.forEach(function (product) {
            // Depois de adicionar ao carrinho, fecha a pesquisa
            const productCard = createProductCard(product, function () {
                if (searchModal) searchModal.classList.remove('active');
            });
            resultsGrid.appendChild(productCard);
        });
    }
}
