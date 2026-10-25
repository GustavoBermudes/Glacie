import { showAlert, updateCartCount } from './utils.js';

export function initSearch() {
    const pesquisaTriggers = document.querySelectorAll('a[href="#pesquisa"], #pesquisa-btn-menu');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const resultsGrid = document.getElementById('search-results-grid');

    let allProducts = [];

    fetch('../json/catalog.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data.glacie_catalog || [];
        })
        .catch(error => console.error('Erro ao carregar produtos para a busca:', error));

    pesquisaTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const menuLateral = document.querySelector('.menu-lateral') || document.querySelector('.dropdown-menu');
            if (menuLateral) menuLateral.classList.remove('active');

            if (searchModal) {
                searchModal.classList.add('active');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                if (resultsGrid) {
                    resultsGrid.innerHTML = '<p class="search-placeholder-text">Digite algo para começar a buscar...</p>';
                }
            }
        });
    });

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => {
            if (searchModal) searchModal.classList.remove('active');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === '') {
                resultsGrid.innerHTML = '<p class="search-placeholder-text">Digite algo para começar a buscar...</p>';
                return;
            }

            const filtered = allProducts.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.category.toLowerCase().includes(query)
            );

            renderSearchResults(filtered);
        });
    }

    function renderSearchResults(products) {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = '';

        if (products.length === 0) {
            resultsGrid.innerHTML = '<p class="search-placeholder-text">Nenhum produto encontrado.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const formattedPrice = product.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const sizesHTML = product.sizes.map(size => 
                `<button type="button" class="size-btn" data-size="${size}">${size}</button>`
            ).join('');

            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formattedPrice}</p>
                    <div class="product-sizes">
                        <span style="font-size: 0.85rem; color: #666;">Tam:</span> ${sizesHTML}
                    </div>
                    <button class="btn-buy" data-id="${product.id}">Adicionar à Sacola</button>
                </div>
            `;

            const sizeButtons = productCard.querySelectorAll('.size-btn');
            let selectedSize = null;

            sizeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    sizeButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedSize = btn.getAttribute('data-size');
                });
            });

            const buyBtn = productCard.querySelector('.btn-buy');
            buyBtn.addEventListener('click', () => {
                if (!selectedSize) {
                    showAlert('Por favor, selecione um tamanho antes de adicionar à sacola.');
                    return;
                }
                
                const cartItem = {
                    cartId: `${product.id}-${selectedSize}`,
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    size: selectedSize,
                    image: product.image,
                    quantity: 1
                };

                let cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
                const existingIndex = cart.findIndex(item => item.cartId === cartItem.cartId);
                
                if (existingIndex > -1) {
                    cart[existingIndex].quantity += 1;
                } else {
                    cart.push(cartItem);
                }

                localStorage.setItem('glacie_cart', JSON.stringify(cart));
                updateCartCount();
                showAlert(`"${product.name}" (Tam: ${cartItem.size}) foi adicionado à sacola!`);

                if (searchModal) searchModal.classList.remove('active');
            });

            resultsGrid.appendChild(productCard);
        });
    }
}