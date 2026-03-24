# 📦 BT Oficial - Sistema de Gestão de Estoque

Este é o sistema oficial de gestão de estoque da **BT Oficial**, modernizado para oferecer máxima performance, segurança de dados e facilidade de uso. O sistema foi migrado de um modelo baseado em arquivos para um banco de dados **PostgreSQL** profissional com **Prisma ORM**.

---

## 🚀 Funcionalidades Principais

- **📊 Dashboard Dinâmico:** Visão consolidada de valor em estoque, quantidade total e alertas automáticos de estoque baixo.
- **🛡️ Persistência Robusta:** Dados armazenados em PostgreSQL via Docker, garantindo integridade e prevenindo perdas.
- **🔎 Busca Inteligente:** Filtros avançados por nome, SKU ou categoria com resultados instantâneos.
- **📄 Relatórios Profissionais:** Geração de PDFs detalhados para controle administrativo com um único clique.
- **🌓 Temas Adaptáveis:** Modo Escuro e Modo Claro integrados para melhor experiência em qualquer ambiente.
- **🏗️ Gestão de Ordens de Serviço:** Módulo completo para controle de manutenção e reparos.

---

## 🛠️ Tecnologias de Ponta

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + TSX
- **Banco de Dados:** PostgreSQL (Docker)
- **ORMs/Ferramentas:** Prisma ORM
- **Testes:** Vitest + Supertest

---

## ⚙️ Como Rodar o Projeto

### 1. Pré-requisitos
- **Node.js** (v18 ou superior)
- **Docker** e **Docker Compose** (necessário para o banco de dados)

### 2. Configuração do Banco de Dados
Certifique-se de que o Docker está rodando e inicie o PostgreSQL:
```bash
docker-compose up -d
```

### 3. Instalação e Preparação
```bash
# Instalar dependências
npm install

# Garantir que o banco de dados está sincronizado (Cria tabelas se o banco estiver vazio)
npx prisma db push

# OU, se desejar rodar as migrações oficiais:
# npx prisma migrate dev

# Gerar o Prisma Client
npx prisma generate

# (Opcional) Migrar dados do db.json legado para o PostgreSQL
npx tsx scripts/migrate-data.ts
```

### 4. Iniciar o Sistema
```bash
npm run dev
```
Acesse: `http://localhost:3000`

---

## 🧪 Testes e Qualidade

Mantenha o código seguro com a suíte de testes automatizados:
```bash
# Rodar testes uma vez
npm test

# Rodar testes em modo watch
npx vitest
```

---

## 🗄️ Ferramentas Administrativas

O sistema oferece ferramentas poderosas para gerenciamento direto:
- **Prisma Studio:** Interface visual para o banco de dados.
  ```bash
  npx prisma studio
  ```
- **Logs de Auditoria:** Rastreamento completo de todas as ações de usuários via módulo de Logs.

---

## ⚠️ Solução de Problemas Comuns

### Erro 403 (Forbidden) após Reset do Banco
Se você deletar os volumes do Docker (`docker compose down -v`) e reiniciar o sistema, o seu navegador pode tentar usar um token antigo.
**Solução:** Recarregue a página (F5). O sistema detectará o erro e fará o logout automático, permitindo que você crie uma nova conta.

---
## 🔄 Inicialização Automática (Windows)

Para que o sistema inicie sozinho com o Windows:
1. Localize o arquivo `INICIAR_SISTEMA.bat`.
2. `Windows + R` -> digite `shell:startup`.
3. Crie um atalho do arquivo `.bat` dentro desta pasta.

---
Desenvolvido por **BT Oficial** | 2026
