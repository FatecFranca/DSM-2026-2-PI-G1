(() => {
  const form = document.getElementById("login-form");
  const password = document.getElementById("password");
  const toggle = document.getElementById("toggle-password");
  toggle.addEventListener("click", () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(show));
    toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  });
  document.getElementById("forgot-password").addEventListener("click", () => {
    TiaLari.ui.modal(
      "Recuperação de acesso",
      '<p class="mb-0">Em uma versão integrada, esta opção permitirá recuperar o acesso. Neste protótipo não há contas reais e nenhum e-mail será enviado.</p>',
    );
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.elements.identity.value = form.elements.identity.value.trim();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      form.querySelector(":invalid")?.focus();
      return;
    }
    window.location.href = "dashboard.html";
  });
})();
