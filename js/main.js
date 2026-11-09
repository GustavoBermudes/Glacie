// Arquivo principal: importa cada parte do site e liga tudo.
// Cada arquivo exporta uma função "init" que prepara os botões e eventos daquela parte.
import { initMenu } from './menu.js';
import { initLogin } from './login.js';
import { initParallax } from './parallax.js';
import { initPerfil } from './perfil.js';
import { initCatalog } from './catalog.js';
import { initCart } from './cart.js';
import { initSearch } from './search.js';
import { initCheckout } from './checkout.js';

// Chama cada função de inicialização
initParallax();
initMenu();
initLogin();
initPerfil();
initCatalog();
initCart();
initSearch();
initCheckout();
