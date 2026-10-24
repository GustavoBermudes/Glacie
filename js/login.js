import { showAlert } from './utils.js';

export function initLogin(){
    

    const modalTitle = document.getElementById('modal-title');
    const nameGroup = document.getElementById('name-group');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const switchText = document.getElementById('switch-text');
    const toggleAuthLink = document.getElementById('toggle-auth');
    const authForm = document.getElementById('auth-form');
    const loginModal = document.getElementById('login-modal');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // modal de alerta
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    // muda 'entrar' para 'minha conta' e botão de logout
    const loginLink = document.querySelector('a[href="#entrar"]');
    const logout = document.getElementById('logout');
    const logoutBtn = document.getElementById('logout-btn');


    if (alertOkBtn) {
        alertOkBtn.addEventListener('click', () => {
            customAlert.classList.remove('active');
        });
    }

    function toggleLoginLogout() {
        const loggedUser = localStorage.getItem('glace_logged_in_user');
        const entrarItem = document.querySelector('.entrar');
        const perfilItem = document.querySelector('.perfil');
        const logoutItem = document.querySelector('.logout');

        if (loggedUser) {
            if (loggedUser) {
                if (entrarItem) entrarItem.classList.add('hidden');
                if (perfilItem) perfilItem.classList.add('active');
                if (logoutItem) logoutItem.classList.add('active');
            }
        } else {
            if (entrarItem) entrarItem.classList.remove('hidden');
            if (perfilItem) perfilItem.classList.remove('active');
            if (logoutItem) logoutItem.classList.remove('active');
        }
    }

    toggleLoginLogout();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('glace_logged_in_user');
            toggleLoginLogout();
            showAlert('Você saiu da conta.');
        })
    }

    let isRegisterMode = false;

    if (toggleAuthLink) {
        toggleAuthLink.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;

            if (isRegisterMode) {
                modalTitle.textContent = 'Criar conta na Glaciê';
                nameGroup.style.display = 'flex';
                btnSubmitText.textContent = 'Cadastrar';
                switchText.textContent = 'Já tem uma conta?';
                toggleAuthLink.textContent = 'Entrar';
                nameInput.setAttribute('required', 'true');
            } else {
                modalTitle.textContent = 'Entrar na Glaciê';
                nameGroup.style.display = 'none';
                btnSubmitText.textContent = 'Entrar';
                switchText.textContent = 'Não tem uma conta?';
                toggleAuthLink.textContent = 'Cadastre-se';
                nameInput.removeAttribute('required');
            }
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            let userList = JSON.parse(localStorage.getItem('glace_user_list')) || [];

            if (isRegisterMode) {
                const name = nameInput.value;

                const userExists = userList.some(user => user.email === email);
                if (userExists){
                    showAlert('Este e-mail já está cadastrado!');
                    return;
                }

                const newUserData = { name, email, password };
                userList.push(newUserData);
                localStorage.setItem('glace_user_list', JSON.stringify(userList));
                localStorage.setItem('glace_logged_in_user', JSON.stringify(newUserData));
                showAlert('Conta cadastrada com sucesso!');
                loginModal.classList.remove('active');
                authForm.reset();
                toggleLoginLogout();
            } else {
                const foundUser = userList.find(user => user.email === email && user.password === password);
                if (foundUser) {
                    localStorage.setItem('glace_logged_in_user', JSON.stringify(foundUser));
                    showAlert(`Bem-vindo de volta, ${foundUser.name}!`);
                    loginModal.classList.remove('active');
                    authForm.reset();
                    toggleLoginLogout();
                } else {
                    showAlert('E-mail ou senha incorretos (ou conta não encontrada).');
                }
            }
        });
    }

}

