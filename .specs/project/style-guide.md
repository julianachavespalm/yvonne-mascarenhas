# Guia de Estilo e Design System (`FEAT-009`) — Tokens & Conformidade WCAG 2.2

## 1. Arquitetura de Tokens (`src/css/tokens.css`)
O Design System estabelece tokens centralizados em `src/css/tokens.css` (`ADR-006`), separando os tokens do tema padrão (`:root`) dos tokens redefinidos para o tema de Alto Contraste (`[data-theme="high-contrast"]`).

---

## 2. Paleta Cromática e Auditoria Matemática de Luminância

### 2.1. Tokens Semânticos
| Token | Hexadecimal | Descrição e Aplicação |
| :--- | :--- | :--- |
| `--bg` | `#0b0e14` | Fundo principal da página |
| `--surface` | `#131823` | Superfície de controles, cartões e blocos de conteúdo |
| `--text` | `#ffffff` | Títulos principais e texto de alto destaque |
| `--text-muted` | `#9ba1a6` | Texto de leitura, legendas e metadados |
| `--accent-red` | `#e63946` | Destaque editorial carmesim e anel de foco |
| `--accent-blue` | `#4a90e2` | Destaque azul secundário |
| `--border-timeline` | `#2a3446` | Divisórias e conectores da linha do tempo |

### 2.2. Matriz de Contraste W3C ($CR = (L_1 + 0.05) / (L_2 + 0.05)$)

| Componente / Estado | Primeiro Plano | Fundo | Razão ($CR$) | Nível WCAG 2.2 |
| :--- | :--- | :--- | :--- | :--- |
| **Texto Primário e Títulos** | `#ffffff` | `#0b0e14` | **`> 18.0 : 1`** | **AAA** (Mínimo AA ≥ 4.5:1) |
| **Texto Secundário (`--text-muted`)** | `#9ba1a6` | `#0b0e14` | **`> 6.0 : 1`** | **AA** (Mínimo AA ≥ 4.5:1) |
| **Acentos (`--accent-red`)** | `#e63946` | `#0b0e14` | **`> 4.5 : 1`** | **AA** (Mínimo AA ≥ 4.5:1) |
| **Alto Contraste — Texto e Títulos** | `#ffffff` | `#000000` | **`21.0 : 1`** | **AAA** (Mínimo AAA ≥ 7.0:1) |
| **Alto Contraste — Destaques Amarelos** | `#ffff00` | `#000000` | **`19.56 : 1`** | **AAA** (Mínimo AAA ≥ 7.0:1) |
| **Alto Contraste — Destaques Cianos** | `#00ffff` | `#000000` | **`16.75 : 1`** | **AAA** (Mínimo AAA ≥ 7.0:1) |
| **Alto Contraste — Botão em `:hover`** | `#000000` | `#ffff00` | **`19.56 : 1`** | **AAA** (Mínimo AAA ≥ 7.0:1) |

---

## 3. Tipografia e Ritmo Editorial

- **Títulos (`--font-heading`)**: `'Oswald', sans-serif` — Tipografia condensada com forte presença editorial.
- **Corpo (`--font-body`)**: `'Inter', sans-serif` — Alta legibilidade para leitura em tela.
- **Diretriz de Limpeza Visual**: Textos, títulos e citações não utilizam bordas decorativas ao seu redor; a hierarquia é construída por contraste cromático, escala tipográfica e espaço negativo.
