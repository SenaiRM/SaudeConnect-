Aja como um desenvolvedor mobile sênior, especialista em UX/UI, QA tester, product designer mobile e arquiteto de navegação para aplicativos de saúde.

Sua tarefa é corrigir e melhorar o aplicativo mobile SaúdeConnect+.

O app já está visualmente bonito, então mantenha a identidade visual atual. Preserve as cores, cards, botões, menu inferior, tipografia, espaçamentos, estilo moderno e aparência geral. Faça apenas os ajustes necessários para melhorar a navegação, a lógica de agendamento, a organização das telas, a experiência do usuário e a funcionalidade do app.

Não refaça o aplicativo do zero. Corrija somente os pontos citados e preserve todas as funcionalidades que já estão funcionando corretamente.

O SaúdeConnect+ é um aplicativo mobile de saúde voltado para pacientes, instituições, profissionais, consultas, exames, notificações e agenda.

O app deve continuar baseado nestes requisitos principais:

RF01 — Manter Usuário
RF02 — Realizar Login
RF03 — Manter Consultas
RF04 — Manter Exames
RF05 — Notificar Usuário
RF06 — Manter Instituição
RF07 — Manter Profissionais
RF08 — Manter Agenda
RF09 — Consultar Agenda

A regra principal é: o app deve ser fácil de acessar em todos os casos. O usuário precisa conseguir encontrar instituições, agendar consulta, agendar exame, visualizar agenda, cancelar agendamento e voltar entre etapas sem se perder.

1. Corrigir seta de voltar em Serviços > Instituições > Agendar nessa instituição

Existe um problema na navegação quando o usuário segue este fluxo:

Serviços

Instituições
Detalhes da Instituição
Agendar nessa instituição

Nessa tela, existe uma seta no topo para voltar, mas ela não está funcionando corretamente.

Corrija para que:

Ao clicar uma vez na seta, o usuário volte para a tela anterior correta.

A seta deve voltar de “Agendar nessa instituição” para a tela imediatamente anterior, mantendo o contexto da instituição selecionada.

A seta não deve travar.

A seta não deve exigir dois cliques.

A seta não deve gerar tela em branco.

A seta não deve duplicar telas na pilha de navegação.

A seta não deve levar para uma tela errada.

A navegação deve funcionar com apenas um toque.

A transição deve ser suave, sem bug visual.

2. Corrigir seta de voltar em Consulta Médica e Exame

Dentro da área “Agendar nessa instituição”, o usuário escolhe entre:

Consulta Médica
Exame

Quando o usuário entra em “Consulta Médica” ou “Exame”, a seta de voltar no topo está com problema. Atualmente precisa clicar duas vezes e na segunda vez buga.

Corrija para o seguinte comportamento:

Se o usuário estiver dentro do fluxo de Consulta Médica, ao clicar uma vez na seta, ele deve voltar para a etapa onde aparecem as opções “Consulta Médica” e “Exame”.

Se o usuário estiver dentro do fluxo de Exame, ao clicar uma vez na seta, ele deve voltar para a etapa onde aparecem as opções “Consulta Médica” e “Exame”.

A seta não deve voltar direto para Serviços.

A seta não deve voltar para Home.

A seta não deve fechar o fluxo inteiro.

A seta deve preservar a instituição selecionada.

A seta deve manter o usuário dentro do contexto de agendamento daquela instituição.

O fluxo correto deve ser:

Serviços

Instituições
Detalhes da Instituição
Agendar nessa instituição
Escolher entre Consulta Médica ou Exame
Fluxo de Consulta Médica ou Fluxo de Exame

Ao voltar de Consulta Médica ou Exame, o usuário deve retornar para:

Agendar nessa instituição
com as opções:
Consulta Médica
Exame

3. Corrigir pilha de navegação e estado das telas

Revise a lógica de navegação do app.

Garanta que cada rota tenha origem e destino claros.

