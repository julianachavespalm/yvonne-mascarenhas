# Glossário do Domínio e Engenharia (Ubiquitous Language)

## 1. Domínio Científico e Biográfico
- **Cristalografia Estrutural**: Ciência experimental dedicada a determinar o arranjo tridimensional de átomos e moléculas em sólidos cristalinos.
- **Difração de Raios-X**: Técnica física fundamental utilizada pela Dra. Yvonne Mascarenhas na qual feixes de raios-X incidem sobre um cristal e produzem padrões de difração que revelam sua estrutura eletrônica e molecular.
- **Radiação Síncrotron**: Radiação eletromagnética de alta intensidade e brilho emitida por elétrons relativísticos acelerados magneticamente, essencial na cristalografia moderna de macromoléculas e materiais.
- **ABCr (Associação Brasileira de Cristalografia)**: Sociedade científica fundada em 1971 sob liderança direta da Dra. Yvonne Mascarenhas para consolidar a comunidade cristalográfica nacional.
- **IFSC-USP (Instituto de Física de São Carlos)**: Unidade de excelência da Universidade de São Paulo onde a Dra. Yvonne organizou os primeiros laboratórios de cristalografia estrutural do país e recebeu o título de Professora Emérita.
- **STEM**: Acrônimo internacional para *Science, Technology, Engineering, and Mathematics* (Ciência, Tecnologia, Engenharia e Matemática), eixo de atuação da homenageada na promoção da equidade de gênero.

---

## 2. Domínio de Acessibilidade Digital
- **WCAG 2.2 (Web Content Accessibility Guidelines)**: Recomendação internacional da W3C que define critérios testáveis de acessibilidade web nos níveis A, AA (requisito base deste projeto) e AAA (aplicado no modo de Alto Contraste e em textos principais).
- **Razão de Contraste Luminoso ($CR$)**: Relação matemática dada por $CR = (L_1 + 0.05) / (L_2 + 0.05)$, onde $L_1$ é a luminância relativa da cor mais clara e $L_2$ a da cor mais escura, variando de `1:1` a `21:1`.
- **Landmark Semântico**: Região estrutural da página (`<header>`, `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`) identificável diretamente por tecnologias assistivas e leitores de tela.
- **Skip Link**: Hiperlink posicionado como primeiro elemento focável do DOM que permite saltar blocos de navegação repetitivos diretamente para o conteúdo principal.
- **Região `aria-live`**: Container assistivo (`#a11y-announcer`) que instrui leitores de tela (NVDA, VoiceOver, JAWS) a anunciarem vocalmente mudanças dinâmicas de estado (ex.: *"Modo de alto contraste ativado"*).
- **VLibras**: Suíte pública de ferramentas mantida pelo Governo Federal que traduz conteúdos digitais em português para a Língua Brasileira de Sinais (Libras) através de um avatar 3D.

---

## 3. Engenharia de Software e Arquitetura Enxuta
- **SDD (Spec-Driven Development)**: Metodologia na qual especificações formais (`spec.md`), decisões de arquitetura (`STATE.md` / ADRs), design de componentes (`design.md`) e tarefas granulares verificáveis (`tasks.md`) conduzem e precedem a implementação e validação automatizada.
- **Critérios Dado / Quando / Então (Gherkin + EARS)**: Notação estruturada para escrita de critérios de aceitação não-ambíguos e diretamente testáveis em português.
- **Arquitetura Modular Enxuta Orientada a Features (`ADR-004`)**: Organização proporcional da camada JavaScript em 5 módulos ES6 coesos (`safe-storage.js`, `theme-contrast.js`, `font-scale.js`, `navigation.js`, `main.js`) que combinam funções puras e manipulação de DOM com injeção opcional de dependências para testes.
- **Persistência Resiliente (`safe-storage.js`)**: Encapsulamento seguro de `window.localStorage` com blocos `try/catch` e fallback automático em `Map` na memória para ambientes com armazenamento restrito.
