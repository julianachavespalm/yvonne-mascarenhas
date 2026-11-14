# ADR-003: Composição Desacoplada do Hero Editorial (`.hero-content` + `.hero-photo-wrapper`)

- **Status**: Aceito (Ativo — sincronizado com `AD-003` em `.specs/STATE.md`)
- **Data**: 2026-11-13
- **Decisores**: Juliana Chaves Palm (Software Engineer & Solution Designer)

---

## 1. Contexto e Declaração do Problema
A arte de retrato `src/assets/yvonne.png` posiciona o rosto da Dra. Yvonne Mascarenhas emoldurado por diagramas de projeção cristalográfica e cristais de quartzo na base. Caso o texto principal fosse renderizado sobre a fotografia no `<section class="hero">`, o título cobriria o rosto da homenageada em diversas resoluções.

## 2. Decisão e Justificativa
1. **Separação Estrutural**: Dividimos `<section class="hero">` em dois blocos independentes e empilhados na primeira coluna do grid editorial (`.hero-intro-grid`):
   - `.hero-content`: Bloco tipográfico contendo o título principal (`<h2>`), tags temáticas ("Ciência", "Educação", "Brasil"), subtítulo ("Senhora dos Cristais") e linha de autoria ("Por Juliana Chaves Palm ▪ 20 nov. 2023").
   - `.hero-photo-wrapper`: Container dedicado exclusivamente à fotografia (`<img class="hero-photo" src="src/assets/yvonne.png">`), garantindo visibilidade integral do retrato em qualquer proporção de monitor sem nenhum texto sobreposto.
2. **Comportamento no Alto Contraste (`[data-theme="high-contrast"]`)**: Como não há texto sobreposto na frente da fotografia, a imagem permanece 100% visível no modo de Alto Contraste e recebe uma borda branca nítida (`2px solid #ffffff`) para delimitação visual de alto contraste.

## 3. Consequências e Verificação
- **Positivas**: O retrato da Dra. Yvonne permanece 100% visível tanto no tema padrão quanto no Alto Contraste, e o título é lido sobre fundo escuro sólido com contraste `AAA`.
- **Verificação Automatizada**: Testado em `tests/accessibility-and-dom.test.js`.