Cada botão de voltar deve ter um destino único, previsível e funcional.

Evite push duplicado da mesma tela.

Evite empilhar a mesma rota repetidas vezes.

Evite resetar a instituição selecionada ao voltar.

Evite perder o tipo de agendamento selecionado sem necessidade.

Ao voltar uma etapa, restaure corretamente o estado anterior da tela.

Ao avançar uma etapa, mantenha o contexto do que o usuário já escolheu.

O usuário sempre deve saber onde está dentro do fluxo.

Depois da correção, nenhum botão de voltar deve exigir dois cliques.

4. Remover aba Profissionais da tela Serviços

Na tela Serviços, não faz sentido existir uma aba principal chamada “Profissionais”.

Profissionais pertencem a uma instituição. Portanto, eles devem aparecer somente dentro do fluxo de uma instituição.

Remova a aba “Profissionais” da tela Serviços.

A tela Serviços deve focar em instituições.

O fluxo correto para encontrar profissionais deve ser:

Serviços

Instituições
Escolher uma instituição
Agendar nessa instituição
Consulta Médica
Escolher especialidade
Ver profissionais disponíveis daquela instituição

Profissionais não devem aparecer como aba principal em Serviços.

Profissionais devem aparecer somente depois que o usuário escolher uma instituição e selecionar Consulta Médica.

5. Remover ou reposicionar aba Especialidades da tela Serviços

A aba “Especialidades” também não faz sentido como aba principal da tela Serviços, porque ela leva o usuário direto para Novo Agendamento e quebra o contexto da instituição.

Remova a aba “Especialidades” da tela Serviços.

A especialidade deve aparecer apenas dentro do fluxo de agendamento de consulta médica.

O fluxo correto deve ser:

Serviços

Instituições
Escolher instituição
Agendar nessa instituição
Consulta Médica
Escolher especialidade
Escolher profissional
Ver horários disponíveis

A especialidade não deve levar diretamente para Novo Agendamento fora do contexto da instituição.

6. Ajustar a tela Serviços

A tela Serviços deve ficar mais simples, limpa, lógica e profissional.

Ela deve conter:

barra de busca no topo
filtros simples
lista de instituições
cards de instituições
botão “Detalhes”
botão “Agendar”

Os filtros podem ser:

cidade
tipo de instituição
clínica
hospital
laboratório
tipo de serviço

Cada card de instituição deve mostrar:

nome da instituição
tipo da instituição
endereço resumido
serviços disponíveis
ícone de localização
ícone de telefone, se fizer sentido
botão principal “Agendar”
botão secundário “Detalhes”

O botão “Agendar” deve ter mais destaque visual.

O botão “Detalhes” deve ter menor destaque.

Evite excesso de informação nos cards.

A tela Serviços deve levar o usuário primeiro para instituições, nunca direto para um agendamento genérico sem contexto.

7. Ajustar tela de detalhes da instituição

Na tela de detalhes da instituição, exiba:

nome da instituição
tipo de instituição
endereço
telefone
horário de funcionamento
serviços oferecidos
especialidades disponíveis, se houver
exames disponíveis, se houver
botão “Agendar nessa instituição”

Melhore a UX/UI desta tela:

O nome da instituição deve estar em destaque.

As informações devem ser organizadas em blocos visuais ou cards.

Use ícones para endereço, telefone, horário e serviços.

O botão “Agendar nessa instituição” deve estar sempre fácil de encontrar.

O usuário deve entender rapidamente o que aquela instituição oferece.

Evite textos longos.

Mantenha a tela limpa e objetiva.

8. Ajustar regra realista de agendamento

O agendamento atual permite que o paciente escolha qualquer dia, mas isso não faz sentido na vida real.

Corrija a lógica para que o paciente só possa escolher datas e horários cadastrados como disponíveis pela instituição, secretária ou responsável pela agenda.

