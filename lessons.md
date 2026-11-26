# Lições aprendidas

Registro de erros não triviais, para não repetirmos.

## Comparar ids opcionais com `!==` cria falso-positivo
Em `slotCheck.ts`, a regra "ignore o próprio agendamento ao reagendar" começou como
`agendamento.id !== ignorarAgendamentoId`. Quando os dois são `undefined`, a comparação
dá "são iguais" e **toda** reserva sem id passava batida — o teste de double-booking
pegou isso na hora. Só ignore quando o id foi realmente informado:
`!(ignorarAgendamentoId !== undefined && agendamento.id === ignorarAgendamentoId)`.

## `node --test` exige a extensão `.ts` no import
`import { x } from "./dates"` funciona no Vite, mas quebra com
`ERR_MODULE_NOT_FOUND` quando o arquivo é carregado por `node --experimental-strip-types`.
Arquivos que os testes importam (direta ou indiretamente, como `mockData.ts`) precisam
de `from "./dates.ts"`.

## Os arquivos do projeto misturam CRLF e LF
`App.tsx` e a maioria usa CRLF; `TelaHome.tsx` usa LF. Qualquer script que edite o
código por substituição de texto precisa detectar a quebra de linha do arquivo
(`"\r\n" if "\r\n" in s else "\n"`) antes de montar o texto novo, senão a substituição
simplesmente não encontra o trecho.

## Comentário JSX não cabe dentro de uma expressão `&&`
`{cond && ( {/* comentário */} <div/> )}` é erro de sintaxe. O comentário vai acima
da função ou dentro do elemento, nunca entre o `(` e o elemento.

## Diálogos do Radix "travam" quando o painel do navegador não está pintando
Com a janela minimizada/oculta, a animação de saída fica com `currentTime: 0` para
sempre, o nó não é desmontado e o `<body>` continua com `pointer-events: none` —
o que parece um bug de diálogo preso. Não é: é o ambiente de teste. Para seguir,
dirija a página por `javascript_tool` (`element.click()`) em vez de cliques de mouse.

## A suíte `tests/*.test.mjs` faz regex no código-fonte
Ela não executa React: lê o arquivo e compara com expressões regulares. Qualquer
renomeação quebra testes que ainda passavam. Política adotada: as 10 falhas
pré-existentes (layout antigo de agendamento) são o teto; todo teste que a mudança
tornar obsoleto é reescrito **no mesmo commit** da mudança.

## Editar por substituição de texto mistura CRLF e LF no mesmo arquivo
Depois de alguns scripts de edição, `TelaGestao.tsx` ficou com linhas CRLF e LF
misturadas — e aí `s.split("\r\n")` devolve "linhas" que ainda contêm `\n`, fazendo
a busca seguinte falhar silenciosamente. Antes de editar por linha, normalize:
`s.replace("\r\n","\n").replace("\n","\r\n")`.

## O servidor do Vite pode ficar com um grafo de módulos velho
Depois de reescrever `BookingUI.tsx` inteiro, a recarga a quente passou a acusar
`does not provide an export named 'OptionCard'` e a tela ficou branca — mesmo com
`npm run build` passando e os exports presentes no arquivo. Era o módulo antigo
preso no cache do servidor (a URL trazia `?t=<timestamp>` antigo). Recarregar a
página não resolve: é preciso reiniciar o servidor de desenvolvimento.
