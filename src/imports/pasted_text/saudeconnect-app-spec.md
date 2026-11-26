Prompt Final

Aja como um analista de requisitos sênior, product designer mobile, especialista em UX/UI para aplicativos de saúde, arquiteto de software mobile e gerente de produto digital.

Sua tarefa é criar a especificação completa de um aplicativo mobile chamado SaúdeConnect+.

O SaúdeConnect+ será um app mobile voltado para pessoas em geral, com foco em facilitar o acesso a serviços de saúde. O aplicativo deve permitir que usuários cadastrem uma conta, realizem login, consultem agenda, agendem consultas, agendem exames, acompanhem seus agendamentos, recebam notificações, consultem instituições, consultem profissionais e mantenham seus dados de perfil.

O app deve ser funcional, profissional, moderno, intuitivo e de fácil acesso em todos os casos. Todas as funcionalidades importantes devem ser encontradas rapidamente pelo usuário, com navegação simples, textos claros, botões visíveis e organização objetiva.

O aplicativo deve evitar excesso de telas. Não transforme cada requisito funcional em uma tela separada. Agrupe funcionalidades semelhantes dentro da mesma tela usando abas internas, cards, filtros, botões, modais, menus e seções organizadas.

A estrutura do app deve ser pensada exclusivamente para mobile, considerando uso em celular, navegação por menu inferior, botões de fácil toque, telas limpas, fluxo rápido e experiência de usuário profissional.

Use obrigatoriamente esta paleta de cores:

Cor principal: #769382
Cor secundária: #E3D9C3
Cor de apoio: #C0C3B9
Cor de fundo: #F3F1E3

O app deve transmitir confiança, saúde, organização, tranquilidade, segurança e profissionalismo.

O aplicativo deve seguir obrigatoriamente estes requisitos principais:

RF01 — Manter Usuário
RF02 — Realizar Login
RF03 — Manter Consultas
RF04 — Manter Exames
RF05 — Notificar Usuário
RF06 — Manter Instituição
RF07 — Manter Profissionais
RF08 — Manter Agenda
RF09 — Consultar Agenda

Crie uma solução mobile enxuta, mas completa. O app deve ter no máximo estas telas principais:

Tela Acesso
Tela Home
Tela Agenda
Tela Agendar
Tela Instituições e Profissionais
Tela Notificações
Tela Perfil
Tela Gestão, apenas para administradores, instituições ou responsáveis pela agenda

A navegação principal do app deve usar uma barra inferior com no máximo 5 itens:

Home
Agenda
Agendar
Instituições
Perfil

A tela de Notificações deve ser acessada por um ícone no topo da Home, Agenda ou Perfil, sem ocupar obrigatoriamente espaço na barra inferior.

A Tela Agenda deve ser uma tela central do app. Ela deve reunir no mesmo lugar:

consulta de agenda
minhas consultas
meus exames
próximos agendamentos
histórico
calendário
horários disponíveis
status de consultas e exames
opção de visualizar detalhes
opção de cancelar agendamento, quando permitido

A Tela Agenda deve usar abas internas, como:

Todos
Consultas
Exames
Histórico

Na aba Todos, consultas e exames devem aparecer juntos em ordem de data. Nas abas Consultas e Exames, o usuário pode filtrar cada tipo de agendamento. No Histórico, devem aparecer agendamentos já realizados ou cancelados.

A Tela Agendar deve ser única. Não crie uma tela separada para agendar consulta e outra para agendar exame. Dentro da Tela Agendar, o usuário primeiro escolhe o tipo de agendamento:

Consulta
Exame

Depois, o fluxo muda conforme a escolha.

Para consulta, o fluxo deve conter:

especialidade
instituição
profissional
data
horário
confirmação

Para exame, o fluxo deve conter:

tipo de exame
instituição ou laboratório
data
horário
confirmação

A Tela Instituições e Profissionais deve agrupar instituições, profissionais e especialidades na mesma tela, usando abas internas:

Instituições
Profissionais
Especialidades

A Tela Perfil deve concentrar o requisito Manter Usuário, permitindo editar dados pessoais, contato, endereço, senha e preferências de notificação.

A Tela Gestão deve aparecer somente para perfis administrativos, instituição ou responsável pela agenda. Ela deve agrupar:

manter instituição
manter profissionais
manter agenda
bloquear horários
liberar horários
visualizar agendamentos

Use abas internas na Tela Gestão:

