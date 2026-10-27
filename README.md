# Glaciê

Projeto desenvolvido para a disciplina de Desenvolvimento Front-End para Web, 2º semestre noturno de 2026.

## Descrição

O Glaciê é uma loja fictícia de moda contemporânea, criada como uma interface front-end de e-commerce com foco em experiência visual, navegação intuitiva e interações dinâmicas em JavaScript. O site simula uma loja de roupas e acessórios, com catálogo por gênero, pesquisa, carrinho de compras, formulário de checkout e autenticação de usuário.

A proposta do projeto é aplicar conceitos fundamentais de desenvolvimento web front-end, como:

- estruturação com HTML
- estilização com CSS
- dinamismo com JavaScript
- manipulação do DOM
- consumo de dados em JSON
- armazenamento local com localStorage
- interface pensanda em usabilidade e responsividade

## Objetivo do projeto

Desenvolver uma landing page e uma vitrine de produtos funcional, com foco em:

- apresentação visual de uma marca de moda
- navegação entre coleções masculinas e femininas
- busca por peças no catálogo
- seleção de tamanho e adição ao carrinho
- simulação de compra com formulário de pagamento
- experiência de uso moderna e elegante

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- JSON 
- LocalStorage
- Navegador web moderno
- Nanobanana da Google para geração de imagens

## Funcionalidades

- Página inicial com identidade visual da marca
- Seções de destaque para coleções masculinas e femininas
- Catálogo dinâmico com produtos carregados via arquivo JSON
- Seleção de tamanho por peça
- Adição de itens ao carrinho
- Atualização do contador de itens no carrinho
- Modal de pesquisa do catálogo
- Modal de checkout com resumo do pedido
- Simulação de autenticação de usuário (login, perfil e logout)
- Efeito de paralaxe e destaque visual em seções promocionais

## Estrutura do projeto

```text
Glacie/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── cart.js
│   ├── catalog.js
│   ├── checkout.js
│   ├── login.js
│   ├── main.js
│   ├── menu.js
│   ├── parallax.js
│   ├── perfil.js
│   ├── search.js
│   └── utils.js
├── json/
│   └── catalog.json
├── images/
│   ├── men/
│   └── women/
└── ...
```

## Como executar

Atrás de execução via extensão Live Service do Visual Code ou pelo link do GitHub Pages:

https://gustavobermudes.github.io/Glacie/


## Observações

- O catálogo de produtos é carregado a partir do arquivo `json/catalog.json`.
- A aplicação utiliza `localStorage` para manter o carrinho salvo no navegador.
- O projeto foi pensado como exercício prático de front-end, com foco em JavaScript manipulação de interface e consumo de dados estáticos.

## Conclusão

O Glaciê representa uma aplicação didática de e-commerce front-end, reunindo elementos visuais e interações essenciais para a construção de interfaces web modernas. O projeto evidencia o uso de HTML, CSS e JavaScript em conjunto, reforçando conceitos trabalhados na disciplina de Desenvolvimento Front-End para Web no 2º semestre noturno de 2026.

## Integrantes

Bruno Gallego Costa
Glebson Delphino Gregorio do Nascimento Junior
Guilherme Cerqueira Vaz
Guilherme Sampaio Lopes
Gustavo da Silva Santos
Gustavo de Morais Rodrigues
Gustavo de São Justo Bermudes
