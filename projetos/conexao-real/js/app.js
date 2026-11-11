/* =========================================
   CONEXÃO REAL — FUNCIONALIDADES
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // A instância do gráfico fica em uma variável local.
  // (Não usar window.lonelinessChart: o id do <canvas> já cria uma
  // variável global com esse nome, que aponta para o elemento HTML.)
  let chartInstance = null;


  // =====================================
  // 1. MODO CLARO E ESCURO
  // =====================================

  const THEME_KEY = "conexao-real-theme";
  const themeButton = document.getElementById("themeToggle");

  function applyTheme(theme) {
    const isDark = theme === "dark";

    root.setAttribute("data-theme", isDark ? "dark" : "light");

    if (themeButton) {
      // O texto do botão é fixo; só o estado (aria-pressed) e o ícone mudam.
      themeButton.setAttribute("aria-pressed", String(isDark));

      const icon = themeButton.querySelector("[aria-hidden='true']");
      if (icon) {
        icon.textContent = isDark ? "☀" : "☾";
      }
    }

    updateChartColors();
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);

      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (error) {
      console.warn("Não foi possível recuperar o tema salvo.");
    }

    // Sem preferência salva, segue a configuração do sistema.
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const newTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      applyTheme(newTheme);

      try {
        localStorage.setItem(THEME_KEY, newTheme);
      } catch (error) {
        console.warn("Não foi possível salvar a preferência de tema.");
      }
    });
  }


  // =====================================
  // 2. GRÁFICO COM CHART.JS
  // =====================================

  const chartCanvas = document.getElementById("lonelinessChart");

  // As cores do gráfico vêm das variáveis do CSS,
  // evitando repetir os valores aqui.
  function getChartColors() {
    const styles = getComputedStyle(root);

    return {
      text: styles.getPropertyValue("--text").trim(),
      grid: styles.getPropertyValue("--border").trim()
    };
  }

  function updateChartColors() {
    if (!chartInstance) return;

    const colors = getChartColors();

    chartInstance.options.scales.x.ticks.color = colors.text;
    chartInstance.options.scales.y.ticks.color = colors.text;
    chartInstance.options.scales.y.grid.color = colors.grid;

    chartInstance.update();
  }

  // O tema é aplicado antes de criar o gráfico
  // para que ele já nasça com as cores corretas.
  applyTheme(getInitialTheme());

  if (chartCanvas && typeof Chart !== "undefined") {
    const colors = getChartColors();

    Chart.defaults.font.family = '"DM Sans", sans-serif';

    chartInstance = new Chart(chartCanvas, {
      type: "bar",

      data: {
        labels: ["Remoto", "Híbrido", "Presencial"],

        datasets: [{
          label: "Relatos de solidão",
          data: [25, 21, 16],
          backgroundColor: [
            "#8063A6",
            "#A88CC4",
            "#C7B2DF"
          ],
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 75
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: (item) => `${item.raw}% dos trabalhadores`
            }
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            max: 30,
            ticks: {
              stepSize: 5,
              color: colors.text,
              callback: (value) => value + "%"
            },
            grid: {
              color: colors.grid
            }
          },

          x: {
            ticks: {
              color: colors.text
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  } else if (chartCanvas) {
    const message = document.createElement("p");
    message.textContent =
      "Não foi possível carregar o gráfico. Verifique sua conexão com a internet.";
    chartCanvas.parentElement.appendChild(message);
  }


  // =====================================
  // 3. GERADOR DE ATIVIDADES
  // =====================================

  const generateButton = document.getElementById("generateActivity");
  const activityType = document.getElementById("activityType");
  const activityResult = document.getElementById("activityResult");

  const activities = {
    amigos: [
      {
        title: "Café sem notificações",
        description:
          "Convide um amigo para tomar um café e deixe o celular guardado durante a conversa. Aproveitem o momento para colocar os assuntos em dia."
      },
      {
        title: "Uma pergunta diferente",
        description:
          "Cada pessoa deve fazer uma pergunta que normalmente não faria. A ideia é conhecer melhor as histórias e experiências dos amigos."
      },
      {
        title: "Passeio compartilhado",
        description:
          "Organizem uma caminhada ou um passeio juntos, aproveitando o ambiente e a conversa sem distrações digitais."
      }
    ],

    familia: [
      {
        title: "Momento em família",
        description:
          "Separem um momento para conversar durante uma refeição, sem televisão ou celulares sobre a mesa."
      },
      {
        title: "Histórias e lembranças",
        description:
          "Conversem sobre lembranças especiais da família e compartilhem histórias que talvez nem todos conheçam."
      },
      {
        title: "Atividade em conjunto",
        description:
          "Escolham uma receita, um jogo ou uma atividade para fazer juntos, valorizando o tempo compartilhado."
      }
    ],

    colegas: [
      {
        title: "Pausa para conversar",
        description:
          "Reservem alguns minutos para uma conversa presencial sobre interesses e experiências que vão além das tarefas."
      },
      {
        title: "Troca de experiências",
        description:
          "Cada pessoa pode compartilhar algo que aprendeu recentemente e que gostaria de ensinar aos colegas."
      },
      {
        title: "Ideias em grupo",
        description:
          "Organizem uma conversa presencial para trocar ideias, ouvir diferentes opiniões e construir soluções em conjunto."
      }
    ]
  };

  // Guarda a última ideia de cada categoria para não repetir em seguida.
  const lastIndexByCategory = {};

  if (generateButton && activityType && activityResult) {
    generateButton.addEventListener("click", () => {
      const category = activityType.value;
      const options = activities[category];

      if (!options || options.length === 0) {
        activityResult.textContent =
          "Não encontramos uma atividade para essa opção.";
        return;
      }

      let randomIndex = Math.floor(Math.random() * options.length);

      if (options.length > 1 && randomIndex === lastIndexByCategory[category]) {
        randomIndex = (randomIndex + 1) % options.length;
      }

      lastIndexByCategory[category] = randomIndex;

      const selectedActivity = options[randomIndex];

      activityResult.replaceChildren();

      const title = document.createElement("strong");
      title.textContent = selectedActivity.title;

      const description = document.createElement("p");
      description.textContent = selectedActivity.description;

      activityResult.append(title, description);
    });
  }


  // =====================================
  // 4. QUESTIONÁRIO DE HÁBITOS DIGITAIS
  // =====================================

  const habitsForm = document.getElementById("habitsForm");
  const quizResult = document.getElementById("quizResult");

  if (habitsForm && quizResult) {
    habitsForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!habitsForm.reportValidity()) return;

      const answers = ["q1", "q2", "q3", "q4"].map((id) => {
        return Number(document.getElementById(id).value);
      });

      const score = answers.reduce((total, value) => total + value, 0);

      let title;
      let description;

      if (score <= 2) {
        title = "Você demonstra hábitos equilibrados!";
        description =
          "Suas respostas indicam que você percebe a importância de estar presente durante as interações. Continue valorizando as conversas e os momentos compartilhados.";
      } else if (score <= 5) {
        title = "Vale observar alguns hábitos.";
        description =
          "Algumas situações da sua rotina podem estar dividindo sua atenção. Experimente reservar momentos para conversar sem interrupções.";
      } else {
        title = "Que tal repensar sua relação com as telas?";
        description =
          "Suas respostas indicam que o uso do celular pode estar ocupando bastante espaço na sua rotina. Pequenas pausas digitais podem ajudar a valorizar os momentos presenciais.";
      }

      quizResult.replaceChildren();

      const resultTitle = document.createElement("strong");
      resultTitle.textContent = title;

      const resultText = document.createElement("p");
      resultText.textContent = description;

      const resultScore = document.createElement("p");
      resultScore.className = "small-muted mt-2";
      resultScore.textContent = `Pontuação de reflexão: ${score} de 8.`;

      quizResult.append(resultTitle, resultText, resultScore);

      quizResult.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest"
      });
    });
  }


  // =====================================
  // 5. ANO AUTOMÁTICO NO RODAPÉ
  // =====================================

  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});