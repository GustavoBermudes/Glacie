// Funções que são usadas em vários arquivos do projeto.

// ---------- Alerta personalizado ----------
// Mostra uma caixinha com a mensagem (no lugar do alert() do navegador)
export function showAlert(message) {
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    if (alertMessage && customAlert) {
        alertMessage.textContent = message;
        customAlert.classList.add('active');

        // Liga o botão OK só uma vez (a marca fica guardada no próprio botão)
        if (alertOkBtn && !alertOkBtn.dataset.listenerAttached) {
            alertOkBtn.dataset.listenerAttached = 'true';
            alertOkBtn.addEventListener('click', function () {
                customAlert.classList.remove('active');
            });
        }
    }
}

// ---------- Formatação de preço ----------
// Transforma 129.9 em "R$ 129,90"
export function formatPrice(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ---------- Carrinho (guardado no localStorage) ----------
// Lê a lista de itens do carrinho (ou lista vazia se não existir)
export function getCart() {
    return JSON.parse(localStorage.getItem('glacie_cart')) || [];
}

// Salva a lista de itens do carrinho
export function saveCart(cart) {
    localStorage.setItem('glacie_cart', JSON.stringify(cart));
}

// Atualiza o número "carrinho (X)" no header e no menu
export function updateCartCount() {
    const cart = getCart();

    // Soma a quantidade de todos os itens
    let totalItems = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
    }

    // Link "carrinho (X)" do header (o ".links >" garante que não pega o item do menu lateral)
    const carrinhoLink = document.querySelector('.links > a[href="#carrinho"]');
    if (carrinhoLink) {
        carrinhoLink.textContent = 'carrinho (' + totalItems + ')';
    }

    const carrinhoBtnMenu = document.getElementById('carrinho-btn-menu');
    if (carrinhoBtnMenu) {
        carrinhoBtnMenu.textContent = 'CARRINHO (' + totalItems + ')';
    }
}

// ---------- Cartão de produto ----------
// Cria o cartão de um produto (foto, nome, preço, tamanhos e botão de comprar).
// É usado tanto no catálogo quanto na pesquisa.
// "afterAdd" é opcional: uma função extra para rodar depois de adicionar ao carrinho.
export function createProductCard(product, afterAdd) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    // Monta os botões de tamanho (P, M, G...)
    let sizesHTML = '';
    for (let i = 0; i < product.sizes.length; i++) {
        const size = product.sizes[i];
        sizesHTML += '<button type="button" class="size-btn" data-size="' + size + '">' + size + '</button>';
    }

    productCard.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)}</p>
            <div class="product-sizes">
                <span style="font-size: 0.85rem; color: #666;">Tam:</span> ${sizesHTML}
            </div>
            <button class="btn-buy" data-id="${product.id}">Adicionar à Sacola</button>
        </div>
    `;

    const sizeButtons = productCard.querySelectorAll('.size-btn');
    let selectedSize = null; // nenhum tamanho escolhido ainda

    // Clicar em um tamanho: marca ele e desmarca os outros
    sizeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            sizeButtons.forEach(function (b) {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            selectedSize = btn.getAttribute('data-size');
        });
    });

    // Clicar em "Adicionar à Sacola"
    const buyBtn = productCard.querySelector('.btn-buy');
    buyBtn.addEventListener('click', function () {
        // Precisa escolher um tamanho antes
        if (!selectedSize) {
            showAlert('Por favor, selecione um tamanho antes de adicionar à sacola.');
            return;
        }

        // Item que vai para o carrinho (o cartId diferencia o mesmo produto em tamanhos diferentes)
        const cartItem = {
            cartId: product.id + '-' + selectedSize,
            id: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            image: product.image,
            quantity: 1
        };

        const cart = getCart();

        // Se o mesmo produto/tamanho já está no carrinho, só aumenta a quantidade
        let existingIndex = -1;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].cartId === cartItem.cartId) {
                existingIndex = i;
            }
        }

        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        saveCart(cart);

        // Limpa a seleção de tamanho do cartão
        sizeButtons.forEach(function (b) {
            b.classList.remove('selected');
        });
        selectedSize = null;

        updateCartCount();
        showAlert('"' + product.name + '" (Tam: ' + cartItem.size + ') foi adicionado à sacola!');

        if (afterAdd) afterAdd();
    });

    return productCard;
}
