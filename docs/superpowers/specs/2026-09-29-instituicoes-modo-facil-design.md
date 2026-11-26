# Instituições, mapa gratuito e Modo Fácil global

## Objetivo

Ampliar a rede demonstrativa para nove instituições em uma grade 3×3 no desktop, substituir o espaço reservado por um mapa interativo gratuito e aplicar o Modo Fácil em todas as áreas do portal sem remover funcionalidades.

## Instituições e mapa

A base demonstrativa terá nove unidades ativas na cidade de São Paulo: três clínicas, três hospitais e três laboratórios. Cada unidade terá endereço, serviços, avaliação, horário, coordenadas e dados compatíveis com os filtros atuais.

A grade apresentará três colunas em telas largas, duas em telas médias e uma no celular. Busca, filtros por tipo e ordenação por proximidade continuarão operando sobre os mesmos dados.

O mapa usará Leaflet com tiles do OpenStreetMap, sem Google Maps, chave de API ou cobrança. Ele exibirá apenas as unidades filtradas, com um marcador por unidade. Cada marcador abrirá um resumo com nome, tipo, endereço e ação para ver detalhes. A atribuição ao OpenStreetMap será visível.

## Modo Fácil global

O modo continuará sendo alternado no Perfil e persistido no navegador. Quando ativo, ele afetará todas as páginas:

- Início: mantém os atalhos grandes existentes.
- Agenda: mostra primeiro o próximo atendimento e ações grandes para reagendar ou cancelar; listas secundárias ficam recolhidas por padrão.
- Instituições: mantém busca e filtros, mas exibe cards maiores, menos etiquetas e ações evidentes.
- Agendamento: mostra uma decisão por vez, com títulos diretos e botões grandes de voltar/continuar.
- Perfil: mantém todas as opções, em blocos grandes e com textos objetivos.

Nenhuma ação será removida. Cancelar, reagendar, ver detalhes, agendar, editar perfil e navegar entre abas continuarão disponíveis.

## Arquitetura

`mockData.ts` receberá cinco instituições novas e profissionais/agendas de demonstração suficientes para manter os caminhos de agendamento consistentes. Um componente `InstitutionsMap` encapsulará Leaflet, OpenStreetMap, marcadores, popup e limpeza do mapa; `TelaInstituicoes` continuará responsável por filtros e navegação.

O estado `modoFacil` existente em `App.tsx` será passado às telas que ainda não o recebem. Componentes terão variações visuais explícitas por página, em vez de depender apenas do CSS global que aumenta fontes.

## Erros e limites

Se os tiles do OpenStreetMap não carregarem, a lista de instituições e os botões permanecem funcionais e o mapa mostra uma mensagem de indisponibilidade. A geolocalização do navegador continua opcional; quando negada, a lista normal e os marcadores seguem disponíveis.

## Verificação

Testes validarão que a rede contém nove unidades e que os filtros permanecem corretos. A tela será conferida em navegador local para grade 3×3, filtros e marcadores. O Modo Fácil será percorrido em Início, Agenda, Instituições, Agendamento e Perfil para garantir que preserva as ações.
