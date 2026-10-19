import { showAlert } from './utils.js';

export function initPerfil() {
    const perfilBtn = document.getElementById('perfil-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.getElementById('close-profile');
    const dropdownMenu = document.getElementById('dropdown-menu');

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    const profileNameInput = document.getElementById('profile-name');
    const profileBirthInput = document.getElementById('profile-birth');
    const profilePhoneInput = document.getElementById('profile-phone');
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const numeroInput = document.getElementById('numero');
    const complementoInput = document.getElementById('complemento');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const referenciaInput = document.getElementById('referencia');
    const addressForm = document.getElementById('address-form');
    const personalForm = document.getElementById('personal-data-form');

    // Abrir o modal de perfil ao clicar em "Minha Conta"
    if (perfilBtn) {
        perfilBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (dropdownMenu) dropdownMenu.classList.remove('active');
            
            // Carrega os dados salvos do usuário atual nos inputs
            loadUserData();
            loadAddressData();

            if (profileModal) profileModal.classList.add('active');
        });
    }

    // Fechar o modal pelo "X"
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            profileModal.classList.remove('active');
        });
    }

    // Fechar clicando fora da caixa
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });

    // Sistema de Abas
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');

            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    //  Função para preencher os inputs com os dados do localStorage
    function loadUserData() {
        const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
        if (loggedUser) {
        if (profileNameInput) profileNameInput.value = loggedUser.name || '';
        if (profileBirthInput) profileBirthInput.value = loggedUser.birthDate || '';
        if (profilePhoneInput) profilePhoneInput.value = loggedUser.phone || '';
    }
    }

    //  Salvar dados pessoais atualizados
    if (personalForm) {
        personalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));

            if (loggedUser) {
                loggedUser.name = profileNameInput.value;
                loggedUser.birthDate = profileBirthInput.value;
                loggedUser.phone = profilePhoneInput.value;

                localStorage.setItem('glace_logged_in_user', JSON.stringify(loggedUser));
                
                let userList = JSON.parse(localStorage.getItem('glace_user_list')) || [];
                userList = userList.map(user => {
                    if (user.email === loggedUser.email) {
                        user.name = loggedUser.name;
                        user.birthDate = loggedUser.birthDate;
                        user.phone = loggedUser.phone;
                    }
                    return user;
                });
                localStorage.setItem('glace_user_list', JSON.stringify(userList));

                showAlert('Dados atualizados com sucesso!');
            }
        });
    }

    if (cepInput) {
        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');

            if (cep.length !== 8) {
                return;
            }

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        //alert('CEP não encontrado.');
                        showAlert('CEP não encontrado.');
                        logradouroInput.value = '';
                        bairroInput.value = '';
                        cidadeInput.value = '';
                        estadoInput.value = '';
                        return;
                    }

                    // Preenche os campos automáticos
                    logradouroInput.value = data.logradouro || '';
                    bairroInput.value = data.bairro || '';
                    cidadeInput.value = data.localidade || '';
                    estadoInput.value = data.uf || '';
                    
                    // Foca automaticamente no campo de número para o usuário continuar
                    numeroInput.focus();
                })
                .catch(error => {
                    //console.error('Erro ao buscar o CEP:', error);
                    showAlert('Não foi possível buscar o CEP. Verifique sua conexão.');
                });
        });
    }

    // Carregar endereço salvo do localStorage 
    function loadAddressData() {
        const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
        if (loggedUser && loggedUser.address) {
            cepInput.value = loggedUser.address.cep || '';
            logradouroInput.value = loggedUser.address.logradouro || '';
            numeroInput.value = loggedUser.address.numero || '';
            complementoInput.value = loggedUser.address.complemento || '';
            bairroInput.value = loggedUser.address.bairro || '';
            cidadeInput.value = loggedUser.address.cidade || '';
            estadoInput.value = loggedUser.address.estado || '';
            referenciaInput.value = loggedUser.address.referencia || '';
        }
    }

    // Salvar o endereço no localStorage do usuário logado
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));

            if (loggedUser) {
                // Cria o objeto de endereço
                const addressData = {
                    cep: cepInput.value,
                    logradouro: logradouroInput.value,
                    numero: numeroInput.value,
                    complemento: complementoInput.value,
                    bairro: bairroInput.value,
                    cidade: cidadeInput.value,
                    estado: estadoInput.value,
                    referencia: referenciaInput.value
                };

                loggedUser.address = addressData;

                // Salva na sessão ativa
                localStorage.setItem('glace_logged_in_user', JSON.stringify(loggedUser));
                
                // Atualiza também na lista geral de usuários (`glace_user_list`)
                let userList = JSON.parse(localStorage.getItem('glace_user_list')) || [];
                userList = userList.map(user => {
                    if (user.email === loggedUser.email) {
                        user.address = addressData;
                    }
                    return user;
                });
                localStorage.setItem('glace_user_list', JSON.stringify(userList));

                showAlert('Endereço salvo com sucesso!');
            }
        });
    }
}