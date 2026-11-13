# 🐾 Tia Lari Pet Shop

### Sistema Web de Gerenciamento para Pet Shop

**Projeto Interdisciplinar — 1º Semestre**  
**Fatec Franca — Dr. Thomaz Novelino**  
**Curso:** Desenvolvimento de Software Multiplataforma (DSM)  
**Ano:** 2026

---

## 📋 Sobre o Projeto

O **Tia Lari Pet Shop** é um sistema web desenvolvido como Projeto Interdisciplinar do primeiro semestre do curso de Desenvolvimento de Software Multiplataforma da Fatec Franca.

O projeto surgiu a partir de uma necessidade real da empresa **Tia Lari Banho e Tosa**, que realizava o controle de clientes, animais, agendamentos e atendimentos por meio de anotações manuais.

Essa forma de organização dificultava a consulta de informações, o acompanhamento dos serviços realizados e a administração da rotina do estabelecimento.

Como solução, desenvolvemos um protótipo web que centraliza essas informações em um único ambiente, proporcionando maior organização e facilidade na execução das atividades.

## 🎯 Objetivo

Desenvolver um website funcional para auxiliar no gerenciamento das principais atividades de um pet shop, aplicando os conhecimentos adquiridos durante o primeiro semestre.

**Objetivos específicos:**

- Centralizar informações de clientes e animais.
- Organizar agendamentos de serviços.
- Facilitar a consulta de dados dos pets e seus responsáveis.
- Acompanhar os atendimentos realizados.
- Reduzir a possibilidade de cadastros duplicados.
- Proporcionar uma interface simples e intuitiva.

## 🎥 Vídeo de Apresentação — Elevator Pitch

Como parte da apresentação do Projeto Interdisciplinar da Fatec Franca, nossa equipe desenvolveu um **Elevator Pitch** demonstrando a proposta e o funcionamento do sistema Tia Lari Pet Shop.

O vídeo apresenta o problema identificado no estabelecimento, a solução desenvolvida, as metodologias de Engenharia de Software aplicadas e uma demonstração prática das principais funcionalidades.

