# SaúdeConnect+

O SaúdeConnect+ é uma plataforma de demonstração para conectar pacientes e unidades de saúde. O app permite encontrar instituições, solicitar consultas e exames, acompanhar agendamentos e receber avisos. A secretaria dispõe de um painel para consultar a agenda da unidade e confirmar solicitações.

## Acesse o site

[saudeconnect.vercel.app](https://saudeconnect.vercel.app)

## Funcionalidades

- Busca de instituições e profissionais por localidade e serviço.
- Agendamento de consultas e exames conforme a disponibilidade.
- Solicitação de reagendamento, cancelamento e histórico de atendimentos.
- Avisos para pacientes e secretaria sobre mudanças nos agendamentos.
- Modo Fácil e interface adaptada para celular e desktop.

> Este projeto usa dados de demonstração. Os fluxos de acesso e agendamento não representam um serviço de saúde em produção.

## Executar localmente

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

Abra no navegador o endereço informado pelo Vite (normalmente `http://localhost:5173`). Na tela inicial, escolha o acesso de paciente ou secretaria para explorar a demonstração.

## Verificações

```bash
npm test
npm run build
```

O projeto foi desenvolvido com React, TypeScript, Vite e Tailwind CSS.
