export function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    menuBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });

    const loginLink = document.querySelector('a[href="#entrar"]');
    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.getElementById('close-login');

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            loginModal.classList.add('active'); 
            dropdownMenu.classList.remove('active'); 
            menuBtn.classList.remove('open'); 
        });
    }

    closeLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

}