Instituição
Profissionais
Agenda

O app deve seguir a regra dos poucos toques:

Agendar consulta deve ser possível em poucos passos a partir da Home ou da Tela Agendar.
Agendar exame deve ser possível em poucos passos a partir da Home ou da Tela Agendar.
Visualizar consultas e exames deve ser possível diretamente pela Tela Agenda.
Cancelar consulta ou exame deve ser possível pelo card do agendamento dentro da Agenda.
Editar dados do usuário deve ser possível pela Tela Perfil.
Consultar instituições e profissionais deve ser possível pela Tela Instituições e Profissionais.

Agora desenvolva a documentação completa do aplicativo seguindo a estrutura abaixo.

Visão geral do aplicativo

Explique o que é o SaúdeConnect+, qual problema resolve, para quem é destinado e quais benefícios oferece.

Deixe claro que é um app mobile de saúde para pessoas em geral e que seu foco é facilitar o acesso a consultas, exames, instituições, profissionais e agendas.

Objetivo do aplicativo

Descreva o objetivo geral e os objetivos específicos do app.

Inclua objetivos como:

facilitar o agendamento de consultas
facilitar o agendamento de exames
centralizar consultas e exames em uma agenda única
permitir consulta rápida de horários disponíveis
enviar notificações e lembretes
organizar instituições e profissionais
manter dados do usuário
oferecer navegação simples e de fácil acesso

Público-alvo

Defina o público-alvo como pessoas em geral que precisam acessar serviços de saúde pelo celular.

Inclua também:

pacientes
profissionais de saúde
clínicas
hospitais
laboratórios
administradores
responsáveis por agenda

Conceito do app

Crie um conceito profissional para o SaúdeConnect+.

Explique o posicionamento do app como uma solução mobile de saúde simples, confiável, organizada e eficiente.

Crie também uma frase curta de apresentação do app.

Identidade visual

Explique como a paleta de cores deve ser aplicada:

#769382 como cor principal para botões principais, cabeçalhos, ícones ativos, barra inferior ativa e ações de confirmação.

#E3D9C3 como cor secundária para cards, áreas de destaque suave e fundos de seções.

#C0C3B9 como cor de apoio para bordas, divisórias, ícones secundários e elementos neutros.

#F3F1E3 como fundo principal das telas.

Sugira também:

cor para texto principal
cor para texto secundário
cor para sucesso
cor para erro
cor para alerta
cor para botão desabilitado

Diretrizes de UX/UI

Crie diretrizes detalhadas para a experiência do usuário e interface do aplicativo.

Inclua obrigatoriamente:

interface limpa
navegação fácil
poucas telas principais
funções agrupadas de forma lógica
uso de abas internas
uso de cards para consultas e exames
menu inferior com no máximo 5 itens
botões grandes e claros
textos curtos e objetivos
calendário visual na Agenda
filtros rápidos
confirmação clara de agendamento
feedback visual de sucesso, erro e carregamento
estados vazios bem explicados
ações importantes sempre visíveis
acesso rápido às principais funções

Explique como o app deve ser fácil de acessar em todos os casos.

Estrutura enxuta de telas

Crie uma tabela com apenas estas telas principais:

Acesso
Home
Agenda
Agendar
Instituições e Profissionais
Notificações
Perfil
Gestão

A tabela deve conter:

nome da tela
objetivo
funcionalidades agrupadas
componentes principais
ações disponíveis
requisitos funcionais relacionados

Detalhamento das telas

Detalhe cada tela do app.

Para cada tela, informe:

objetivo
componentes visuais
botões
cards
abas internas, quando houver
filtros
informações exibidas
ações disponíveis
cores aplicadas
mensagens de sucesso
mensagens de erro
estado vazio
estado de carregamento
comportamento esperado

Dê atenção especial à Tela Agenda.

A Tela Agenda deve reunir:

consulta de agenda
minhas consultas
meus exames
calendário
próximos agendamentos
histórico
cards de consulta
cards de exame
status dos agendamentos
opção de ver detalhes
opção de cancelar
botão Agendar Novo

Wireframe textual das telas

Crie wireframes textuais simples, como se fossem desenhos descritos em texto.

Crie wireframes para:

Acesso
Home
Agenda
Agendar
Instituições e Profissionais
Notificações
Perfil
Gestão

No wireframe da Tela Agenda, organize assim:

