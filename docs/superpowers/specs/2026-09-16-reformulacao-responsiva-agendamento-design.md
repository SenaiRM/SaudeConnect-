# Reformulação responsiva e agendamento do SaúdeConnect+

## Objetivo

Transformar o protótipo atual, centrado em uma moldura fixa de celular, em uma experiência responsiva para notebook e celular. Simplificar o agendamento para que a pessoa encontre e reserve somente horários futuros e disponíveis, preparando o front-end para uma API futura em Node.js com Supabase.

## Escopo desta etapa

- Refazer a estrutura visual de paciente para notebook e celular.
- Substituir o fluxo de telas sequenciais de agendamento por uma tela única, progressiva e orientada por disponibilidade.
- Separar o código do agendamento em componentes e regras menores.
- Manter dados simulados nesta etapa, com formatos adequados para posterior consumo de API.

## Fora do escopo desta etapa

- Criar o back-end, conectar Supabase ou persistir dados.
- Implementar Reagendamento, Modo Fácil e Geolocalização da Sprint 2.
- Refazer a área de gestão/admin.
- Produzir diagramas UML/DER nesta fase.

## Layout responsivo

### Direção visual

As telas de referência são usadas exclusivamente como base de organização: hierarquia, largura útil, distribuição, densidade e agrupamento dos cards. A identidade visual continua sendo a do SaúdeConnect+ definida na Sprint 1.

- cor principal e ações: `#087E8B`;
- variação escura da cor principal: `#065F68`;
- fundo da área de trabalho: `#F4F9FA`;
- cards e menu lateral: `#FFFFFF`;
- texto principal: `#243746`;
- texto secundário: `#607985`;
- superfícies suaves e item ativo: `#DCEFF1`;
- bordas: `#B9D9DD` com transparência quando necessário.

O azul-petróleo não ocupará grandes áreas simultaneamente. Ele será reservado para botões principais, ícones, navegação ativa, indicadores e no máximo um card de destaque por seção. Os demais cards serão brancos, com borda fina, sombra discreta e raio consistente.

### Notebook

- A partir de 1024 px, o aplicativo deixa de usar a moldura de celular.
- Exibe um painel com barra lateral completa e compacta, cabeçalho contextual e área de conteúdo ampla.
- Entre 1024 e 1279 px, a barra lateral mantém ícones e textos em aproximadamente 220 px; em telas maiores, cresce para aproximadamente 260 px.
- A área de conteúdo usa fundo azul muito claro e cards brancos, com largura máxima para não espalhar informações em monitores grandes.
- Cada página começa com contexto, título, descrição curta e ações alinhadas à direita quando existirem.
- Indicadores resumidos aparecem em uma grade compacta; o conteúdo detalhado ocupa cards maiores abaixo.
- Durante o agendamento, apresenta um resumo fixo da escolha em uma coluna lateral.

### Organização das telas

- **Início:** saudação e contexto no cabeçalho; indicadores de consultas, exames e total em cards compactos; próximo compromisso, ações rápidas e lista de próximos agendamentos em uma grade equilibrada.
- **Agenda:** título e filtros no topo; compromissos em cards horizontais com data, instituição, profissional e status claramente separados.
- **Agendamento:** filtros progressivos e resultados disponíveis na área principal; resumo da escolha em card lateral no notebook.
- **Instituições:** pesquisa e filtros no topo; instituições em grade responsiva com informações essenciais e ação clara.
- **Notificações:** resumo e ação no cabeçalho; notificações em lista de cards horizontais, com estados não lido, informativo e confirmado diferenciados sem grandes fundos saturados.
- **Perfil:** dados agrupados por assunto em cards brancos, evitando formulários ou seções excessivamente longos.

### Celular

- Abaixo de 1024 px, mantém navegação inferior.
- Conteúdo em coluna única, botões de toque grandes e texto legível.
- O resumo do agendamento aparece em bloco recolhível antes da confirmação.

## Fluxo de agendamento

1. A pessoa escolhe entre consulta e exame.
2. Para consulta, escolhe especialidade; para exame, escolhe o procedimento.
3. A tela apresenta apenas instituições compatíveis e ativas.
4. Para consulta, apresenta apenas profissionais compatíveis, ativos e com disponibilidade futura.
5. A pessoa escolhe uma data futura e um horário livre.
6. A confirmação mostra o resumo completo e cria o agendamento pendente.

O usuário não é levado a telas vazias. Quando uma combinação não tem vagas, a interface informa isso e permite mudar o filtro anterior. Instituição pré-selecionada permanece explícita e pode ser alterada.

## Estrutura de código

O agendamento será dividido em uma feature com:

- componente de filtros e escolhas;
- componente de lista de disponibilidade;
- componente de resumo;
- regra pura para filtrar disponibilidade futura e excluir horários ocupados;
- tipo único para o rascunho de agendamento.

As telas existentes passam a usar uma casca responsiva compartilhada, sem alterar as regras de domínio do protótipo.

## Critérios de aceite

- Em notebook, a navegação lateral substitui a moldura fixa de 430 px.
- Em 1024 px, os textos do menu continuam visíveis e a área principal não apresenta rolagem horizontal.
- Fundo, cards, textos e destaques utilizam exclusivamente a paleta documentada da Sprint 1.
- A Home não utiliza cabeçalho e card principal grandes simultaneamente na cor principal.
- Cards mantêm alinhamento, espaçamento e raio consistentes nas telas principais.
- Em celular, a barra inferior continua disponível e não cobre o conteúdo.
- Nenhum horário passado ou indisponível é exibido como selecionável.
- Consulta e exame mostram somente opções compatíveis com a escolha anterior.
- A confirmação exige tipo, serviço, instituição, data e horário; consulta também exige profissional.
- O build e os testes automatizados relacionados ao fluxo passam sem erro.

## Evolução posterior

O back-end em Node.js + TypeScript fornecerá os mesmos domínios organizados em módulos: autenticação, usuários, instituições, profissionais, disponibilidade, agendamentos e notificações. A Sprint 2 adicionará Reagendamento, Modo Fácil e Geolocalização sobre essa base.
