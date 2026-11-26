# SaúdeConnect+

## Fluxo de agendamento

- O controle único **Voltar** no cabeçalho retorna à etapa anterior em todo o fluxo: localização, serviço, unidade, horário e confirmação. Nas subtelas de localização, ele retorna cidade → estado → opções.
- Cada etapa deve ter hierarquia clara: título da decisão, controle principal e lista de opções. Evite controles duplicados para a mesma navegação.
- Preserve as escolhas anteriores ao voltar; limpe somente os dados que ficam incompatíveis após uma alteração.

## Dados de demonstração

- Mantenha cidades com exames e ao menos uma cidade com atendimento sem exames, para cobrir os dois estados da interface.
- Cada profissional possui disponibilidade semanal própria. Alterações de um profissional não devem mudar a agenda dos demais.
- Eventos de criação, reagendamento e cancelamento devem gerar histórico e avisos adequados para paciente e admin.
- Reagendamento do paciente é uma solicitação: mantenha o status `reagendamento`, mostre o novo horário e o aviso de aguardo ao paciente, e exponha a solicitação ao admin para confirmação. Somente a confirmação do admin muda o status para `confirmado` e notifica o paciente.

## Qualidade e publicação

- Para alterações de interface ou regra, adicione ou atualize um teste de regressão antes da implementação.
- Antes de publicar, execute `npm test`, `npm run build` e `git diff --check`.
- O remoto oficial é `origin` em `https://github.com/saudeconnectofc-eng/saudeconnect.git`; publique na `main` quando o usuário pedir envio.
