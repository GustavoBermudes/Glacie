// Perfil do usuário ("Minha conta"): dados pessoais, endereço (com busca de CEP) e pedidos
import { showAlert, formatPrice } from './utils.js';

export function initPerfil() {
    const perfilBtn = document.getElementById('perfil-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.getElementById('close-profile');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Abas (Dados Pessoais, Endereço, Pedidos) e o conteúdo de cada uma
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Campos dos dados pessoais
    const profileNameInput = document.getElementById('profile-name');
    const profileBirthInput = document.getElementById('profile-birth');
    const profilePhoneInput = document.getElementById('profile-phone');

    // Campos do endereço
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

    // ---------- Abrir e fechar o perfil ----------
    if (perfilBtn) {
        perfilBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Fecha o menu lateral
            if (dropdownMenu) dropdownMenu.classList.remove('active');

            // Preenche os campos com o que está salvo
            loadUserData();
            loadAddressData();
            loadUserOrders();

            if (profileModal) profileModal.classList.add('active');
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', function () {
            profileModal.classList.remove('active');
        });
    }

    // Clicar no fundo escuro fecha o perfil
    window.addEventListener('click', function (e) {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });

    // ---------- Troca de abas ----------
    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Desativa todas as abas e conteúdos
            tabButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            tabPanes.forEach(function (p) {
                p.classList.remove('active');
            });

            // Ativa só a aba clicada e o conteúdo dela (o nome vem do data-tab)
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // ---------- Dados pessoais ----------
    // Coloca nos campos os dados do usuário logado
    function loadUserData() {
        const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
        if (loggedUser) {
            if (profileNameInput) profileNameInput.value = loggedUser.name || '';
            if (profileBirthInput) profileBirthInput.value = loggedUser.birthDate || '';
            if (profilePhoneInput) profilePhoneInput.value = loggedUser.phone || '';
        }
    }

    // Salvar dados pessoais
    if (personalForm) {
        personalForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));

            if (loggedUser) {
                loggedUser.name = profileNameInput.value;
                loggedUser.birthDate = profileBirthInput.value;
                loggedUser.phone = profilePhoneInput.value;

                // Atualiza o usuário logado
                localStorage.setItem('glace_logged_in_user', JSON.stringify(loggedUser));

                // Atualiza também o mesmo usuário dentro da lista de cadastrados
                const userList = JSON.parse(localStorage.getItem('glace_user_list')) || [];
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].email === loggedUser.email) {
                        userList[i].name = loggedUser.name;
                        userList[i].birthDate = loggedUser.birthDate;
                        userList[i].phone = loggedUser.phone;
                    }
                }
                localStorage.setItem('glace_user_list', JSON.stringify(userList));

                showAlert('Dados atualizados com sucesso!');
            }
        });
    }

    // ---------- Endereço ----------
    if (cepInput) {
        // Máscara do CEP (00000-000)
        cepInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);

            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d{1,})/, '$1-$2');
            }
            e.target.value = value;
        });

        // Quando sai do campo CEP, busca o endereço na API ViaCEP
        cepInput.addEventListener('blur', function () {
            const cep = cepInput.value.replace(/\D/g, '');

            // CEP incompleto: não busca
            if (cep.length !== 8) {
                return;
            }

            fetch('https://viacep.com.br/ws/' + cep + '/json/')
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // CEP que não existe
                    if (data.erro) {
                        showAlert('CEP não encontrado.');
                        logradouroInput.value = '';
                        bairroInput.value = '';
                        cidadeInput.value = '';
                        estadoInput.value = '';
                        return;
                    }

                    // Preenche rua, bairro, cidade e estado
                    logradouroInput.value = data.logradouro || '';
                    bairroInput.value = data.bairro || '';
                    cidadeInput.value = data.localidade || '';
                    estadoInput.value = data.uf || '';

                    // Leva o cursor para o campo número
                    numeroInput.focus();
                })
                .catch(function () {
                    showAlert('Não foi possível buscar o CEP. Verifique sua conexão.');
                });
        });
    }

    // Coloca nos campos o endereço salvo do usuário logado
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

    // Salvar endereço
    if (addressForm) {
        addressForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));

            if (loggedUser) {
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

                // Atualiza o usuário logado
                loggedUser.address = addressData;
                localStorage.setItem('glace_logged_in_user', JSON.stringify(loggedUser));

                // Atualiza também o mesmo usuário dentro da lista de cadastrados
                const userList = JSON.parse(localStorage.getItem('glace_user_list')) || [];
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].email === loggedUser.email) {
                        userList[i].address = addressData;
                    }
                }
                localStorage.setItem('glace_user_list', JSON.stringify(userList));

                showAlert('Endereço salvo com sucesso!');
            }
        });
    }

    // ---------- Pedidos ----------
    // Mostra na aba "Pedidos" os pedidos feitos pelo usuário logado
    function loadUserOrders() {
        const ordersListContainer = document.querySelector('.orders-list');
        if (!ordersListContainer) return;

        const loggedUser = JSON.parse(localStorage.getItem('glace_logged_in_user'));
        const allOrders = JSON.parse(localStorage.getItem('glacie_orders')) || [];

        // Se tem usuário logado, pega só os pedidos dele; senão, mostra todos
        let userOrders = allOrders;
        if (loggedUser) {
            userOrders = [];
            for (let i = 0; i < allOrders.length; i++) {
                if (allOrders[i].userEmail === loggedUser.email) {
                    userOrders.push(allOrders[i]);
                }
            }
        }

        ordersListContainer.innerHTML = '';

        // Nenhum pedido ainda
        if (userOrders.length === 0) {
            ordersListContainer.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
            return;
        }

        // Cria uma caixinha para cada pedido
        userOrders.forEach(function (order) {
            const orderEl = document.createElement('div');
            orderEl.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 12px; background: #fafafa; color: #111;';

            // Lista de itens do pedido (uma linha para cada)
            let itemsHTML = '';
            for (let i = 0; i < order.items.length; i++) {
                const item = order.items[i];
                itemsHTML += '<p style="font-size: 0.85rem; color: #555; margin: 2px 0;">- ' + item.name + ' (Tam: ' + item.size + ') | Qtd: ' + item.quantity + '</p>';
            }

            orderEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>Pedido: ${order.id}</strong>
                    <span style="color: #2e7d32; font-weight: bold;">${order.status}</span>
                </div>
                <p style="font-size: 0.85rem; color: #777;">Data: ${order.date} | Pagamento: ${order.paymentMethod} | Frete: R$ 8,90</p>
                <div style="margin: 8px 0; border-top: 1px solid #ddd; padding-top: 6px;">
                    ${itemsHTML}
                </div>
                <p style="text-align: right; font-weight: bold; font-size: 0.95rem;">Total: ${formatPrice(order.total)}</p>
            `;
            ordersListContainer.appendChild(orderEl);
        });
    }

    // Ao clicar na aba "Pedidos", recarrega a lista
    const pedidosTabBtn = document.querySelector('.tab-btn[data-tab="pedidos"]');
    if (pedidosTabBtn) {
        pedidosTabBtn.addEventListener('click', loadUserOrders);
    }
}
