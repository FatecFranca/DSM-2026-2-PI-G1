(() => {
  const { escape, icon, toast, modal, showDataError } = TiaLari.ui;
  const table = document.getElementById("users-table");
  const search = document.getElementById("user-search");
  const roleFilter = document.getElementById("user-role");
  const statusFilter = document.getElementById("user-status");
  const form = document.getElementById("user-form");
  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  TiaLari.store.ready
    .then(() => {
      function users() {
        return TiaLari.store.all("usuarios");
      }
      function metrics() {
        const list = users();
        const cards = [
          ["users", "Usuários", list.length, "Total cadastrado"],
          [
            "check",
            "Ativos",
            list.filter((u) => u.status === "Ativo").length,
            "Podem operar o sistema",
          ],
          [
            "settings",
            "Administradores",
            list.filter(
              (u) => u.role === "Administrador" && u.status === "Ativo",
            ).length,
            "Acesso administrativo",
          ],
          [
            "users",
            "Inativos",
            list.filter((u) => u.status === "Inativo").length,
            "Sem atribuição em agenda",
          ],
        ];
        document.getElementById("user-metrics").innerHTML = cards
          .map(
            ([i, l, n, m]) =>
              `<article class="card summary-card"><span class="feature-mark">${icon(i)}</span><div><div class="stat-label">${l}</div><div class="stat-num">${n}</div><p class="kpi-meta">${m}</p></div></article>`,
          )
          .join("");
      }
      function render() {
        const term = normalize(search.value);
        const role = roleFilter.value;
        const status = statusFilter.value;
        const rows = users().filter(
          (u) =>
            (!term || normalize(`${u.name} ${u.email}`).includes(term)) &&
            (!role || u.role === role) &&
            (!status || u.status === status),
        );
        table.innerHTML = rows.length
          ? rows
              .map(
                (u) =>
                  `<tr><td><div class="user-cell"><span class="user-avatar">${u.photo ? `<img class="staff-avatar-photo" src="${escape(u.photo)}" alt="Foto demonstrativa de ${escape(u.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'"/>` : escape(u.name.split(" ").map(s=>s[0]).slice(0,2).join(""))}</span><div><strong>${escape(u.name)}</strong><small>${escape(u.email)}</small></div></div></td><td>${escape(u.role)}</td><td>${escape(u.phone)}</td><td><span class="status-badge ${u.status === "Ativo" ? "status-success" : "status-danger"}">${escape(u.status)}</span></td><td><div class="table-actions"><button class="btn btn-sm-soft" data-detail="${u.id}">Detalhes</button><button class="btn btn-sm-soft" data-toggle="${u.id}">${u.status === "Ativo" ? "Inativar" : "Ativar"}</button></div></td></tr>`,
              )
              .join("")
          : '<tr><td colspan="5" class="empty-state">Nenhum usuário encontrado.</td></tr>';
        metrics();
      }
      [search, roleFilter, statusFilter].forEach((el) =>
        el.addEventListener(el === search ? "input" : "change", render),
      );
      table.addEventListener("click", (event) => {
        const detail = event.target.closest("[data-detail]");
        if (detail) {
          const u = TiaLari.store.find("usuarios", detail.dataset.detail);
          modal(
            u.name,
            `<div class="stack"><div class="detail-row"><span>E-mail</span><strong>${escape(u.email)}</strong></div><div class="detail-row"><span>Telefone</span><strong>${escape(u.phone)}</strong></div><div class="detail-row"><span>Função</span><strong>${escape(u.role)}</strong></div><div class="detail-row"><span>Status</span><strong>${escape(u.status)}</strong></div></div>`,
          );
          return;
        }
        const toggle = event.target.closest("[data-toggle]");
        if (!toggle) return;
        const u = TiaLari.store.find("usuarios", toggle.dataset.toggle);
        const newStatus = u.status === "Ativo" ? "Inativo" : "Ativo";
        if (newStatus === "Inativo") {
          const hasFuture = TiaLari.store
            .all("agendas")
            .some(
              (a) =>
                Number(a.responsibleUserId) === Number(u.id) &&
                !["Finalizado", "Cancelado"].includes(a.status),
            );
          if (hasFuture) {
            modal(
              "Usuário possui agenda vinculada",
              '<p class="mb-0">Reatribua ou finalize os agendamentos pendentes antes de inativar este usuário.</p>',
            );
            return;
          }
        }
        TiaLari.store.update("usuarios", u.id, { status: newStatus });
        toast(`Usuário ${newStatus.toLowerCase()}.`);
        render();
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.classList.add("was-validated");
        const email = form.elements.email.value.trim().toLowerCase();
        const emailInput = document.getElementById("user-email");
        emailInput.setCustomValidity(
          users().some((u) => u.email.toLowerCase() === email)
            ? "E-mail já cadastrado."
            : "",
        );
        if (!form.checkValidity()) {
          form.querySelector(":invalid")?.focus();
          return;
        }
        TiaLari.store.add("usuarios", {
          name: form.elements.name.value.trim(),
          email,
          phone: form.elements.phone.value.trim(),
          role: form.elements.role.value,
          status: "Ativo",
        });
        bootstrap.Modal.getInstance(
          document.getElementById("user-modal"),
        )?.hide();
        form.reset();
        form.classList.remove("was-validated");
        emailInput.setCustomValidity("");
        toast("Usuário cadastrado com sucesso.");
        render();
      });
      render();
    })
    .catch(showDataError);
})();
