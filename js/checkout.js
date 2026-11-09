// Finalizar compra: resumo, endereço, forma de pagamento, validação de CPF e criação do pedido
import { showAlert, updateCartCount, getCart, formatPrice } from './utils.js';

// Valor fixo do frete
const SHIPPING = 8.90;

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
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');

    // Soma o preço x quantidade de todos os itens do carrinho
    function getSubtotal(cart) {
        let subtotal = 0;
        for (let i = 0; i < cart.length; i++) {
            subtotal += cart[i].price * cart[i].quantity;
        }
        return subtotal;
    }

    // ---------- Máscara do CPF (000.000.000-00) ----------
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            // Deixa só os números (máximo 11)
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            // Coloca os pontos e o traço conforme a quantidade de números
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

    // ---------- Máscara do número do cartão (0000 0000 0000 0000) ----------
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);

            // Coloca um espaço a cada 4 números
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // ---------- Máscara da validade do cartão (MM/AA) ----------
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);

            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{1,})/, '$1/$2');
            }
            e.target.value = value;
        });
    }

    // ---------- Troca entre Cartão de Crédito e Pix ----------
    paymentRadios.forEach(function (radio) {
        radio.addEventListener('change', function (e) {
            if (e.target.value === 'pix') {
                creditCardFields.style.display = 'none';
                pixFields.style.display = 'block';
            } else {
                creditCardFields.style.display = 'block';
                pixFields.style.display = 'none';
            }
        });
    });

    // ---------- Botão "Finalizar Compra" do carrinho ----------
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function () {
            const cart = getCart();
            if (cart.length === 0) {
                showAlert('Sua sacola está vazia!');
                return;
            }

            // Se tem usuário logado, já preenche o nome
            const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
            if (loggedUser) {
                if (nameInput && loggedUser.name) nameInput.value = loggedUser.name;
            }

            // Mostra subtotal e total (subtotal + frete)
            const subtotal = getSubtotal(cart);
            const total = subtotal + SHIPPING;

            if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
            if (totalEl) totalEl.textContent = formatPrice(total);

            renderCheckoutAddress(loggedUser);

            // Fecha o carrinho e abre o checkout
            if (cartModal) cartModal.classList.remove('active');
            if (checkoutModal) checkoutModal.classList.add('active');
        });
    }

    // Mostra no checkout o endereço de entrega salvo no perfil
    function renderCheckoutAddress(user) {
        // Cria a caixinha do endereço na primeira vez
        let addressContainer = document.getElementById('checkout-address-summary');
        if (!addressContainer) {
            addressContainer = document.createElement('div');
            addressContainer.id = 'checkout-address-summary';
            addressContainer.style.cssText = 'background: #f1f1f1; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.85rem;';

            // Coloca antes do primeiro campo do formulário
            const firstGroup = document.querySelector('#checkout-form .input-group');
            if (firstGroup) firstGroup.parentNode.insertBefore(addressContainer, firstGroup);
        }

        if (user && user.address && user.address.cep) {
            const addr = user.address;

            // Só mostra o complemento se ele existir
            let complemento = '';
            if (addr.complemento) {
                complemento = '(' + addr.complemento + ')';
            }

            addressContainer.innerHTML = `
                <strong>Endereço de Entrega:</strong><br>
                ${addr.logradouro}, nº ${addr.numero} ${complemento} - ${addr.bairro}, ${addr.cidade} / ${addr.estado} - CEP: ${addr.cep}
            `;
        } else {
            addressContainer.innerHTML = `<strong>Endereço de Entrega:</strong> <span style="color: #c00;">Nenhum endereço cadastrado no perfil. Recomendamos preencher na aba "Endereço" do seu perfil.</span>`;
        }
    }

    // Botão "×" fecha o checkout
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', function () {
            if (checkoutModal) checkoutModal.classList.remove('active');
        });
    }

    // ---------- Validação de CPF ----------
    // Confere os dois dígitos verificadores. Devolve true se o CPF for válido.
    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');

        // Precisa ter 11 números e não pode ser tudo igual (ex: 111.111.111-11)
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        // Primeiro dígito verificador
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        // Segundo dígito verificador
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // ---------- Confirmar pagamento ----------
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Valida o CPF
            if (!isValidCPF(cpfInput.value)) {
                showAlert('CPF inválido. Por favor, verifique os números digitados.');
                return;
            }

            const cart = getCart();
            const subtotal = getSubtotal(cart);
            const total = subtotal + SHIPPING;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

            // Nome da forma de pagamento para mostrar no pedido
            let paymentName = 'Pix';
            if (paymentMethod === 'credit') {
                paymentName = 'Cartão de Crédito';
            }

            // Dados do usuário logado (se tiver)
            const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
            let userEmail = 'convidado';
            if (loggedUser) {
                userEmail = loggedUser.email;
            }

            // Monta o pedido (o número é sorteado: GLC-123456)
            const newOrder = {
                userEmail: userEmail,
                id: 'GLC-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString('pt-BR'),
                items: cart,
                subtotal: subtotal,
                shipping: SHIPPING,
                total: total,
                paymentMethod: paymentName,
                status: 'Aprovado'
            };

            // Adiciona o pedido na lista de pedidos salvos
            const allOrders = JSON.parse(localStorage.getItem('glacie_orders')) || [];
            allOrders.push(newOrder);
            localStorage.setItem('glacie_orders', JSON.stringify(allOrders));

            // Esvazia o carrinho
            localStorage.removeItem('glacie_cart');
            updateCartCount();

            // Fecha o checkout e limpa o formulário
            checkoutModal.classList.remove('active');
            checkoutForm.reset();

            showAlert('Pedido realizado com sucesso! Acompanhe na aba Pedidos em Minha Conta.');
        });
    }
}
