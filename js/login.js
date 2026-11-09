// Login e cadastro (simulados, usando o localStorage)
import { showAlert } from './utils.js';

export function initLogin() {
    // Elementos do modal de login
    const modalTitle = document.getElementById('modal-title');
    const nameGroup = document.getElementById('name-group');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const switchText = document.getElementById('switch-text');
    const toggleAuthLink = document.getElementById('toggle-auth');
    const authForm = document.getElementById('auth-form');
    const loginModal = document.getElementById('login-modal');

    // Campos do formulário
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Botão "Sair" do menu
    const logoutBtn = document.getElementById('logout-btn');

    // Troca no menu: "ENTRAR" (deslogado) ou "MINHA CONTA" + "Sair" (logado)
    function toggleLoginLogout() {
        const loggedUser = localStorage.getItem('glace_logged_in_user');
        const entrarItem = document.querySelector('.entrar');
        const perfilItem = document.querySelector('.perfil');
        const logoutItem = document.querySelector('.logout');

        if (loggedUser) {
            // Logado: esconde "Entrar" e mostra "Minha conta" e "Sair"
            if (entrarItem) entrarItem.classList.add('hidden');
            if (perfilItem) perfilItem.classList.add('active');
            if (logoutItem) logoutItem.classList.add('active');
        } else {
            // Deslogado: o contrário
            if (entrarItem) entrarItem.classList.remove('hidden');
            if (perfilItem) perfilItem.classList.remove('active');
            if (logoutItem) logoutItem.classList.remove('active');
        }
    }

    // Já ajusta o menu ao abrir a página
    toggleLoginLogout();

    // Sair da conta
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('glace_logged_in_user');
            toggleLoginLogout();
            showAlert('Você saiu da conta.');
        });
    }

    // false = tela de "Entrar" | true = tela de "Cadastrar"
    let isRegisterMode = false;

    // Link que alterna entre "Cadastre-se" e "Entrar"
    if (toggleAuthLink) {
        toggleAuthLink.addEventListener('click', function (e) {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;

            if (isRegisterMode) {
                // Mostra o campo de nome e troca os textos para cadastro
                modalTitle.textContent = 'Criar conta na Glaciê';
                nameGroup.style.display = 'flex';
                btnSubmitText.textContent = 'Cadastrar';
                switchText.textContent = 'Já tem uma conta?';
                toggleAuthLink.textContent = 'Entrar';
                nameInput.setAttribute('required', 'true');
            } else {
                // Esconde o campo de nome e volta os textos de login
                modalTitle.textContent = 'Entrar na Glaciê';
                nameGroup.style.display = 'none';
                btnSubmitText.textContent = 'Entrar';
                switchText.textContent = 'Não tem uma conta?';
                toggleAuthLink.textContent = 'Cadastre-se';
                nameInput.removeAttribute('required');
            }
        });
    }

    // Envio do formulário (entrar ou cadastrar)
    if (authForm) {
        authForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            // Lista de todos os usuários cadastrados
            const userList = JSON.parse(localStorage.getItem('glace_user_list')) || [];

            if (isRegisterMode) {
                // ----- CADASTRO -----
                const name = nameInput.value;

                // Verifica se o e-mail já existe
                let userExists = false;
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].email === email) {
                        userExists = true;
                    }
                }
                if (userExists) {
                    showAlert('Este e-mail já está cadastrado!');
                    return;
                }

                // Salva o novo usuário e já deixa ele logado
                const newUserData = { name: name, email: email, password: password };
                userList.push(newUserData);
                localStorage.setItem('glace_user_list', JSON.stringify(userList));
                localStorage.setItem('glace_logged_in_user', JSON.stringify(newUserData));
                showAlert('Conta cadastrada com sucesso!');
                loginModal.classList.remove('active');
                authForm.reset();
                toggleLoginLogout();
            } else {
                // ----- LOGIN -----
                // Procura um usuário com esse e-mail e senha
                let foundUser = null;
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].email === email && userList[i].password === password) {
                        foundUser = userList[i];
                        break;
                    }
                }

                if (foundUser) {
                    localStorage.setItem('glace_logged_in_user', JSON.stringify(foundUser));
                    showAlert('Bem-vindo de volta, ' + foundUser.name + '!');
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
