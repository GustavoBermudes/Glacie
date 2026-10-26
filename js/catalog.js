
import { showAlert, updateCartCount } from './utils.js';

export function initCatalog() {
    const menGrid = document.getElementById('men-grid');
    const womenGrid = document.getElementById('women-grid');
    
    const menSection = document.getElementById('men-section');
    const womenSection = document.getElementById('women-section');

    const descobrirMulheresBtns = document.querySelectorAll('a[href="#catalogo-mulheres"], #catalogo-mulheres-menu-btn');
    const descobrirHomensBtns = document.querySelectorAll('a[href="#catalogo-homens"], #catalogo-homens-menu-btn');

    let catalogLoaded = false;

    function loadCatalogData() {
        if (catalogLoaded) return;

        const isGitHubPages = window.location.hostname.includes('github.io');
        const repoName = '/Glacie';

        const jsonUrl = isGitHubPages ? `${repoName}/json/catalog.json` : 'json/catalog.json';

        //fetch(jsonUrl)
        //.then(response => response.json())
        //.then(data => console.log(data));

        //fetch('json/catalog.json')
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar o catálogo.');
                return response.json();
            })
            .then(data => {
                const products = data.glacie_catalog;
                
                if (menGrid) menGrid.innerHTML = '';
                if (womenGrid) womenGrid.innerHTML = '';

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

                        sizeButtons.forEach(b => b.classList.remove('selected'));
                        selectedSize = null;

                        updateCartCount();

                        showAlert(`"${product.name}" (Tam: ${cartItem.size}) foi adicionado à sacola!`);
                    });

                    if (product.gender === 'men' && menGrid) {
                        menGrid.appendChild(productCard);
                    } else if (product.gender === 'women' && womenGrid) {
                        womenGrid.appendChild(productCard);
                    }
                });

                catalogLoaded = true;
            })
            .catch(error => {
                console.error('Erro ao renderizar o catálogo:', error);
            });
    }

    function openCatalog(targetGender) {
        loadCatalogData();

        const menuLateral = document.querySelector('.menu-lateral') || document.querySelector('.dropdown-menu');
        if (menuLateral) {
            menuLateral.classList.remove('active');
        }

        if (targetGender === 'men' && menSection) {
            menSection.classList.add('active');
            if (womenSection) womenSection.classList.remove('active');
        } else if (targetGender === 'women' && womenSection) {
            womenSection.classList.add('active');
            if (menSection) menSection.classList.remove('active');
        } else {
            if (menSection) menSection.classList.add('active');
            if (womenSection) womenSection.classList.add('active');
        }
    }

    const closeMenBtn = document.getElementById('close-men-catalog');
    const closeWomenBtn = document.getElementById('close-women-catalog');

    function resetSelectedSizes() {
        const allSizeButtons = document.querySelectorAll('.size-btn');
        allSizeButtons.forEach(btn => btn.classList.remove('selected'));
    }

    if (closeMenBtn) {
        closeMenBtn.addEventListener('click', () => {
            if (menSection) menSection.classList.remove('active');
            resetSelectedSizes();
        });
    }

    if (closeWomenBtn) {
        closeWomenBtn.addEventListener('click', () => {
            if (womenSection) womenSection.classList.remove('active');
            resetSelectedSizes();
        });
    }

    descobrirMulheresBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCatalog('women');
        });
    });

    descobrirHomensBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCatalog('men');
        });
    });
}
