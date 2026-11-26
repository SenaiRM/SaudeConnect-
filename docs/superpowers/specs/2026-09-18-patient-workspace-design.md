# Padronização visual do portal do paciente

## Objetivo

Aplicar o mesmo padrão visual aprovado no painel administrativo ao fluxo do paciente: conteúdo organizado em uma área de trabalho clara, cards apenas para informação acionável, um cabeçalho consistente e ações sem repetição.

## Escopo

As telas cobertas são Início, Agenda, Agendar, Instituições e Perfil. O painel administrativo e seus fluxos permanecem inalterados.

## Padrão compartilhado

- Fundo de trabalho `#F4F9FA`, cards brancos, bordas `#B9D9DD` e ação principal `#087E8B`.
- Sidebar fixa em notebooks; navegação inferior no celular.
- Apenas uma área global de conta e notificações no topo em desktop; páginas não podem duplicar esses controles.
- Títulos usam eyebrow, título e descrição curta. Nenhuma linha superior decorativa ocupa espaço.
- Grades começam diretamente com conteúdo. Contadores auxiliares não ocupam células de cards.

## Início

- Mostrar um resumo de cuidados, próximo atendimento e duas ações rápidas: consulta e exame.
- Usar estado vazio claro quando não houver atendimentos, evitando métricas com zero sem contexto.
- Notificações abrem em popover, sem navegar para uma tela separada.

## Agenda

- Manter calendário compacto ao lado da agenda do dia no desktop.
- Exibir somente compromissos úteis do dia, seguidos por abas de próximos, consultas, exames e histórico.
- O botão “Novo agendamento” permanece associado à agenda do dia no desktop e flutuante apenas no celular.

## Agendar

- O paciente começa escolhendo consulta ou exame e vê instituições, profissionais e horários disponíveis conforme a escolha.
- Não existem etapas vazias, sequência de abas obrigatória ou horários indisponíveis.
- A confirmação é apresentada em diálogo compacto, com resumo antes de concluir.

## Instituições

- Busca e filtros ficam acima da grade.
- A grade inicia com a primeira instituição, sem contador de resultados em uma célula.
- Cada card mostra tipo, avaliação, estado de funcionamento, endereço, serviços e as ações “Ver detalhes” e “Agendar”.

## Perfil

- Cabeçalho sem sino local: a notificação global é a única ação de notificação.
- Dados pessoais, contato, endereço, senha e preferências aparecem como linhas claras e acionáveis.
- Para administradores, o acesso ao Painel de Gestão usa card branco com destaque teal; para pacientes, esse acesso não aparece.

## Verificação

- Testes de layout protegem o cabeçalho, a grade de instituições, a agenda e o perfil.
- Validar visualmente em notebook (1366×768) e em celular antes da entrega.
