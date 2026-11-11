/* ==========================================================
   Finance Tracker — lógica da aplicação
   Receitas e despesas, saldo automático, histórico, filtros
   por período e tipo, e gráfico de gastos por categoria.
   Os valores são guardados em centavos (números inteiros)
   para evitar erros de arredondamento com decimais.
   ========================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'finance-tracker:transactions';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const CATEGORIES = {
    expense: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  };

  const CATEGORY_COLORS = {
    Moradia: '#0f766e',
    Alimentação: '#c2410c',
    Transporte: '#2563eb',
    Saúde: '#be185d',
    Educação: '#7c3aed',
    Lazer: '#b7791f',
    Outros: '#64748b',
  };

  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  /* ---------- Referências do DOM ---------- */

  const form = document.getElementById('transaction-form');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const dateInput = document.getElementById('date');
  const categorySelect = document.getElementById('category');
  const typeInputs = document.querySelectorAll('input[name="type"]');
  const formError = document.getElementById('form-error');

  const monthFilter = document.getElementById('month-filter');
  const balanceLabel = document.getElementById('balance-label');
  const balanceEl = document.getElementById('balance');
  const incomeEl = document.getElementById('total-income');
  const expenseEl = document.getElementById('total-expense');

  const chartEmpty = document.getElementById('chart-empty');
  const chartContent = document.getElementById('chart-content');
  const donutSvg = document.getElementById('donut-svg');
  const donutTotal = document.getElementById('donut-total');
  const legend = document.getElementById('legend');

  const historyList = document.getElementById('history');
  const historyEmpty = document.getElementById('history-empty');
  const typeFilterButtons = document.querySelectorAll('.filter');

  /* ---------- Estado ---------- */

  let transactions = loadTransactions();
  let selectedMonth = 'all';
  let typeFilter = 'all';

  /* ---------- Persistência ---------- */

  function loadTransactions() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.warn('Não foi possível salvar as movimentações.', error);
    }
  }

  /* ---------- Utilitários ---------- */

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function formatMoney(cents) {
    return currency.format(cents / 100);
  }

  function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatMonth(yearMonth) {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function getSelectedType() {
    return document.querySelector('input[name="type"]:checked').value;
  }

  /* ---------- Formulário ---------- */

  function fillCategories() {
    const options = CATEGORIES[getSelectedType()];
    categorySelect.replaceChildren(
      ...options.map((name) => {
        const option = createElement('option', '', name);
        option.value = name;
        return option;
      })
    );
  }

  function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function clearError() {
    formError.hidden = true;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Math.round(parseFloat(amountInput.value) * 100);
    const date = dateInput.value;

    if (!description) return showError('Informe uma descrição para a movimentação.');
    if (!Number.isFinite(amount) || amount <= 0) return showError('Informe um valor maior que zero.');
    if (!date) return showError('Escolha a data da movimentação.');

    transactions.push({
      id: generateId(),
      type: getSelectedType(),
      description,
      amount,
      category: categorySelect.value,
      date,
      createdAt: Date.now(),
    });

    descriptionInput.value = '';
    amountInput.value = '';
    clearError();
    commit();
    descriptionInput.focus();
  }

  /* ---------- Dados derivados ---------- */

  function getPeriodTransactions() {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter((item) => item.date.startsWith(selectedMonth));
  }

  function sumByType(list, type) {
    return list.filter((item) => item.type === type).reduce((total, item) => total + item.amount, 0);
  }

  function getExpensesByCategory(list) {
    const totals = {};
    list.filter((item) => item.type === 'expense').forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  /* ---------- Renderização ---------- */

  function renderMonthFilter() {
    const months = [...new Set(transactions.map((item) => item.date.slice(0, 7)))].sort().reverse();
    if (selectedMonth !== 'all' && !months.includes(selectedMonth)) selectedMonth = 'all';

    const allOption = createElement('option', '', 'Todos os meses');
    allOption.value = 'all';

    const options = months.map((month) => {
      const option = createElement('option', '', formatMonth(month));
      option.value = month;
      return option;
    });

    monthFilter.replaceChildren(allOption, ...options);
    monthFilter.value = selectedMonth;
  }

  function renderSummary(list) {
    const income = sumByType(list, 'income');
    const expense = sumByType(list, 'expense');
    const balance = income - expense;

    balanceLabel.textContent = selectedMonth === 'all' ? 'Saldo total' : 'Saldo do mês';
    balanceEl.textContent = formatMoney(balance);
    balanceEl.classList.toggle('negative', balance < 0);
    incomeEl.textContent = formatMoney(income);
    expenseEl.textContent = formatMoney(expense);
  }

  function renderChart(list) {
    const data = getExpensesByCategory(list);
    const total = data.reduce((sum, item) => sum + item.value, 0);

    chartEmpty.hidden = total > 0;
    chartContent.hidden = total === 0;
    donutSvg.replaceChildren();
    legend.replaceChildren();
    if (total === 0) return;

    donutTotal.textContent = formatMoney(total);

    let accumulated = 0;
    data.forEach((item) => {
      const percent = (item.value / total) * 100;
      const color = CATEGORY_COLORS[item.name] || CATEGORY_COLORS.Outros;

      // Segmento do gráfico de rosca (círculo com comprimento total 100).
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', '21');
      circle.setAttribute('cy', '21');
      circle.setAttribute('r', '15.9155');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-width', '6');
      circle.setAttribute('stroke-dasharray', `${percent} ${100 - percent}`);
      circle.setAttribute('stroke-dashoffset', String(-accumulated));
      donutSvg.append(circle);
      accumulated += percent;

      // Linha da legenda com barra de proporção.
      const row = createElement('li', 'legend-row');
      row.style.setProperty('--c', color);

      const name = createElement('span', 'legend-name');
      name.append(createElement('span', 'legend-dot'), document.createTextNode(item.name));

      const value = createElement('span', 'legend-value', `${formatMoney(item.value)} (${Math.round(percent)}%)`);

      const bar = createElement('span', 'legend-bar');
      const fill = createElement('span');
      fill.style.width = `${percent}%`;
      bar.append(fill);

      row.append(name, value, bar);
      legend.append(row);
    });
  }

  function buildTransactionItem(item) {
    const isIncome = item.type === 'income';

    const li = createElement('li', 'transaction');
    li.dataset.id = item.id;

    const info = createElement('div');
    info.append(
      createElement('p', 'transaction-title', item.description),
      createElement('p', 'transaction-meta', `${item.category} • ${formatDate(item.date)}`)
    );

    const amount = createElement(
      'span',
      `transaction-amount ${isIncome ? 'income' : 'expense'}`,
      `${isIncome ? '+' : '−'} ${formatMoney(item.amount)}`
    );

    const deleteBtn = createElement('button', 'delete-btn', 'Excluir');
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', `Excluir "${item.description}"`);

    li.append(info, amount, deleteBtn);
    return li;
  }

  function renderHistory(list) {
    const visible = list
      .filter((item) => typeFilter === 'all' || item.type === typeFilter)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

    historyList.replaceChildren(...visible.map(buildTransactionItem));
    historyEmpty.hidden = visible.length > 0;
    historyEmpty.textContent = transactions.length === 0
      ? 'Nenhuma movimentação ainda. Cadastre a primeira no formulário.'
      : 'Nenhuma movimentação encontrada com esses filtros.';

    typeFilterButtons.forEach((button) => {
      const active = button.dataset.filter === typeFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function render() {
    renderMonthFilter();
    const list = getPeriodTransactions();
    renderSummary(list);
    renderChart(list);
    renderHistory([...list]);
  }

  function commit() {
    saveTransactions();
    render();
  }

  /* ---------- Eventos ---------- */

  form.addEventListener('submit', handleSubmit);
  typeInputs.forEach((input) => input.addEventListener('change', fillCategories));
  [descriptionInput, amountInput, dateInput].forEach((input) => input.addEventListener('input', clearError));

  monthFilter.addEventListener('change', () => {
    selectedMonth = monthFilter.value;
    render();
  });

  typeFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      typeFilter = button.dataset.filter;
      render();
    });
  });

  historyList.addEventListener('click', (event) => {
    const button = event.target.closest('.delete-btn');
    if (!button) return;

    if (window.confirm('Excluir esta movimentação? Essa ação não pode ser desfeita.')) {
      const id = button.closest('.transaction').dataset.id;
      transactions = transactions.filter((item) => item.id !== id);
      commit();
    }
  });

  /* ---------- Início ---------- */

  dateInput.value = todayString();
  fillCategories();
  render();
})();