A instituição, clínica, hospital ou laboratório deve controlar a agenda.

O profissional de saúde deve ter dias e horários definidos previamente.

O paciente não pode escolher qualquer data livremente.

Horários ocupados, bloqueados, indisponíveis ou fora da agenda não devem aparecer como disponíveis.

Datas sem disponibilidade devem aparecer bloqueadas, apagadas, desabilitadas ou simplesmente não devem aparecer como opção clicável.

Horários indisponíveis não devem ser exibidos como opção principal.

Se não houver horário disponível, exiba uma mensagem clara:

“Não há horários disponíveis para esta data.”

ou

“Escolha outra data ou outro profissional.”

9. Corrigir fluxo de Consulta Médica

Depois que o usuário clicar em Consulta Médica dentro de uma instituição, o fluxo deve ser:

Escolher especialidade
Escolher profissional daquela instituição
Visualizar dias disponíveis
Escolher horário disponível
Confirmar ou solicitar agendamento

Os profissionais devem aparecer aqui, dentro da instituição, e não na tela Serviços.

Melhore a UX/UI desse fluxo com um indicador de etapas no topo:

Especialidade
Profissional
Data e horário
Confirmação

Durante o fluxo, mantenha um resumo da seleção do usuário, quando possível:

Instituição selecionada
Tipo: Consulta Médica
Especialidade escolhida
Profissional escolhido
Data escolhida
Horário escolhido

Use cards para profissionais.

Cada card de profissional deve mostrar:

nome do profissional
especialidade
registro profissional, se houver
dias disponíveis resumidos
botão “Selecionar”

Na etapa de data e horário:

mostre apenas datas disponíveis
use chips ou botões para horários disponíveis
destaque visualmente o horário selecionado
não exiba horários ocupados como disponíveis
mantenha o botão “Continuar” fixo ou fácil de encontrar

Na confirmação, mostre um resumo completo:

instituição
especialidade
profissional
data
horário
status inicial
observações, se houver

Botões:

Confirmar agendamento
Voltar
Cancelar

10. Corrigir fluxo de Exame

Depois que o usuário clicar em Exame dentro de uma instituição, o fluxo deve ser:

Escolher tipo de exame
Visualizar dias disponíveis
Escolher horário disponível
Confirmar ou solicitar agendamento

Não precisa escolher profissional para exame, a menos que o exame dependa de um profissional específico.

Melhore a UX/UI desse fluxo com um indicador de etapas:

Exame
Data e horário
Confirmação

Use cards ou lista simples para tipos de exame.

Cada exame deve mostrar:

nome do exame
orientações básicas
necessidade de preparo, se houver
tempo estimado, se houver
botão “Selecionar”

Na etapa de data e horário:

mostre apenas datas liberadas pela instituição ou laboratório
use chips para horários disponíveis
não permita escolher datas aleatórias
não exiba horários indisponíveis como disponíveis
mantenha o botão “Continuar” fácil de encontrar

Na confirmação, mostre:

instituição
tipo de exame
data
horário
orientações importantes
status inicial

Botões:

Confirmar agendamento
Voltar
Cancelar

11. Criar status corretos para agendamentos

Use status para deixar o app mais realista.

Os status devem ser:

Pendente de confirmação
Confirmado
Cancelado
Realizado
Indisponível
Reagendamento solicitado

Use badges visuais para os status.

Sugestão de cores:

Confirmado: verde discreto
Pendente de confirmação: amarelo ou bege destacado
Cancelado: vermelho suave
Realizado: cinza neutro
Indisponível: cinza claro
Reagendamento solicitado: laranja suave

Se o app simular confirmação automática, tudo bem, mas o fluxo deve considerar que a instituição, laboratório ou secretária pode confirmar, cancelar ou solicitar reagendamento.

12. Melhorar a Agenda do paciente

A agenda do paciente deve exibir consultas e exames de forma organizada.

