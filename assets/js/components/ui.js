window.TiaLari = window.TiaLari || {};
(() => {
  const paths = {
    home: '<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
    paw: '<ellipse cx="7" cy="6" rx="2" ry="3"/><ellipse cx="17" cy="6" rx="2" ry="3"/><ellipse cx="3.5" cy="11" rx="1.5" ry="2.5"/><ellipse cx="20.5" cy="11" rx="1.5" ry="2.5"/><path d="M12 11c-3 0-4 4-6 6-2 3 0 5 3 4l3-1 3 1c3 1 5-1 3-4-2-2-3-6-6-6Z"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    clipboard:
      '<path d="M9 4H5v17h14V4h-4M8 10h8M8 14h8M8 18h5"/><rect x="9" y="2" width="6" height="4" rx="1"/>',
    box: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 9v10M3 8l9 4 9-4M7 5.5l9 5"/>',
    settings:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
    logout: '<path d="M9 4H4v16h5m5-13 5 5-5 5M8 12h12"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  };
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const icon = (name) =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.clipboard}</svg>`;
  function hydrateIcons(scope = document) {
    scope.querySelectorAll("[data-icon]").forEach((node) => {
      node.innerHTML = icon(node.dataset.icon);
    });
  }
  function ensureFeedback() {
    const feedback = document.getElementById("app-feedback");
    if (!feedback || feedback.dataset.ready) return;
    feedback.dataset.ready = "true";
    feedback.innerHTML = `<div class="modal fade" id="app-modal" tabindex="-1" aria-labelledby="app-modal-title" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h2 class="modal-title fs-4" id="app-modal-title"></h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div><div class="modal-body" id="app-modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-bs-dismiss="modal">Entendi</button></div></div></div></div><div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="app-toast" class="toast" role="status" aria-live="polite" aria-atomic="true"><div class="d-flex"><div class="toast-body"></div><button class="btn-close btn-close-white me-2 m-auto" type="button" data-bs-dismiss="toast" aria-label="Fechar"></button></div></div></div>`;
  }
  function modal(title, content) {
    ensureFeedback();
    document.getElementById("app-modal-title").textContent = title;
    document.getElementById("app-modal-body").innerHTML = content;
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("app-modal"),
    ).show();
  }
  function toast(message) {
    ensureFeedback();
    const element = document.getElementById("app-toast");
    element.querySelector(".toast-body").textContent = message;
    bootstrap.Toast.getOrCreateInstance(element, { delay: 3500 }).show();
  }
  function formatDate(dateString) {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
      new Date(`${dateString}T12:00:00`),
    );
  }
  function formatDateLong(dateString) {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(new Date(`${dateString}T12:00:00`));
  }
  function showDataError(error) {
    console.error(error);
    modal(
      "Não foi possível carregar os dados",
      "<p>Abra o projeto por um servidor local, como a extensão <strong>Live Server</strong> do VS Code. Os arquivos JSON não são carregados corretamente quando a página é aberta diretamente pelo protocolo <code>file://</code>.</p>",
    );
  }

  TiaLari.ui = {
    escape,
    icon,
    hydrateIcons,
    modal,
    toast,
    formatDate,
    formatDateLong,
    showDataError,
  };
  ensureFeedback();
  hydrateIcons();
})();
