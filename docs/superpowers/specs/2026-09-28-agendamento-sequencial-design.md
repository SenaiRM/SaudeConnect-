# Fluxo sequencial de agendamento

## Objetivo

Transformar o agendamento da SaúdeConnect+ em uma jornada guiada de cinco telas, inspirada na sequência observada no portal de referência, mas com identidade visual e conteúdo próprios. A pessoa escolhe localização, especialidade, unidade, profissional e horário antes de revisar e enviar o pedido.

O modal promocional de teleconsulta não faz parte deste escopo.

## Experiência

O cabeçalho do agendamento exibirá o título da página, ação de voltar e uma barra horizontal com cinco passos:

1. Localização
2. Especialidade
3. Unidade
4. Profissional
5. Confirmar

Cada etapa será uma tela exclusiva. A pessoa só avança depois de escolher ou informar o valor necessário. O resumo das escolhas ficará disponível nas telas de unidade, profissional e confirmação. Alterar uma escolha anterior limpa os dados das etapas posteriores e pede confirmação quando essa alteração descartar uma seleção já feita.

### Etapas

| Etapa | Conteúdo | Saída |
| --- | --- | --- |
| Localização | Estado, cidade, ação de usar a localização do dispositivo e busca manual | cidade e coordenadas opcionais |
| Especialidade | Busca e lista de especialidades disponíveis | especialidade |
| Unidade | Cartões de unidades compatíveis, endereço, distância quando houver coordenadas e especialidades | unidade |
| Profissional | Profissionais da unidade/especialidade, agenda agrupada por data e horários; filtros de datas próximas | profissional, data e horário |
| Confirmar | Resumo completo, informações de contato, edição de cada grupo e confirmação do pedido | agendamento pendente |

Para exames, a etapa de profissional será rotulada como "Horário" e mostrará a agenda da unidade, preservando os cinco passos e a revisão final.

## Arquitetura

`TelaAgendar` continuará sendo o ponto de entrada, mas deixa de renderizar todos os blocos de uma vez. Ela será um controlador do assistente e renderizará um componente de etapa por vez.

Novos módulos propostos:

- `features/agendamento/bookingFlow.ts`: tipos, passo atual, regras de progresso, limpeza das escolhas seguintes e validações.
- `features/agendamento/BookingProgress.tsx`: cabeçalho e indicador das cinco etapas.
- `features/agendamento/steps/`: componentes de localização, especialidade, unidade, agenda e revisão.

Os dados de demonstração existentes continuarão sendo a fonte de especialidades, instituições, profissionais e agendas. A integração com Google Maps ficará separada: a localização do navegador e a distância serão suportadas desde já; o mapa visual só será ativado após a chave e o faturamento do Google Cloud estarem prontos.

## Estado e regras

O rascunho passa a armazenar `cidade`, `latitude`, `longitude`, `tipo`, `especialidadeOuExame`, `instituicaoId`, `profissionalId`, `data` e `horario`.

- Voltar não perde escolhas válidas.
- Mudar localização limpa unidade, profissional, data e horário.
- Mudar especialidade limpa unidade, profissional, data e horário.
- Mudar unidade limpa profissional, data e horário.
- A confirmação cria o pedido com status `pendente`, como hoje.

## Erros e estados vazios

Cada tela tratará ausência de resultados com texto objetivo e opção de voltar/alterar filtros. Se a geolocalização for negada, a busca manual por cidade continua disponível. A aplicação não solicitará localização automaticamente: a pessoa dispara a ação explicitamente.

## Testes e verificação

Serão incluídos testes para:

- os cinco passos e os requisitos para avanço;
- a limpeza de dados após alteração de uma etapa anterior;
- a agenda de consulta e a agenda de exame;
- a criação do pedido somente após revisão completa.

Além dos testes, a versão será validada em navegador local, percorrendo localização, especialidade, unidade, agenda e confirmação.

## Revisão de fidelidade ao vídeo de referência

A primeira implementação tinha as cinco etapas, mas visualmente ainda era um formulário genérico. A revisão aproxima cada tela da referência, mantendo a paleta teal e a marca SaúdeConnect+:

- Cabeçalho em faixa colorida com voltar, título ("Agendar consulta/exame"), fechar e etapas numeradas ligadas por traços; etapas concluídas ganham check verde e podem ser reabertas.
- Painel lateral "Confirme seus dados de contato para o agendamento" ao iniciar, com "Alterar dados pessoais" e "Confirmar e continuar".
- Localização: cartões "Próximo a mim" e "Escolher local"; o segundo abre as subtelas "Selecione o estado" e "Selecione a região/cidade" (trilha Estado / Cidade), com sugestão do endereço cadastrado e "Não encontrei a cidade desejada".
- Especialidade/Exame: busca, índice alfabético, "Mais procurados" em destaque, lista agrupada por letra e "Saber mais" com uma descrição curta.
- Unidade: busca, ordenação por distância, "Localização selecionada" com "Alterar", aviso da rede, cartões com "ver no mapa" e "Agendar", e "Buscar unidades próximas" quando a cidade escolhida não tem unidade.
- Profissional/Horário: busca, "Datas mais próximas", "Filtrar" (período e favoritos), agenda agrupada por dia e favoritos salvos no navegador.
- Confirmar: cartão central com paciente, profissional/exame, unidade, data, hora, endereço, mapa incorporado do Google e "Ver como chegar".
- "Resumo do agendamento" fica à direita no desktop (abaixo do conteúdo no celular) nas etapas 2 a 4.

O mapa usa o link público de incorporação do Google Maps, que não depende da chave; a Maps JavaScript API continua reservada para quando o faturamento estiver ativo. Ao agendar a partir da página de uma unidade, a lista mostra só o que aquela unidade atende.