**▶️ [Assistir à apresentação do Sistema no YouTube](https://youtu.be/TWHXSrh48Tw)**

### Conteúdo da apresentação

- Problema enfrentado pelo estabelecimento.
- Solução proposta e seus benefícios.
- Metodologia e levantamento de requisitos.
- Identidade visual e tecnologias utilizadas.
- Demonstração prática do sistema.

## 💻 Funcionalidades

### 👤 Gerenciamento de Clientes

Permite cadastrar e consultar os tutores dos animais.

- Cadastro de nome, CPF, telefone, e-mail e endereço.
- Validação de CPF.
- Verificação de CPFs duplicados.
- Pesquisa e consulta de clientes.
- Associação entre tutores e seus pets.

### 🐶 Gerenciamento de Pets

Permite organizar os animais atendidos pelo estabelecimento.

- Cadastro de nome, raça e porte.
- Associação obrigatória com um tutor.
- Registro de observações e cuidados especiais.
- Pesquisa e consulta dos animais cadastrados.

**Regra de negócio:** cada tutor deve possuir pelo menos um pet vinculado ao seu cadastro inicial.

### 📅 Gerenciamento de Agendamentos

Permite organizar os serviços realizados pelo pet shop.

- Cadastro de novos agendamentos.
- Seleção do pet e do profissional responsável.
- Definição de data, horário e serviço.
- Consulta dos agendamentos registrados.
- Acompanhamento da situação dos agendamentos.

### 🛁 Controle de Atendimentos

Permite acompanhar os serviços registrados.

- Visualização dos atendimentos.
- Identificação do animal e do responsável.
- Consulta do serviço realizado.
- Atualização da situação dos atendimentos.

### 📊 Dashboard

Apresenta uma visão geral da rotina do estabelecimento, reunindo indicadores operacionais e informações da agenda.

### 👥 Gerenciamento de Usuários

Permite cadastrar e consultar os usuários que representam a equipe do pet shop.

A autenticação apresentada nesta versão é demonstrativa e não deve ser considerada um mecanismo de segurança para uso em produção.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura das páginas web |
| CSS3 | Estilização e identidade visual |
| JavaScript | Funcionalidades e interações |
| Bootstrap | Componentes e responsividade |
| JSON | Dados iniciais de demonstração |
| LocalStorage | Persistência local no navegador |
| Git e GitHub | Versionamento e organização do projeto |

**Observação:** nesta primeira etapa, não foi implementado banco de dados relacional ou back-end. Essas funcionalidades não são exigências do primeiro semestre.

## 📚 Metodologia de Desenvolvimento

O desenvolvimento foi orientado pelos conteúdos das disciplinas do primeiro semestre.

**Engenharia de Software I**

- Identificação do problema.
- Levantamento de requisitos.
- Definição de requisitos funcionais e não funcionais.
- Especificação das regras de negócio.
- Construção do modelo Canvas.
- Documentação do sistema.

**Desenvolvimento Web I**

- Estruturação das páginas HTML.
- Estilização com CSS.
- Implementação das funcionalidades em JavaScript.
- Organização dos arquivos.
- Controle de versionamento.

**Design Digital**

- Definição da identidade visual.
- Escolha da paleta de cores.
- Planejamento da interface.
- Organização dos elementos visuais.
- Seleção e utilização de imagens.

## 🗂️ Estrutura do Projeto

```text
TiaLari_PetShop/
│
├── index.html
├── login.html
├── dashboard.html
├── clientes.html
├── novo-cliente.html
├── pets.html
├── novo-pet.html
├── agendas.html
├── atendimentos.html
├── usuarios.html
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── json/
│   ├── fonts/
│   └── vendor/
│
├── docs/
|   ├── PI_Pet_Shop_Tia_Lari_1_Semestre.docx
|   ├──PI_DSM_Tia_Lari_Pet-shop_apresentacao.pptx
│   ├── references/
│       ├── Figma alta fidelidade/
│       └── Figma modelo baixa fidelidade/
│       
│
└── README.md
```

## 🚀 Como Executar o Projeto

1. Clone ou baixe este repositório.
2. Abra a pasta do projeto no Visual Studio Code.
3. Inicie um servidor local, por exemplo com a extensão Live Server.
4. Abra o arquivo `index.html` pelo servidor.
5. Acesse o protótipo pela página inicial.

O projeto utiliza arquivos JSON para carregar os registros iniciais. Por isso, recomenda-se executá-lo através de um servidor local, e não abrindo os arquivos diretamente pelo explorador de arquivos.

**Importante:** os dados cadastrados ficam armazenados no navegador utilizado. Não existe sincronização de informações entre dispositivos.

## 📖 Documentação

A documentação do Projeto Interdisciplinar está disponível na pasta `docs/`.

Ela apresenta os objetivos, o escopo, o modelo Canvas, as regras de negócio, os requisitos funcionais e não funcionais e os demais materiais desenvolvidos durante o semestre.

## 🎥 Apresentação do Projeto

O grupo preparou um Elevator Pitch apresentando:

- O problema identificado na Tia Lari Banho e Tosa.
- A solução proposta e seus benefícios.
- A metodologia de desenvolvimento.
- As funcionalidades do sistema.
- Os requisitos do primeiro semestre atendidos.

**Vídeo de demonstração:** link*.

## 👨‍💻 Integrantes

| Integrante | GitHub |
|---|---|
| Anthony Lincon Silva Guilherme | [anthonylincon34-create](https://github.com/anthonylincon34-create) |
| Kauã Garcia Lima | [Kaua-Gl](https://github.com/Kaua-Gl) |
| Pedro Tordato Marques | [ptordatomarques-eng](https://github.com/ptordatomarques-eng) |
| Rickelme Augusto de Oliveira Lopes Resende | [rick460](https://github.com/rick460) |

## 🏫 Instituição

**Faculdade de Tecnologia de Franca — Dr. Thomaz Novelino**

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma.

**Disciplinas envolvidas:**
- Engenharia de Software I.
- Desenvolvimento Web I.
- Design Digital.

**Professor orientador:** Fernando Martins.

## ✅ Considerações Finais

O Tia Lari Pet Shop representa a aplicação prática dos conhecimentos adquiridos durante o primeiro semestre do curso de Desenvolvimento de Software Multiplataforma.

O projeto demonstra como uma necessidade real pode ser transformada em uma solução tecnológica, integrando conceitos de Engenharia de Software, Desenvolvimento Web e Design Digital.

A versão atual consiste em um protótipo funcional, desenvolvido com tecnologias web e armazenamento local, que poderá servir como base para futuras evoluções.

**Tia Lari Pet Shop — Mais organização para quem cuida de quem a gente ama.** 🐾