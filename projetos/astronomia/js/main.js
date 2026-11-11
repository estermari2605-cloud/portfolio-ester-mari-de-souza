"use strict";
// Validação do formulário de contato (Bootstrap) e mensagem de sucesso
var form = document.getElementById("form-contato");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var sucesso = document.getElementById("sucesso");
    if (!form.checkValidity()) {
      e.stopPropagation();
      sucesso.classList.add("d-none");
      form.classList.add("was-validated");
      var primeiro = form.querySelector(":invalid");
      if (primeiro) primeiro.focus();
      return;
    }
    form.reset();
    form.classList.remove("was-validated");
    sucesso.classList.remove("d-none");
    sucesso.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
