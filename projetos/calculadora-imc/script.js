"use strict";
const faixas = [
  { nome: "Baixo peso", cor: "#bae6fd", dica: "Procure um profissional de saúde para avaliar sua alimentação." },
  { nome: "Peso normal", cor: "#bbf7d0", dica: "Mantenha hábitos saudáveis: alimentação equilibrada e atividade física." },
  { nome: "Sobrepeso", cor: "#fde68a", dica: "Pequenos ajustes na rotina já ajudam. Considere buscar orientação profissional." },
  { nome: "Obesidade grau I", cor: "#fed7aa", dica: "Recomenda-se acompanhamento com médico ou nutricionista." },
  { nome: "Obesidade grau II", cor: "#fecaca", dica: "Procure acompanhamento médico para avaliar o seu caso." },
  { nome: "Obesidade grau III", cor: "#fca5a5", dica: "Procure acompanhamento médico o quanto antes." }
];
const form = document.getElementById("form-imc");
const pesoEl = document.getElementById("peso");
const alturaEl = document.getElementById("altura");
const resultado = document.getElementById("resultado");

function lerNumero(texto) {
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "" || !/^\d+(\.\d+)?$/.test(limpo)) return NaN;
  return parseFloat(limpo);
}
function mostrarErro(campo, id, msg) {
  document.getElementById(id).textContent = msg;
  campo.classList.toggle("invalido", msg !== "");
}
function validar() {
  const peso = lerNumero(pesoEl.value);
  const altura = lerNumero(alturaEl.value);
  let ok = true;
  let msgPeso = "", msgAltura = "";
  if (pesoEl.value.trim() === "") msgPeso = "Informe o peso em kg.";
  else if (isNaN(peso)) msgPeso = "Use apenas números. Exemplo: 68,5.";
  else if (peso < 2 || peso > 500) msgPeso = "O peso deve estar entre 2 e 500 kg.";
  if (alturaEl.value.trim() === "") msgAltura = "Informe a altura em metros.";
  else if (isNaN(altura)) msgAltura = "Use apenas números. Exemplo: 1,65.";
  else if (altura < 0.5 || altura > 2.5) msgAltura = "A altura deve estar entre 0,5 e 2,5 metros.";
  mostrarErro(pesoEl, "erro-peso", msgPeso);
  mostrarErro(alturaEl, "erro-altura", msgAltura);
  ok = msgPeso === "" && msgAltura === "";
  return ok ? { peso, altura } : null;
}
function indiceFaixa(imc) {
  if (imc < 18.5) return 0;
  if (imc < 25) return 1;
  if (imc < 30) return 2;
  if (imc < 35) return 3;
  if (imc < 40) return 4;
  return 5;
}
function posicaoMarcador(imc) {
  const min = 15, max = 45;
  return Math.min(100, Math.max(0, ((imc - min) / (max - min)) * 100));
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const dados = validar();
  if (!dados) { resultado.hidden = true; return; }
  const imc = dados.peso / (dados.altura * dados.altura);
  const i = indiceFaixa(Math.round(imc * 10) / 10);
  const faixa = faixas[i];
  document.getElementById("valor").textContent = imc.toFixed(1).replace(".", ",");
  const classe = document.getElementById("classe");
  classe.textContent = faixa.nome;
  classe.style.setProperty("--cor", faixa.cor);
  document.getElementById("dica").textContent = faixa.dica;
  document.getElementById("marcador").style.left = posicaoMarcador(imc) + "%";
  document.querySelectorAll("tbody tr").forEach(function (tr) {
    tr.classList.toggle("ativa", Number(tr.dataset.faixa) === i);
  });
  resultado.hidden = false;
});
document.getElementById("limpar").addEventListener("click", function () {
  form.reset();
  mostrarErro(pesoEl, "erro-peso", "");
  mostrarErro(alturaEl, "erro-altura", "");
  resultado.hidden = true;
  document.querySelectorAll("tbody tr").forEach(function (tr) { tr.classList.remove("ativa"); });
  pesoEl.focus();
});
