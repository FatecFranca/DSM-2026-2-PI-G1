(() => {
  const { escape, icon, toast, modal, formatDate, showDataError } = TiaLari.ui;
  const table = document.getElementById("agenda-table");
  const dateFilter = document.getElementById("agenda-date");
  const search = document.getElementById("agenda-search");
  const statusFilter = document.getElementById("agenda-status");
  const form = document.getElementById("agenda-form");
  const error = document.getElementById("agenda-business-error");
  const pad = (n) => String(n).padStart(2, "0");
  const toLocalIso = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = toLocalIso(new Date());
  dateFilter.value = today;
  document.getElementById("schedule-date").value = today;
  const normalize = (v) =>
    String(v ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const statusClass = (s) =>
    s === "Em andamento"
      ? "status-progress"
      : s === "Finalizado"
        ? "status-success"
        : s === "Cancelado"
          ? "status-danger"
          : "";

  TiaLari.store.ready
    .then(() => {
      const rel = () => TiaLari.store.relation();
      const petLabel = (id) => {
        const r = rel();
        const p = r.pet(id);
        const c = p ? r.cliente(p.tutorId) : null;
        return p
          ? `${p.name} — ${c?.name || "Tutor não encontrado"}`
          : "Pet não encontrado";
      };
      const activeUsers = () =>
        TiaLari.store.all("usuarios").filter((u) => u.status === "Ativo");
      const pets = () => TiaLari.store.all("pets");

      pets()
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        .forEach((p) =>
          document
            .getElementById("schedule-pet")
            .add(new Option(petLabel(p.id), p.id)),
        );
      activeUsers()
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        .forEach((u) =>
          document
            .getElementById("schedule-user")
            .add(new Option(`${u.name} — ${u.role}`, u.id)),
        );

      function metrics() {
        const all = TiaLari.store.all("agendas");
        const day = all.filter((a) => a.date === today);
        const cards = [
          ["calendar", "Hoje", day.length, "Agendamentos do dia"],
          [
            "check",
            "Confirmados",
            day.filter((a) => a.status === "Confirmado").length,
            "Confirmados hoje",
          ],
          [
            "clock",
            "Em andamento",
            day.filter((a) => a.status === "Em andamento").length,
            "Serviços em execução",
          ],
          [
            "calendar",
            "Próximos",
            all.filter(
              (a) =>
                a.date > today &&
                !["Cancelado", "Finalizado"].includes(a.status),
            ).length,
            "Agenda futura",
          ],
        ];
        document.getElementById("agenda-metrics").innerHTML = cards
          .map(
            ([i, l, n, m]) =>
              `<article class="card summary-card"><span class="feature-mark">${icon(i)}</span><div><div class="stat-label">${l}</div><div class="stat-num">${n}</div><p class="kpi-meta">${m}</p></div></article>`,
          )
          .join("");
      }
      function render() {
        const term = normalize(search.value);
        const date = dateFilter.value;
        const status = statusFilter.value;
        const r = rel();
        const rows = TiaLari.store
          .all("agendas")
          .filter((a) => {
            const p = r.pet(a.petId),
              c = p ? r.cliente(p.tutorId) : null,
              u = r.usuario(a.responsibleUserId);
            return (
              (!date || a.date === date) &&
              (!status || a.status === status) &&
              (!term ||
                normalize(
                  `${p?.name} ${c?.name} ${a.service} ${u?.name}`,
                ).includes(term))
            );
          })
          .sort((a, b) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
          );
        table.innerHTML = rows.length
          ? rows
              .map((a) => {
                const p = r.pet(a.petId),
                  c = p ? r.cliente(p.tutorId) : null,
                  u = r.usuario(a.responsibleUserId);
                const canStart = ![
                  "Cancelado",
                  "Finalizado",
                  "Em andamento",
                ].includes(a.status);
                return `<tr><td>${formatDate(a.date)}</td><td><strong>${escape(a.time)}</strong></td><td><div class="user-cell"><span class="mini-avatar">${escape((p?.name || "?")[0])}</span><div><strong>${escape(p?.name || "—")}</strong><small>${escape(c?.name || "—")}</small></div></div></td><td>${escape(a.service)}</td><td>${escape(u?.name || "—")}</td><td><span class="status-badge ${statusClass(a.status)}">${escape(a.status)}</span></td><td><div class="table-actions"><button class="btn btn-sm-soft" data-detail="${a.id}">Ver</button>${a.status === "Agendado" ? `<button class="btn btn-sm-soft" data-confirm="${a.id}">Confirmar</button>` : ""}${canStart ? `<button class="btn btn-sm-soft" data-start="${a.id}">Iniciar</button>` : ""}${!["Cancelado", "Finalizado", "Em andamento"].includes(a.status) ? `<button class="btn btn-sm-soft" data-cancel="${a.id}">Cancelar</button>` : ""}</div></td></tr>`;
              })
              .join("")
          : '<tr><td colspan="7" class="empty-state">Nenhum agendamento encontrado para os filtros selecionados.</td></tr>';
        metrics();
      }
      function ensureAttendance(agendaId, status = "Aguardando") {
        let attendance = TiaLari.store
          .all("atendimentos")
          .find((a) => Number(a.agendaId) === Number(agendaId));
        if (!attendance)
          attendance = TiaLari.store.add("atendimentos", {
            agendaId: Number(agendaId),
            startedAt: null,
            finishedAt: null,
            status,
            observations: "",
          });
        return attendance;
      }
      table.addEventListener("click", (e) => {
        const btn = e.target.closest(
          "button[data-detail],button[data-confirm],button[data-start],button[data-cancel]",
        );
        if (!btn) return;
        const id = Number(
          btn.dataset.detail ||
            btn.dataset.confirm ||
            btn.dataset.start ||
            btn.dataset.cancel,
        );
        const a = TiaLari.store.find("agendas", id);
        const r = rel();
        const p = r.pet(a.petId),
          c = p ? r.cliente(p.tutorId) : null,
          u = r.usuario(a.responsibleUserId);
        if (btn.dataset.detail) {
          modal(
            "Detalhes do agendamento",
            `<div class="stack"><div class="detail-row"><span>Pet</span><strong>${escape(p?.name || "—")}</strong></div><div class="detail-row"><span>Tutor</span><strong>${escape(c?.name || "—")}</strong></div><div class="detail-row"><span>Data e hora</span><strong>${formatDate(a.date)} · ${escape(a.time)}</strong></div><div class="detail-row"><span>Serviço</span><strong>${escape(a.service)}</strong></div><div class="detail-row"><span>Responsável</span><strong>${escape(u?.name || "—")}</strong></div><div class="detail-row"><span>Observações</span><strong>${escape(a.notes || "Nenhuma")}</strong></div></div>`,
          );
          return;
        }
        if (btn.dataset.confirm) {
          TiaLari.store.update("agendas", id, { status: "Confirmado" });
          ensureAttendance(id);
          toast("Agendamento confirmado.");
        }
        if (btn.dataset.start) {
          const at = ensureAttendance(id);
          TiaLari.store.update("atendimentos", at.id, {
            status: "Em andamento",
            startedAt: new Date().toISOString(),
          });
          TiaLari.store.update("agendas", id, { status: "Em andamento" });
          toast("Atendimento iniciado.");
        }
        if (btn.dataset.cancel) {
          TiaLari.store.update("agendas", id, { status: "Cancelado" });
          const at = TiaLari.store
            .all("atendimentos")
            .find((x) => Number(x.agendaId) === id);
          if (at && at.status === "Aguardando")
            TiaLari.store.update("atendimentos", at.id, {
              status: "Cancelado",
            });
          toast("Agendamento cancelado.");
        }
        render();
      });
      [dateFilter, statusFilter].forEach((el) =>
        el.addEventListener("change", render),
      );
      search.addEventListener("input", render);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        form.classList.add("was-validated");
        error.hidden = true;
        error.textContent = "";
        if (!form.checkValidity()) return;
        const record = {
          date: form.elements.date.value,
          time: form.elements.time.value,
          petId: Number(form.elements.petId.value),
          responsibleUserId: Number(form.elements.responsibleUserId.value),
          service: form.elements.service.value,
          status: form.elements.status.value,
          notes: form.elements.notes.value.trim(),
        };
        const conflict = TiaLari.store
          .all("agendas")
          .find(
            (a) =>
              a.date === record.date &&
              a.time === record.time &&
              a.status !== "Cancelado" &&
              (Number(a.petId) === record.petId ||
                Number(a.responsibleUserId) === record.responsibleUserId),
          );
        if (conflict) {
          error.hidden = false;
          error.textContent =
            "Conflito de horário: o pet ou o responsável já possui um agendamento nesse mesmo dia e horário.";
          return;
        }
        const user = TiaLari.store.find("usuarios", record.responsibleUserId);
        if (!user || user.status !== "Ativo") {
          error.hidden = false;
          error.textContent = "Selecione um usuário ativo como responsável.";
          return;
        }
        const created = TiaLari.store.add("agendas", record);
        ensureAttendance(created.id);
        bootstrap.Modal.getInstance(
          document.getElementById("agenda-modal"),
        )?.hide();
        form.reset();
        form.classList.remove("was-validated");
        document.getElementById("schedule-date").value = today;
        dateFilter.value = record.date;
        toast("Agendamento criado com sucesso.");
        render();
      });
      render();
    })
    .catch(showDataError);
})();