Topo:
título “Agenda”
filtro de data
ícone de notificações

Resumo:
próximo compromisso
quantidade de consultas
quantidade de exames

Abas:
Todos
Consultas
Exames
Histórico

Conteúdo:
cards de consultas e exames
data
horário
instituição
profissional ou tipo de exame
status
botão Ver detalhes
botão Cancelar, quando permitido

Ação principal:
botão Agendar Novo

Menu inferior:
Home
Agenda
Agendar
Instituições
Perfil

Fluxos principais do usuário

Descreva os fluxos principais do app de forma clara e objetiva.

Inclua:

Fluxo 1 — Cadastro e login
Fluxo 2 — Consultar agenda
Fluxo 3 — Agendar consulta
Fluxo 4 — Agendar exame
Fluxo 5 — Visualizar consultas e exames na Agenda
Fluxo 6 — Cancelar consulta ou exame
Fluxo 7 — Receber notificação
Fluxo 8 — Editar perfil do usuário
Fluxo 9 — Consultar instituições e profissionais
Fluxo 10 — Administrador ou instituição manter profissionais e agenda

Para cada fluxo, informe:

início
etapas
decisões
resultado final
mensagens exibidas
possíveis erros

Requisitos funcionais

Crie uma tabela completa com os requisitos funcionais.

A tabela deve conter:

ID
nome do requisito
descrição detalhada
ator principal
entradas de dados
processamento do sistema
saída esperada
regras e validações
prioridade
tela onde aparece

Use obrigatoriamente estes requisitos:

RF01 — Manter Usuário
RF02 — Realizar Login
RF03 — Manter Consultas
RF04 — Manter Exames
RF05 — Notificar Usuário
RF06 — Manter Instituição
RF07 — Manter Profissionais
RF08 — Manter Agenda
RF09 — Consultar Agenda

Organize a coluna “tela onde aparece” assim:

RF01 — Acesso e Perfil
RF02 — Acesso
RF03 — Agenda e Agendar
RF04 — Agenda e Agendar
RF05 — Notificações, Home e Agenda
RF06 — Instituições e Profissionais, Gestão
RF07 — Instituições e Profissionais, Gestão
RF08 — Agenda e Gestão
RF09 — Agenda e Agendar

Detalhamento dos requisitos funcionais

Para cada requisito funcional, crie uma seção com:

descrição
objetivo
ator principal
pré-condições
pós-condições
dados necessários
funcionalidades incluídas
validações
regras de negócio relacionadas
mensagens do sistema
exceções
dependências

Detalhe os requisitos de forma suficiente para orientar o desenvolvimento do app.

Histórias de usuário

Crie histórias de usuário no formato:

Como [ator], quero [ação], para [benefício].

Crie pelo menos uma história para cada requisito funcional.

Inclua histórias para:

usuário comum
administrador
instituição
profissional de saúde
responsável pela agenda

Critérios de aceite

Para cada requisito funcional, crie pelo menos 3 critérios de aceite no formato:

Dado que [contexto], quando [ação], então [resultado esperado].

Os critérios devem ser claros, objetivos e testáveis.

Regras de negócio

Crie uma lista organizada de regras de negócio.

Inclua regras como:

o usuário precisa estar logado para agendar consulta ou exame
consultas e exames devem aparecer juntos na Agenda
a Agenda deve permitir filtros por Todos, Consultas, Exames e Histórico
horários ocupados não podem aparecer como disponíveis
cada consulta deve estar vinculada a usuário, profissional, instituição, data e horário
cada exame deve estar vinculado a usuário, instituição, tipo de exame, data e horário
profissionais devem estar vinculados a uma instituição
instituições precisam estar ativas para receber agendamentos
a agenda deve ser atualizada automaticamente após agendamento ou cancelamento
notificações devem ser enviadas antes de consultas e exames
cancelamentos devem liberar o horário na agenda, quando permitido
o app deve evitar duplicidade de agendamentos no mesmo horário
as principais funcionalidades devem ser acessíveis em poucos toques

Requisitos não funcionais

Crie uma tabela com requisitos não funcionais contendo:

ID
categoria
requisito
descrição
critério de medição
requisito funcional relacionado

Inclua requisitos de:

usabilidade
desempenho
segurança
privacidade
LGPD
disponibilidade
compatibilidade mobile
responsividade
clareza visual
experiência do usuário
manutenibilidade
acessibilidade básica
confiabilidade

