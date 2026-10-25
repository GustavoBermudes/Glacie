import { updateCartCount } from './utils.js';

export function initCart() {
    const carrinhoTriggers = document.querySelectorAll('#carrinho-btn-menu, a[href="#carrinho"]');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('cart-total-price');
    const btnCheckout = document.getElementById('btn-checkout');

    updateCartCount();

    carrinhoTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const menuLateral = document.querySelector('.menu-lateral') || document.querySelector('.dropdown-menu');
            if (menuLateral) menuLateral.classList.remove('active');

            renderCartItems();
            if (cartModal) cartModal.classList.add('active');
        });
    });

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartModal) cartModal.classList.remove('active');
        });
    }

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

    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
            if (cart.length === 0) {
                alert('Sua sacola está vazia!');
                return;
            }

            if (cartModal) cartModal.classList.remove('active');

            const checkoutModal = document.getElementById('checkout-modal');
            if (checkoutModal) {
                checkoutModal.classList.add('active');
                
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shipping = 8.90;
                const total = subtotal + shipping;

                const subtotalEl = document.getElementById('checkout-subtotal');
                const totalEl = document.getElementById('checkout-total');
                
                if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                if (totalEl) totalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }
        });
    }
}