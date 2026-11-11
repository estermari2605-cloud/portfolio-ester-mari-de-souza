# AUDITORIA DE UTILIZAÇÃO DE INTELIGÊNCIA ARTIFICIAL

Projeto:Conexão Real  
Ferramenta utilizada: Claude  
Finalidade: Apoio na revisão, correção e melhoria dos códigos do projeto e correção de erros de português.



    Experiência 1: Contraste do texto sobre fundos roxos

Prompt
Tenho um site em HTML, CSS e Bootstrap com tema claro e escuro, usando variáveis CSS, no modo escuro, o texto sobre os botões roxos e sobre a seção final fica ilegível, porque a cor roxa muda de tom, revise o código abaixo e corrija o contraste, sem mudar o visual geral do site. Explique cada alteração. (colei o CSS aqui)

    2 Resumo da resposta da IA

A IA devolveu o CSS com uma nova variável, `--on-purple`, responsável por definir a cor do texto sobre fundos roxos.

No tema claro, a variável utiliza branco (`#FFFFFF`) e, no tema escuro, utiliza um roxo bem escuro (`#211A29`).

A variável passou a ser utilizada nos componentes `.btn-main`, `.btn-outline-main`, `.skip-link`, `.theme-button:hover` e `.final-section`.

    3 O que mudou

O texto deixou de ter uma cor fixa e passou a acompanhar o tema.
O contraste foi ajustado para os diferentes fundos.
A manutenção das cores ficou mais simples com o uso de variáveis.

    4 Aprendizado

Cores que dependem do fundo devem ser organizadas em variáveis CSS, evitando problemas de contraste quando o tema é alterado.


    Experiência 2: Componentes do Bootstrap no modo escuro

    1 Prompt

 Meu site usa Bootstrap 5 com um tema escuro feito por variáveis CSS (`data-theme="dark"`), alguns componentes do Bootstrap não acompanham o tema: o ícone do menu hambúrguer some, a seta do select e do painel de perguntas e respostas fica invisível, e os botões mudam de cor ao clicar, corrija isso apenas no CSS, sem editar o HTML. [colei aqui o CSS]

     2 Resumo da resposta da IA

A IA devolveu o CSS com as seguintes correções:

- `.navbar-toggler-icon` recebeu `filter: invert(1)`.
- A seta do `.form-select` foi substituída por um SVG claro, utilizando `--bs-form-select-bg-img`.
- A seta do `.accordion-button::after` recebeu `filter: brightness(0) invert(1)`.
- Foram utilizadas variáveis `--bs-btn-*` para manter as cores dos botões nos estados `:hover`, `:active` e `:focus`.

     3 O que mudou

Os ícones ficaram visíveis no modo escuro.
Os botões mantiveram suas cores durante as interações.
As alterações foram realizadas apenas no CSS, sem modificar o HTML.

     4 Aprendizado

O Bootstrap possui variáveis e estilos próprios, conhecer essas configurações facilita a personalização dos componentes sem precisar alterar toda a estrutura do projeto.



 Experiência 3: Acessibilidade e responsividade

 1 Prompt

 Revise o CSS do meu site pensando em acessibilidade e em telas pequenas, quero navegação por teclado clara, um link “pular para o conteúdo”, respeito a quem prefere menos animação, e layout adaptado para tablet e celular,mantenha o estilo atual e comente o código em português. [colei aqui o CSS]

     2 Resumo da resposta da IA

A IA devolveu o CSS com os seguintes recursos:

- `:focus-visible` com contorno roxo de 3px e contorno claro na seção final.
- `.skip-link` escondida fora da tela, aparecendo quando recebe foco.
- `@media (prefers-reduced-motion: reduce)` para reduzir animações e transições.
- Breakpoints em `991px` e `767px` para adaptar o layout.
- `scroll-padding-top` para evitar que o menu fixo cubra os títulos durante a navegação.

     3 O que mudou

A navegação por teclado ficou mais clara.
O site passou a respeitar a preferência por menos animações.
O layout recebeu ajustes para celulares e tablets.

    4 Aprendizado

A acessibilidade deve ser considerada desde o desenvolvimento, pequenas alterações no CSS podem melhorar bastante a experiência de navegação.



 Experiência 4: Estrutura semântica e acessibilidade do HTML

     1 Prompt

Estou criando uma página em HTML5 com Bootstrap 5 sobre tecnologia e relações humanas, revise o código abaixo com foco em estrutura semântica e acessibilidade use landmarks (`header`, `nav`, `main`, `footer`), uma hierarquia de títulos coerente, `aria-label` onde necessário, link “pular para o conteúdo”, `alt` descritivo na imagem e `lang` correto, explique cada alteração. [colei aqui o HTML]

     2 Resumo da resposta da IA

A IA devolveu o HTML com:

- `lang="pt-BR"` e um `skip-link` direcionado para `#conteudo`.
- Elementos semânticos como `header`, `nav`, `main`, `section` e `footer`.
- Hierarquia de títulos com um `h1`, títulos `h2` nas seções e `h3` nos cards e acordeões.
- Botão do menu com `aria-label`, `aria-expanded` e `aria-controls`.
- Imagem com texto alternativo descritivo, além de `width`, `height` e `fetchpriority`.
- Símbolos decorativos com `aria-hidden="true"`.

    3 O que mudou

A estrutura do HTML ficou mais organizada.
A navegação por leitores de tela recebeu melhorias.
Os elementos decorativos deixaram de ser interpretados como conteúdo.

    4 Aprendizado

    Prompt para correção de erros de português 

Você é um revisor de textos em português do Brasil (pt-BR), revise os textos visíveis ao usuário no código abaixo (HTML, CSS e JavaScript) e corrija apenas erros de português.

O QUE CORRIGIR
Ortografia, acentuação e uso de crase
Concordância verbal e nominal
Pontuação (vírgulas, pontos, dois-pontos)
Regência, colocação pronominal e uso de maiúsculas/minúsculas
Erros de digitação e espaços sobrando

O QUE NÃO MEXER
Tags, atributos, classes, ids, nomes de variáveis, seletores e lógica do código
URLs, nomes próprios, nomes de fontes e títulos de referências em inglês (por exemplo, "State of the Global Workplace")
O tom e o sentido do texto: não reescreva frases que já estão corretas, mesmo que você faria diferente
Não acrescente conteúdo, dados ou citações novas

ONDE PROCURAR
Conteúdo entre tags HTML (títulos, parágrafos, listas, botões, rótulos)
Atributos de texto: alt, aria-label, title, placeholder, content da meta description
Strings dentro do JavaScript (mensagens, resultados do quiz, atividades)
Comentários em português, se houver

FORMATO DA RESPOSTA
1 Primeiro, uma tabela com todas as correções: trecho original | trecho corrigido | motivo (regra ou explicação curta).
2 Depois, o código completo corrigido, sem cortes.
3 Se algo estiver ambíguo (por exemplo, uma escolha de estilo e não um erro), liste em "Dúvidas" em vez de alterar.
4 Se não encontrar erros em um arquivo, diga isso explicitamente.

CÓDIGO PARA REVISAR:
[colei aqui]