Backlog do produto usando MoSCoW

Crie um backlog usando a técnica MoSCoW.

Organize em tabela com:

ID
funcionalidade
descrição
prioridade
justificativa
módulo relacionado

Classifique como:

Must Have:
cadastro
login
agenda unificada
agendamento de consulta
agendamento de exame
notificações
instituições e profissionais
gestão de agenda

Should Have:
filtros avançados
histórico completo
preferências de notificação
busca por especialidade

Could Have:
chatbot
geolocalização
integração com calendário do celular
avaliação de profissionais

Won’t Have:
teleconsulta
pagamento online
integração com convênio, caso esteja fora do escopo inicial

Casos de uso

Crie casos de uso para:

cadastrar usuário
realizar login
consultar agenda
agendar consulta
agendar exame
visualizar consultas e exames
cancelar consulta ou exame
receber notificação
manter usuário
manter instituição
manter profissionais
manter agenda

Para cada caso de uso, informe:

nome
ator principal
objetivo
pré-condição
fluxo principal
fluxo alternativo
exceções
pós-condição

Microcopy do app

Crie textos curtos para usar no aplicativo.

Inclua mensagens para:

login realizado com sucesso
erro no login
cadastro concluído
consulta agendada
exame agendado
horário indisponível
consulta cancelada
exame cancelado
nenhum agendamento encontrado
nenhuma consulta encontrada
nenhum exame encontrado
lembrete de consulta
lembrete de exame
erro de conexão
alterações salvas
confirmação antes de cancelar
sessão expirada

Os textos devem ser curtos, humanos, claros e adequados para app mobile de saúde.

Estados da interface

Descreva como o app deve se comportar nos seguintes estados:

carregando
erro
sucesso
lista vazia
sem internet
formulário inválido
horário indisponível
sessão expirada
notificação recebida
agendamento concluído
agendamento cancelado

Funcionalidades por tipo de usuário

Crie uma tabela com os perfis:

usuário comum
administrador
instituição
profissional de saúde
responsável pela agenda

Para cada perfil, informe quais funcionalidades pode acessar.

Estrutura de dados sugerida

Sugira as principais entidades do sistema.

Inclua:

Usuário
Endereço
Instituição
Profissional
Especialidade
Consulta
Exame
Agenda
Horário
Notificação
Acesso/Login

Para cada entidade, liste os principais atributos.

Relacionamentos entre entidades

Explique os relacionamentos principais do sistema.

Inclua exemplos como:

um usuário pode ter várias consultas
um usuário pode ter vários exames
uma instituição pode ter vários profissionais
um profissional pode ter várias agendas
uma agenda pode ter vários horários
uma consulta ocupa um horário
um exame ocupa um horário
uma notificação pode estar relacionada a uma consulta ou exame

Protótipo textual resumido

Descreva a experiência do usuário no app do começo ao fim.

Inclua:

o usuário abre o app
realiza login ou cadastro
acessa a Home
visualiza seu próximo compromisso
entra na Agenda
vê consultas e exames no mesmo lugar
usa a tela Agendar
escolhe consulta ou exame
seleciona data e horário
confirma o agendamento
recebe mensagem de sucesso
acompanha tudo pela Agenda
recebe notificações de lembrete

Também descreva um fluxo resumido para o perfil administrativo usando a Tela Gestão.

Recomendações finais de UX/UI

Finalize com recomendações para deixar o app mais profissional.

Inclua:

manter poucas telas
priorizar funções mais usadas
deixar ações principais visíveis
usar cards para organizar consultas e exames
usar abas internas para evitar telas extras
usar filtros simples
evitar formulários longos
usar feedback visual imediato
manter consistência nas cores
usar ícones reconhecíveis
manter o agendamento em poucos passos
deixar o app fácil de acessar em todos os casos

Conclusão

Finalize explicando como o SaúdeConnect+ pode ser um aplicativo mobile funcional, organizado, moderno e profissional, mantendo poucas telas e agrupando funcionalidades relacionadas para melhorar a experiência do usuário.

Use português do Brasil.

Use linguagem profissional, acadêmica, objetiva e clara.

Não crie muitas telas.

Não transforme cada requisito em uma tela separada.

Agrupe funcionalidades semelhantes.

Priorize facilidade de acesso.

Detalhe bem a UX/UI.

O resultado deve servir como base para documentação do sistema, planejamento do app mobile e criação de protótipo.