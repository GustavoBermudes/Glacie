// Menu lateral (aberto pelas duas linhas do topo) e abertura/fechamento do modal de login
export function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Clicar nas duas linhas abre/fecha o menu
    menuBtn.addEventListener('click', function () {
        dropdownMenu.classList.toggle('active');
    });

    const loginLink = document.querySelector('a[href="#entrar"]');
    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.getElementById('close-login');

    // Clicar em "ENTRAR" no menu: abre o modal de login e fecha o menu
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault(); // não deixa o link mudar a URL
            loginModal.classList.add('active');
            dropdownMenu.classList.remove('active');
        });
    }

    // Botão "×" fecha o modal de login
    closeLoginBtn.addEventListener('click', function () {
        loginModal.classList.remove('active');
    });

    // Clicar no fundo escuro (fora da caixa) também fecha o modal
    window.addEventListener('click', function (event) {
        if (event.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}
