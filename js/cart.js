// Carrinho (sacola): abre o modal, lista os itens e permite mudar quantidade / remover
import { updateCartCount, getCart, saveCart, formatPrice } from './utils.js';

export function initCart() {
    // Botões que abrem o carrinho (menu lateral e link do header)
    const carrinhoTriggers = document.querySelectorAll('#carrinho-btn-menu, a[href="#carrinho"]');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('cart-total-price');

    // Mostra o número certo de itens assim que a página abre
    updateCartCount();

    // Abrir o carrinho
    carrinhoTriggers.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Fecha o menu lateral
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu) dropdownMenu.classList.remove('active');

            renderCartItems();
            if (cartModal) cartModal.classList.add('active');
        });
    });

    // Fechar o carrinho
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function () {
            if (cartModal) cartModal.classList.remove('active');
        });
    }

    // Desenha a lista de itens do carrinho e o total
    function renderCartItems() {
        if (!container) return;

        const cart = getCart();
        container.innerHTML = '';

        // Carrinho vazio
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Sua sacola está vazia.</p>';
            if (totalPriceEl) totalPriceEl.textContent = 'R$ 0,00';
            return;
        }

        let totalGeneral = 0;

        // Cria uma linha para cada item
        for (let index = 0; index < cart.length; index++) {
            const item = cart[index];
            totalGeneral += item.price * item.quantity;

            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            // O data-index guarda a posição do item na lista (usado nos cliques abaixo)
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Tam: <strong>${item.size}</strong> | ${formatPrice(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}">🗑️</button>
            `;
            container.appendChild(cartItemEl);
        }

        if (totalPriceEl) {
            totalPriceEl.textContent = formatPrice(totalGeneral);
        }
    }

    // Cliques dentro da lista: botões "+", "-" e lixeira
    if (container) {
        container.addEventListener('click', function (e) {
            const cart = getCart();
            const index = e.target.getAttribute('data-index');

            // Clicou em algo que não é botão do item: ignora
            if (index === null) return;

            if (e.target.classList.contains('increase')) {
                // Aumenta a quantidade
                cart[index].quantity += 1;
            } else if (e.target.classList.contains('decrease')) {
                // Diminui a quantidade; se chegar a 0, remove o item
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            } else if (e.target.classList.contains('cart-item-remove')) {
                // Remove o item
                cart.splice(index, 1);
            }

            saveCart(cart);
            updateCartCount();
            renderCartItems();
        });
    }

    // O botão "Finalizar Compra" é tratado no checkout.js
}