Use abas ou filtros:

Todos
Consultas
Exames
Histórico

Na aba Todos, consultas e exames devem aparecer juntos, ordenados por data.

Cada card da agenda deve mostrar:

tipo: consulta ou exame
nome da instituição
profissional, quando for consulta
tipo de exame, quando for exame
data
horário
status
botão “Ver detalhes”
botão “Cancelar”, quando permitido

A agenda deve ser simples, visual e fácil de entender.

Use cards bem espaçados, status visíveis e ações claras.

13. Melhorar tela de confirmação

Antes de concluir qualquer agendamento, exiba uma tela ou modal de confirmação com resumo completo.

Para consulta, mostrar:

instituição
especialidade
profissional
data
horário
status inicial
observações, se houver

Para exame, mostrar:

instituição
tipo de exame
data
horário
orientações de preparo
status inicial

Após confirmar, exiba uma mensagem clara:

“Agendamento solicitado com sucesso.”

ou

“Consulta agendada com sucesso.”

ou

“Exame agendado com sucesso.”

Se o agendamento depender da confirmação da instituição, informe isso ao usuário:

“Aguarde a confirmação da instituição.”

14. Melhorar UX/UI geral do app

Mantenha o app bonito como está, mas refine a experiência para parecer mais profissional.

Aplique as seguintes melhorias:

Use títulos claros em todas as telas.

Use subtítulos curtos explicando a ação principal da tela.

Use botões principais bem destacados.

Use botões secundários com menor destaque.

Mantenha espaçamento confortável entre elementos.

Evite telas carregadas de informação.

Use cards com bordas arredondadas e sombras suaves.

Use ícones consistentes em todo o app.

Use feedback visual quando o usuário selecionar uma opção.

Use mensagens claras após ações importantes.

Use estados vazios bem escritos.

Use loading simples, como skeleton loading ou indicador discreto.

Use modais de confirmação para cancelamentos.

Use bottom sheets para detalhes rápidos, quando fizer sentido.

Use chips para horários disponíveis.

Use badges para status dos agendamentos.

Use uma hierarquia visual clara.

Mantenha consistência de cores, espaçamentos e componentes.

15. Melhorar facilidade de acesso

O app deve ser fácil de acessar em todos os casos.

Garanta que:

o usuário consiga agendar uma consulta rapidamente
o usuário consiga agendar um exame rapidamente
o usuário consiga voltar sem se perder
o usuário consiga ver seus agendamentos facilmente
o usuário consiga cancelar um agendamento sem procurar muito
o usuário consiga encontrar instituições rapidamente
o usuário consiga entender quais horários estão disponíveis
o usuário consiga identificar o status de cada agendamento
o usuário consiga saber em qual etapa do fluxo está
o usuário consiga corrigir escolhas anteriores sem reiniciar tudo

A navegação deve ser previsível.

O usuário não deve precisar adivinhar onde clicar.

As opções devem ter nomes claros.

Evite termos técnicos demais.

16. Melhorar microcopy do app

Use textos curtos, profissionais e amigáveis.

Inclua mensagens como:

“Escolha uma instituição para continuar.”

“Selecione o tipo de atendimento.”

“Agora escolha a especialidade desejada.”

“Estes são os profissionais disponíveis nesta instituição.”

“Escolha uma data disponível.”

“Horários indisponíveis não aparecem para agendamento.”

“Não há horários disponíveis para esta data.”

“Escolha outra data ou outro profissional.”

“Seu agendamento foi solicitado com sucesso.”

“Aguarde a confirmação da instituição.”

“Deseja cancelar este agendamento?”

“Agendamento cancelado com sucesso.”

“Não encontramos instituições com esses filtros.”

“Não foi possível carregar as informações. Tente novamente.”

17. Preservar identidade visual atual

Mantenha a identidade visual atual do app.

Não altere desnecessariamente:

