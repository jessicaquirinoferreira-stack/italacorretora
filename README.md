# Site Imobiliário Premium — Ittala Dias Corretora

Aplicação institucional imobiliária de alto padrão desenvolvida com React, TypeScript, Tailwind CSS, Motion e Firebase (Firestore & Authentication).

## 🏢 Sobre o Projeto
- **Público:** Site institucional focado em assessoria de empreendimentos de luxo, coberturas e mansões com a corretora **Ittala Dias** (Instagram oficial: `@ittaladias.corretora`).
- **Vitrine Dinâmica:** Catálogo completo alimentado em tempo real via Cloud Firestore.
- **Páginas Individuais:** Cada empreendimento possui rota pública com fotos em alta resolução, metragens, diferenciais, plantas baixas e formulário de interesse.
- **Gerador de Landing Pages:** Ferramenta administrativa interna para gerar landing pages comerciais exclusivas com URL amigável (`/lancamento/:slug`), QR Code vetorial e compartilhamento direto para WhatsApp, Instagram e redes sociais.
- **Painel Administrativo Discreto:** Acessível via rota `/admin/login` e link central no rodapé ("PAINEL ADMIN").

---

## 🔐 Acesso Administrativo Inicial
- **E-mail:** `admin@x.com`
- **Senha temporária:** `admin4321`
- **Segurança:** O painel solicita a alteração obrigatória da senha no primeiro login para proteção dos dados dos clientes (LGPD).

---

## 🚀 Publicação na Vercel
1. Conecte o repositório GitHub à sua conta na [Vercel](https://vercel.com).
2. O framework detectará automaticamente a configuração do Vite/React.
3. As credenciais do Firebase já vêm configuradas e integradas. Para produção, configure as variáveis do `.env.example` nas configurações de Environment Variables da Vercel.
4. Execute o deploy (`npm run build`).

---

## 🛠️ Tecnologias Utilizadas
- **React 19 & TypeScript**
- **Tailwind CSS v4** com paleta customizada Champagne Gold (`#d4af37`), Midnight Slate (`#0b0f17`) e Glassmorphism
- **Firebase Firestore & Firebase Auth**
- **Motion & Lucide React**
- **Canvas Confetti** para celebração em formulários de interesse
- **SEO & Schema.org** estruturado para `RealEstateAgent`
