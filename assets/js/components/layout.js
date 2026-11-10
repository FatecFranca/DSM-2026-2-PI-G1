(() => {
  const host = document.getElementById("app-sidebar");
  const header = document.getElementById("app-header");
  if (!host || !header) return;
  const page = document.body.dataset.page || "";
  const nav = [
    ["dashboard.html", "home", "Início", "dashboard"],
    ["clientes.html", "users", "Clientes", "clientes"],
    ["pets.html", "paw", "Pets", "pets"],
    ["agendas.html", "calendar", "Agendas", "agendas"],
    ["atendimentos.html", "clipboard", "Atendimentos", "atendimentos"],
    [null, "box", "Pacotes", "pacotes"],
    [null, "box", "Produtos", "produtos"],
    ["usuarios.html", "users", "Usuários", "usuarios"],
  ];
  const related = { "novo-cliente": "clientes", "novo-pet": "pets" };
  const activePage = related[page] || page;
  const navHtml = nav
    .map(([href, iconName, label, id]) =>
      href
        ? `<a href="${href}" class="${activePage === id ? "active" : ""}" ${activePage === id ? 'aria-current="page"' : ""}>${TiaLari.ui.icon(iconName)}${label}</a>`
        : `<button type="button" data-unavailable="${label}">${TiaLari.ui.icon(iconName)}${label}</button>`,
    )
    .join("");

  host.innerHTML = `<aside class="sidebar" id="sidebar-panel"><a class="brand" href="dashboard.html" aria-label="Tia Lari Banho e Tosa — Início"><img src="assets/images/logo.png" width="638" height="637" alt="Tia Lari Banho e Tosa"></a><div class="nav-label">MENU PRINCIPAL<button type="button" class="sidebar-close" aria-label="Fechar menu">${TiaLari.ui.icon("close")}</button></div><nav class="tl-nav" aria-label="Menu principal">${navHtml}</nav><div class="sidebar-bottom"><nav class="tl-nav" aria-label="Configurações"><button type="button" data-unavailable="Configurações">${TiaLari.ui.icon("settings")}Configurações</button></nav><div class="profile"><span class="avatar" aria-hidden="true">TL</span><div><strong>Equipe Tia Lari</strong><small>Atendimento</small></div><a href="login.html" aria-label="Sair">${TiaLari.ui.icon("logout")}</a></div></div></aside>`;

  const breadcrumb = (document.body.dataset.breadcrumb || "Visão geral").split(
    " / ",
  );
  header.innerHTML = `<div class="topline"><button class="icon-btn mobile-toggle" aria-label="Abrir menu" aria-controls="sidebar-panel" aria-expanded="false">${TiaLari.ui.icon("menu")}</button><nav class="tl-breadcrumb" aria-label="Localização"><a href="dashboard.html">Painel</a><span>/</span>${breadcrumb.map((value) => `<span>${TiaLari.ui.escape(value)}</span>`).join("<span>/</span>")}</nav><div class="top-tools"><span class="demo">Dados locais de demonstração</span><button class="icon-btn" aria-label="Notificações" data-notifications>${TiaLari.ui.icon("bell")}</button><span class="avatar" aria-label="Equipe Tia Lari">TL</span></div></div>`;

  const panel = document.getElementById("sidebar-panel");
  const toggle = document.querySelector(".mobile-toggle");
  const media = matchMedia("(max-width:920px)");
  let desktopCollapsed = false;
  function setOpen(open, restoreFocus = false) {
    if (!open && (restoreFocus || panel.contains(document.activeElement)))
      toggle.focus();
    panel.hidden = !open;
    panel.inert = !open;
    panel.classList.toggle("open", media.matches && open);
    document.body.classList.toggle(
      "sidebar-collapsed",
      !media.matches && !open,
    );
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  toggle.addEventListener("click", () => {
    if (!media.matches) desktopCollapsed = !panel.hidden;
    setOpen(panel.hidden);
  });
  panel.querySelector(".sidebar-close").addEventListener("click", () => {
    if (!media.matches) desktopCollapsed = true;
    setOpen(false, true);
  });
  media.addEventListener("change", () =>
    setOpen(!media.matches && !desktopCollapsed),
  );
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !panel.hidden &&
      !document.querySelector(".modal.show")
    )
      setOpen(false, true);
  });
  setOpen(!media.matches);

  host
    .querySelectorAll("[data-unavailable]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        TiaLari.ui.modal(
          button.dataset.unavailable,
          '<p class="mb-0">Este módulo ainda não faz parte do escopo atual do P.I.</p>',
        ),
      ),
    );
  document
    .querySelector("[data-notifications]")
    .addEventListener("click", () =>
      TiaLari.ui.modal(
        "Notificações",
        '<p class="mb-0">Nenhuma nova notificação.</p>',
      ),
    );
})();
