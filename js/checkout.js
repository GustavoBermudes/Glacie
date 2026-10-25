import { showAlert, updateCartCount } from './utils.js';

export function initCheckout() {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout');
    const btnCheckout = document.getElementById('btn-checkout');
    const checkoutForm = document.getElementById('checkout-form');

    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const creditCardFields = document.getElementById('credit-card-fields');
    const pixFields = document.getElementById('pix-fields');
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const cpfInput = document.getElementById('payer-cpf');
    const nameInput = document.getElementById('payer-name');

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2-$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,})/, '$1.$2');
            }
            e.target.value = value;
        });
    }

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'pix') {
                creditCardFields.style.display = 'none';
                pixFields.style.display = 'block';
            } else {
                creditCardFields.style.display = 'block';
                pixFields.style.display = 'none';
            }
        });
    });

    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
            if (cart.length === 0) {
                showAlert('Sua sacola está vazia!');
                return;
            }

            const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
            if (loggedUser) {
                if (nameInput && loggedUser.name) nameInput.value = loggedUser.name;
            }

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 8.90;
            const total = subtotal + shipping;

            if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            if (totalEl) totalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            renderCheckoutAddress(loggedUser);

            if (cartModal) cartModal.classList.remove('active');
            if (checkoutModal) checkoutModal.classList.add('active');
        });
    }

    function renderCheckoutAddress(user) {
        let addressContainer = document.getElementById('checkout-address-summary');
        if (!addressContainer) {
            addressContainer = document.createElement('div');
            addressContainer.id = 'checkout-address-summary';
            addressContainer.style.cssText = 'background: #f1f1f1; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.85rem;';
            const paymentGroup = document.querySelector('#checkout-form .input-group');
            if (paymentGroup) paymentGroup.parentNode.insertBefore(addressContainer, paymentGroup);
        }

        if (user && user.address && user.address.cep) {
            const addr = user.address;
            addressContainer.innerHTML = `
                <strong>Endereço de Entrega:</strong><br>
                ${addr.logradouro}, nº ${addr.numero} ${addr.complemento ? '(' + addr.complemento + ')' : ''} - ${addr.bairro}, ${addr.cidade} / ${addr.estado} - CEP: ${addr.cep}
            `;
        } else {
            addressContainer.innerHTML = `<strong>Endereço de Entrega:</strong> <span style="color: #c00;">Nenhum endereço cadastrado no perfil. Recomendamos preencher na aba "Endereço" do seu perfil.</span>`;
        }
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('active');
        });
    }

    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cpfClean = cpfInput.value;
            if (!isValidCPF(cpfClean)) {
                showAlert('CPF inválido. Por favor, verifique os números digitados.');
                return;
            }

            const cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + 8.90;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

            const newOrder = {
                id: 'GLC-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString('pt-BR'),
                items: cart,
                subtotal: subtotal,
                shipping: 8.90,
                total: total,
                paymentMethod: paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Pix',
                status: 'Aprovado'
            };

            const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
            let allOrders = JSON.parse(localStorage.getItem('glacie_orders')) || [];
            
            allOrders.push({
                userEmail: loggedUser ? loggedUser.email : 'convidado',
                ...newOrder
            });

            localStorage.setItem('glacie_orders', JSON.stringify(allOrders));

            localStorage.removeItem('glacie_cart');
            updateCartCount();

            checkoutModal.classList.remove('active');
            checkoutForm.reset();
            
            showAlert('Pedido realizado com sucesso! Acompanhe na aba Pedidos em Minha Conta.');
        });
    }
}