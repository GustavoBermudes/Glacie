// cart.js
import { updateCartCount } from './utils.js';

export function initCart() {
    const carrinhoBtn = document.getElementById('carrinho-btn-menu');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('cart-total-price');
    const btnCheckout = document.getElementById('btn-checkout');

    // Inicializa o número do carrinho ao carregar a página
    updateCartCount();

    // Abrir modal do carrinho
    if (carrinhoBtn) {
        carrinhoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Fecha o menu lateral se estiver aberto
            const menuLateral = document.querySelector('.menu-lateral') || document.querySelector('.nav-menu');
            if (menuLateral) menuLateral.classList.remove('active');

            renderCartItems();
            if (cartModal) cartModal.classList.add('active');
        });
    }

    // Fechar modal do carrinho
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartModal) cartModal.classList.remove('active');
        });
    }

    // Função para renderizar os itens dentro do modal
    function renderCartItems() {
        if (!container) return;

        let cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
        container.innerHTML = '';

        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Sua sacola está vazia.</p>';
            if (totalPriceEl) totalPriceEl.textContent = 'R$ 0,00';
            return;
        }

        let totalGeneral = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalGeneral += itemTotal;

            const formattedPrice = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Tam: <strong>${item.size}</strong> | ${formattedPrice}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}">🗑️</button>
            `;
            container.appendChild(cartItemEl);
        });

        if (totalPriceEl) {
            totalPriceEl.textContent = totalGeneral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }

    // Ações de aumentar, diminuir e remover itens do carrinho
    if (container) {
        container.addEventListener('click', (e) => {
            let cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
            const index = e.target.getAttribute('data-index');

            if (index === null) return;

            if (e.target.classList.contains('increase')) {
                cart[index].quantity += 1;
            } else if (e.target.classList.contains('decrease')) {
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            } else if (e.target.classList.contains('cart-item-remove')) {
                cart.splice(index, 1);
            }

            localStorage.setItem('glacie_cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        });
    }

    // Botão de finalizar compra
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
            if (cart.length === 0) {
                alert('Sua sacola está vazia!');
                return;
            }
            alert('Compra finalizada com sucesso! Obrigado por comprar na Glacie.');
            localStorage.removeItem('glacie_cart');
            updateCartCount();
            renderCartItems();
            if (cartModal) cartModal.classList.remove('active');
        });
    }
}