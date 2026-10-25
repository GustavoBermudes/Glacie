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

    if (perfilBtn) {
        perfilBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (dropdownMenu) dropdownMenu.classList.remove('active');
            
            loadUserData();
            loadAddressData();

            if (profileModal) profileModal.classList.add('active');
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            profileModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');

            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    function loadUserData() {
        const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
        if (loggedUser) {
        if (profileNameInput) profileNameInput.value = loggedUser.name || '';
        if (profileBirthInput) profileBirthInput.value = loggedUser.birthDate || '';
        if (profilePhoneInput) profilePhoneInput.value = loggedUser.phone || '';
    }
    }

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
       cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d{1,})/, '$1-$2');
            }
            e.target.value = value;
        });

        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, ''); 

            if (cep.length !== 8) {
                return;
            }

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        showAlert('CEP não encontrado.');
                        logradouroInput.value = '';
                        bairroInput.value = '';
                        cidadeInput.value = '';
                        estadoInput.value = '';
                        return;
                    }

                    logradouroInput.value = data.logradouro || '';
                    bairroInput.value = data.bairro || '';
                    cidadeInput.value = data.localidade || '';
                    estadoInput.value = data.uf || '';
                    
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
                
                // Atualiza lista geral de usuários 
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

    function loadUserOrders() {
        const ordersListContainer = document.querySelector('.orders-list');
        if (!ordersListContainer) return;

        const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
        const allOrders = JSON.parse(localStorage.getItem('glacie_orders')) || [];

        const userOrders = loggedUser 
            ? allOrders.filter(order => order.userEmail === loggedUser.email)
            : allOrders;

        ordersListContainer.innerHTML = '';

        if (userOrders.length === 0) {
            ordersListContainer.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
            return;
        }

        userOrders.forEach(order => {
            const formattedTotal = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            const orderEl = document.createElement('div');
            orderEl.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 12px; background: #fafafa; color: #111;';
            
            let itemsHTML = order.items.map(i => `<p style="font-size: 0.85rem; color: #555; margin: 2px 0;">- ${i.name} (Tam: ${i.size}) | Qtd: ${i.quantity}</p>`).join('');

            orderEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>Pedido: ${order.id}</strong>
                    <span style="color: #2e7d32; font-weight: bold;">${order.status}</span>
                </div>
                <p style="font-size: 0.85rem; color: #777;">Data: ${order.date} | Pagamento: ${order.paymentMethod} | Frete: R$ 8,90</p>
                <div style="margin: 8px 0; border-top: 1px solid #ddd; padding-top: 6px;">
                    ${itemsHTML}
                </div>
                <p style="text-align: right; font-weight: bold; font-size: 0.95rem;">Total: ${formattedTotal}</p>
            `;
            ordersListContainer.appendChild(orderEl);
        });
    }

    // Associa o carregamento à aba de pedidos do perfil
    const pedidosTabBtn = document.querySelector('.tab-btn[data-tab="pedidos"]');
    if (pedidosTabBtn) {
        pedidosTabBtn.addEventListener('click', loadUserOrders);
    }

    // Carrega os pedidos automaticamente ao abrir o modal de perfil
    if (perfilBtn) {
        perfilBtn.addEventListener('click', () => {
            loadUserData();
            loadAddressData();
            loadUserOrders(); // Carrega os pedidos direto ao abrir a conta
            if (profileModal) profileModal.classList.add('active');
        });
    }
}