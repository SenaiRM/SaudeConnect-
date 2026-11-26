Aja como um desenvolvedor sênior especialista em apps mobile/web, UX/UI, navegação de interfaces, arquitetura de rotas e correção de bugs em aplicativos.

Preciso corrigir dois problemas no meu app de agendamentos, mantendo o mesmo estilo visual das imagens de referência.

Imagens de referência:

[ANEXE AQUI OS PRINTS DO APP]

Contexto do problema:

O app tem uma barra de navegação inferior com os itens:

Home
Agenda
Agendar
Serviços
Perfil

O botão central “Agendar”, com ícone de “+”, não está fazendo sentido como aba principal. Ele parece uma ação, não uma seção fixa do app.

Além disso, na tela “Novo Agendamento”, quando o usuário toca na seta de voltar no topo, o app está voltando sempre para a aba “Serviços”. Isso está errado. A seta precisa voltar para a tela ou aba de onde o usuário realmente veio.

Sua tarefa é corrigir o layout, a navegação e a lógica relacionada a esses problemas.

Correção 1: remover o botão central “Agendar”

Remova completamente o botão central “Agendar” da barra inferior.

A nova barra inferior deve ter apenas quatro abas principais:

Home
Agenda
Serviços
Perfil

Regras obrigatórias:

“Agendar” não deve mais ser uma aba principal.
O botão central com ícone “+” deve ser removido.
Remova também qualquer espaço reservado deixado pelo botão central.
Remova a lógica interna da aba “Agendar”, caso exista.
Remova índice, rota, item escondido, condição ou estado relacionado à aba “Agendar” dentro da navegação inferior.
A tela “Novo Agendamento” deve continuar existindo, mas como tela secundária ou ação, não como aba fixa.
Os quatro itens restantes devem ficar igualmente distribuídos na barra inferior.
Cada item deve ocupar aproximadamente 25% da largura.
Os ícones e textos devem ficar centralizados.
Nenhum botão deve ficar cortado, desalinhado ou com espaçamento estranho.
Não deve sobrar buraco no meio da barra inferior.
A barra inferior deve continuar com visual limpo, moderno e consistente com os prints enviados.

Mantenha o estilo visual atual:

fundo claro;
verde principal;
barra inferior branca;
ícones discretos;
textos pequenos;
aparência minimalista;
estilo profissional;
consistência com o design atual do app.
Correção 2: realocar a ação de agendar

Como o botão “Agendar” será removido da barra inferior, a função de criar um novo agendamento não pode desaparecer.

Realocar essa ação para lugares mais adequados, como:

botão “Novo agendamento” dentro da aba Agenda;
botão “Agendar consulta” dentro da tela de Serviços;
botão “Agendar exame” dentro da tela de Serviços;
botão de ação na Home, se fizer sentido no fluxo atual.

A ação “Novo Agendamento” deve ser acessada a partir das telas corretas, mas não deve aparecer como aba principal na barra inferior.

Correção 3: corrigir a seta de voltar da tela “Novo Agendamento”

Na tela “Novo Agendamento”, existe uma seta de voltar no topo.

Hoje, ao tocar nessa seta, o app volta sempre para “Serviços”. Esse comportamento está errado.

O comportamento correto deve ser:

se o usuário veio da aba Home, ao tocar na seta deve voltar para Home;
se o usuário veio da aba Agenda, ao tocar na seta deve voltar para Agenda;
se o usuário veio da aba Serviços, ao tocar na seta deve voltar para Serviços;
se o usuário veio da aba Perfil, ao tocar na seta deve voltar para Perfil;
se o usuário veio de qualquer outra tela, deve voltar exatamente para a tela anterior;
se não houver tela anterior no histórico, use Agenda como fallback padrão.

Não use navegação fixa para “Serviços”.

Evite qualquer código que force a volta sempre para a aba Serviços.

A seta deve respeitar a origem real de navegação do usuário.

Use a melhor abordagem de acordo com a tecnologia do projeto:

histórico real de navegação;
rota anterior;
parâmetro de origem;
estado global de navegação;
Navigator.pop, router.back, navigation.goBack ou equivalente;
fallback seguro para Agenda quando não houver histórico.
Correção 4: manter aba ativa correta

Ao voltar da tela “Novo Agendamento”, a aba correta precisa continuar selecionada.

Exemplos:

Home → Novo Agendamento → Voltar → Home selecionada
Agenda → Novo Agendamento → Voltar → Agenda selecionada
Serviços → Novo Agendamento → Voltar → Serviços selecionada
Perfil → Novo Agendamento → Voltar → Perfil selecionada

A barra inferior não pode mostrar uma aba errada como ativa depois que o usuário voltar.

Correção 5: revisar a estrutura de navegação

Revise a navegação do app para garantir que:

Home, Agenda, Serviços e Perfil sejam as únicas abas principais;
Novo Agendamento seja uma tela secundária;
a navegação para Novo Agendamento preserve a origem;
o botão voltar use a origem correta;
a navegação funcione em Android, iOS e Web;
o comportamento continue correto depois de atualizar a página no web, se aplicável;
não exista dependência fixa da aba Serviços para voltar.
Testes obrigatórios

Depois de implementar, teste estes fluxos:

Home → Novo Agendamento → Voltar → deve retornar para Home.
Agenda → Novo Agendamento → Voltar → deve retornar para Agenda.
Serviços → Novo Agendamento → Voltar → deve retornar para Serviços.
Perfil → Novo Agendamento → Voltar → deve retornar para Perfil.
Abrir Novo Agendamento diretamente sem origem anterior → Voltar → deve ir para Agenda.
A barra inferior deve mostrar apenas Home, Agenda, Serviços e Perfil.
Os quatro botões devem estar igualmente distribuídos.
O botão central “Agendar” não deve aparecer.
O ícone “+” central não deve aparecer.
A tela Novo Agendamento deve continuar acessível por botões internos.
A aba correta deve ficar marcada como ativa após voltar.
O layout deve funcionar corretamente em mobile e web.
Critérios de aceite

A correção só estará concluída se:

o botão “Agendar” for removido da barra inferior;
o botão “+” central for removido;
a barra inferior tiver apenas quatro abas;
Home, Agenda, Serviços e Perfil estiverem centralizados e bem distribuídos;
não houver espaço vazio no centro da barra;
Novo Agendamento continuar acessível por botões internos;
a seta de voltar respeitar a origem real do usuário;
a seta não voltar sempre para Serviços;
se não houver histórico anterior, voltar para Agenda;
a aba correta continuar selecionada ao retornar;
a solução funcionar em Android, iOS e Web;
o visual continuar fiel às imagens de referência.
Entrega esperada

Faça as alterações necessárias no código.

No final, explique de forma objetiva:

quais arquivos foram alterados;
quais componentes foram removidos;
qual lógica de navegação foi corrigida;
como a tela Novo Agendamento agora identifica a origem;
como testar os fluxos;
se ainda existe algum ponto de atenção.

Não mude o estilo geral do app. Apenas corrija a barra inferior, reorganize os botões restantes e ajuste a navegação da tela Novo Agendamento.