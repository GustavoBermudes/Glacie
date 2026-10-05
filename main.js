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

const modalTitle = document.getElementById('modal-title');
const nameGroup = document.getElementById('name-group');
const btnSubmitText = document.getElementById('btn-submit-text');
const switchText = document.getElementById('switch-text');
const toggleAuthLink = document.getElementById('toggle-auth');
const authForm = document.getElementById('auth-form');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let isRegisterMode = false;

toggleAuthLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;

    if (isRegisterMode) {
        modalTitle.innerText = 'Criar conta na Glacê';
        nameGroup.style.display = 'flex';
        btnSubmitText.innerText = 'Cadastrar';
        switchText.innerText = 'Já tem uma conta?';
        toggleAuthLink.innerText = 'Entrar';
        nameInput.setAttribute('required', 'true');
    } else {
        modalTitle.innerText = 'Entrar na Glacê';
        nameGroup.style.display = 'none';
        btnSubmitText.innerText = 'Entrar';
        switchText.innerText = 'Não tem uma conta?';
        toggleAuthLink.innerText = 'Cadastre-se';
        nameInput.removeAttribute('required');
    }
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (isRegisterMode) {
        const name = nameInput.value;
        const userData = { name, email, password };

        localStorage.setItem('glace_user', JSON.stringify(userData));
        alert('Conta cadastrada com sucesso!');
        
        loginModal.classList.remove('active');
        authForm.reset();
    } else {
        const savedUserJson = localStorage.getItem('glace_user');

        if (!savedUserJson) {
            alert('Nenhuma conta encontrada. Faça o cadastro primeiro!');
            return;
        }

        const savedUser = JSON.parse(savedUserJson);

        if (savedUser.email === email && savedUser.password === password) {
            alert(`Bem-vindo de volta, ${savedUser.name}!`);
            loginModal.classList.remove('active');
            authForm.reset();
        } else {
            alert('E-mail ou senha incorretos.');
        }
    }
});