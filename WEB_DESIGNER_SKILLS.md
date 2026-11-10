# WEB DESIGNER AI PRO — DIRETRIZES & SKILLS DO PROJETO

## Projeto: Site Imobiliário Premium — Ittala Dias Corretora
Este documento consolida os princípios de arquitetura visual, componentes, bibliotecas, padrões de microinterações e referências utilizadas no desenvolvimento do site institucional e das landing pages de alta conversão.

---

## 1. Bibliotecas e Referências Oficiais
- **React Bits** (`https://www.reactbits.dev/`): Componentes com efeitos táteis, fundos dinâmicos e microinterações modernas.
- **Magic UI** (`https://magicui.design/`): Efeitos de borda brilhante (shimmer/glow), partículas (Particles background), dock flutuante, marquee de marcas/parceiros e números animados.
- **Aceternity UI** (`https://ui.aceternity.com/`): Cards 3D com perspectiva ao passar o mouse, background beams, spotlight illumination e carrosséis cinematográficos.
- **21st.dev** (`https://21st.dev/`): Coleção selecionada de componentes React + Tailwind para sites de alto padrão.
- **Motion (framer-motion)** (`https://motion.dev/`): Orquestração de animações com suporte a `reduced-motion`, fade-ins escalonados, transições de páginas e gestos de toque.

---

## 2. Paleta de Cores e Identidade Visual High-End
- **Background Principal:** `#0b0f17` (Deep Midnight Slate) e `#0f172a` (Rich Obsidian Navy).
- **Acentos Dourados (Champagne & Ouro Nobre):**
  - Dourado Primário: `#d4af37` (Metallic Gold)
  - Dourado Claro: `#f3e5ab` / `#fef08a`
  - Dourado Profundo / Bronze: `#996515` / `#854d0e`
- **Superfícies de Vidro (Glassmorphism):**
  - `backdrop-blur-md bg-white/[0.03] border border-white/[0.08]`
  - `hover:border-[#d4af37]/40 hover:bg-white/[0.06] transition-all duration-500`
- **Tipografia:**
  - Títulos Nobres: `Playfair Display` (serif clássica e imponente) e `Cinzel` (para números de luxo e monogramas).
  - Texto Técnico / Interface: `Montserrat` (geométrica, legível em altas resoluções e telas mobile).

---

## 3. Catálogo de Efeitos e Microinterações Implementados
1. **Spotlight & Radial Glow:** Realce visual suave acompanhando o cursor ou posicionado sobre cards em destaque.
2. **Shimmer Button & Gold Gradient Glow:** Botões primários de conversão com brilho pulsante discreto que direciona o olhar do visitante sem poluição.
3. **Hero Cinematográfico com Parallax Suave:** Fotografia panorâmica de arquitetura com sobreposição em gradiente escuro e transição suave.
4. **Filtro Rápido de Empreendimentos:** Abas de status (Todos, Lançamentos, Em Obras, Prontos para Morar) e seleção de tipologia sem recarregamento de página.
5. **Modal & Galeria Interativa:** Visualizador em tela cheia de fotos e plantas baixas com zoom e navegação tátil.
6. **Gerador de Landing Pages em Tempo Real:** Motor que renderiza templates de alto impacto (Luxo & Coberturas, Minimalista Moderno, Lançamento Exclusivo, Família & Lazer, Investimento & Rentabilidade).
7. **QR Code e Compartilhamento Omnichannel:** Geração de QR Code vetorial e links diretos para WhatsApp, Instagram, LinkedIn e Facebook com mensagens formatadas.
8. **Feedback de Conversão com Confetti Nobre:** Disparo suave de partículas douradas ao submeter com sucesso formulários de interesse.

---

## 4. Diretrizes de Performance e Acessibilidade (Mobile-First)
- Nenhuma biblioteca desnecessária é carregada no cliente.
- Suporte a `prefers-reduced-motion`: as animações reduzem opacidade em vez de movimentos bruscos caso o usuário configure o dispositivo.
- Navegação mobile fluida com menu lateral de toque (drawer) e barra inferior de ação rápida para WhatsApp imediato.
- Estruturação semântica HTML5, JSON-LD Schema `RealEstateAgent` e meta tags Open Graph dinâmicas por empreendimento.