paleta de cores
estilo dos cards
botões
menu inferior
tipografia
layout geral
identidade visual
ícones já utilizados
estrutura visual que já está boa

Apenas refine para melhorar:

clareza
alinhamento
hierarquia visual
espaçamento
contraste
feedback visual
organização dos fluxos
facilidade de uso
realismo do agendamento
navegação entre telas

18. Testes obrigatórios após correção

Após aplicar as correções, valide os fluxos principais.

Teste o fluxo:

Serviços

Instituições
Detalhes da Instituição
Agendar nessa instituição
Consulta Médica
Voltar

O usuário deve voltar para a tela com as opções Consulta Médica e Exame.

Teste o fluxo:

Serviços

Instituições
Detalhes da Instituição
Agendar nessa instituição
Exame
Voltar

O usuário deve voltar para a tela com as opções Consulta Médica e Exame.

Teste o fluxo:

Serviços

Instituições
Detalhes da Instituição
Agendar nessa instituição
Voltar

O usuário deve voltar corretamente para a tela anterior, sem bug.

Teste também:

agendar consulta
agendar exame
cancelar consulta
cancelar exame
visualizar agenda
visualizar detalhes do agendamento
usar filtros de instituições
voltar entre etapas
confirmar agendamento

Garanta que não existam:

rotas quebradas
telas vazias
botões sem ação
cliques duplicados
necessidade de clicar duas vezes para voltar
perda da instituição selecionada
agendamentos em datas aleatórias
horários indisponíveis aparecendo como livres

19. Critérios de aceite da correção

A correção estará pronta quando:

A seta de voltar funcionar com apenas um clique em “Agendar nessa instituição”.

A seta de voltar funcionar com apenas um clique dentro de “Consulta Médica”.

A seta de voltar funcionar com apenas um clique dentro de “Exame”.

Ao voltar de Consulta Médica ou Exame, o usuário retornar para a área onde escolhe entre Consulta Médica e Exame.

A aba Profissionais não aparecer mais como aba principal em Serviços.

A aba Especialidades não aparecer mais como aba principal em Serviços.

Profissionais aparecerem apenas dentro do fluxo de consulta da instituição.

Especialidades aparecerem apenas dentro do fluxo de consulta.

Serviços mostrar instituições de forma clara e objetiva.

O paciente não conseguir escolher qualquer data aleatória.

O paciente só conseguir escolher datas e horários cadastrados como disponíveis.

Consultas dependerem da agenda do profissional.

Exames dependerem da agenda da instituição ou laboratório.

A instituição, secretária ou responsável pela agenda controlar os horários disponíveis.

O fluxo continuar bonito, simples e fácil de acessar.

A interface ficar mais profissional e organizada.

As telas ficarem menos poluídas.

Os botões principais ficarem mais claros.

Os cards ficarem mais informativos.

Os status dos agendamentos ficarem fáceis de entender.

Não existir bug de navegação.

Não existir necessidade de clicar duas vezes para voltar.

O app manter a proposta visual atual.

20. Resultado esperado

Entregue a correção mantendo o visual atual, mas ajustando a lógica para ficar assim:

Serviços mostra instituições.

Dentro da instituição, o usuário escolhe agendar.

Dentro do agendamento da instituição, o usuário escolhe Consulta Médica ou Exame.

Se escolher Consulta Médica, aparecem especialidades, profissionais e horários disponíveis daquele profissional.

Se escolher Exame, aparecem tipos de exame e horários disponíveis da instituição ou laboratório.

A agenda é controlada pela instituição, secretária ou responsável, e não escolhida livremente pelo paciente.

A seta de voltar funciona corretamente em todos os níveis do fluxo.

A UX/UI fica mais clara, bonita, profissional, acessível e fácil de usar.

O app continua simples, moderno, bonito, confiável e adequado para a área da saúde.

Não refaça o app do zero. Corrija, refine e preserve o que já está bom.