# Portfólio · Ester Mari

Portfólio de Ester Mari, estudante de Engenharia de Software na UNICID, com projetos acadêmicos publicados no GitHub Pages.

## Projetos

| Projeto | Tecnologias | Pasta |
|---|---|---|
| Calculadora de IMC | HTML5, CSS3, JavaScript | `projetos/calculadora-imc/` |
| Astronomia e Exploração Espacial (5 páginas) | HTML5, CSS3, JavaScript, Bootstrap 5 | `projetos/astronomia/` |
| Task Manager | HTML5, CSS3, JavaScript, localStorage | `projetos/task-manager/` |
| Finance Tracker | HTML5, CSS3, JavaScript, SVG, localStorage | `projetos/finance-tracker/` |
| Conexão Real | HTML5, CSS3, Bootstrap, JavaScript | `projetos/conexao-real/` |
| Projeto ERP · Personal Pisos | Modelagem de dados, DER, documentação | `projetos/erp-personal-pisos/` |

### Calculadora de IMC
Calcula o IMC (peso ÷ altura²), valida os dados, exibe mensagens de erro, classifica o resultado (baixo peso a obesidade grau III) e mostra um marcador em uma escala colorida.

### Astronomia e Exploração Espacial
Site responsivo com navbar, carrossel, cards, modais, tabela comparativa dos planetas, accordion de perguntas frequentes e formulário com validação.

## Estrutura

```
index.html            portfólio
css/style.css
img/                  prévias dos projetos
projetos/
  calculadora-imc/    index.html, style.css, script.js
  astronomia/         index, sobre, galeria, dados, contato (.html), css/, js/, img/
```

## Como acessar localmente
Abra `index.html` na raiz no navegador. Bootstrap e as fontes são carregados por CDN, então é preciso internet.

## Publicar no GitHub Pages
1. Crie um repositório e envie o **conteúdo** da pasta `portfolio/` para a raiz.
2. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
3. Acesse `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Personalize
Para adicionar novos projetos, crie uma pasta em `projetos/` com um `index.html` e um card no `index.html` da raiz.
