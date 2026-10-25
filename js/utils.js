export function showAlert(message) {
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    if (alertMessage && customAlert) {
        alertMessage.textContent = message;
        customAlert.classList.add('active');

        if (alertOkBtn && !alertOkBtn.dataset.listenerAttached) {
            alertOkBtn.dataset.listenerAttached = 'true';
            alertOkBtn.addEventListener('click', () => {
                customAlert.classList.remove('active');
            });
        }
    }
}

export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('glacie_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const carrinhoLink = document.querySelector('a[href="#carrinho"]');
    if (carrinhoLink) {
        carrinhoLink.textContent = `carrinho (${totalItems})`;
    }

    const carrinhoBtnMenu = document.getElementById('carrinho-btn-menu');
    if (carrinhoBtnMenu) {
        carrinhoBtnMenu.textContent = `CARRINHO (${totalItems})`;
    }
}