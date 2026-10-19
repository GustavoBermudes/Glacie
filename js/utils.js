export function showAlert(message) {
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    if (alertMessage && customAlert) {
        alertMessage.textContent = message;
        customAlert.classList.add('active');

        // Garante que o evento de fechar funcione caso ainda não esteja configurado globalmente
        if (alertOkBtn && !alertOkBtn.dataset.listenerAttached) {
            alertOkBtn.dataset.listenerAttached = 'true';
            alertOkBtn.addEventListener('click', () => {
                customAlert.classList.remove('active');
            });
        }
    }
}