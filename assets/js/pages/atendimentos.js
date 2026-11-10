(() => {
  const { escape, icon, toast, modal, formatDate, showDataError } = TiaLari.ui;
  const table = document.getElementById("attendance-table");
  const search = document.getElementById("attendance-search");
  const statusFilter = document.getElementById("attendance-status");
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
      function context(item) {
        const r = TiaLari.store.relation();
        const ag = r.agenda(item.agendaId);
        const p = ag ? r.pet(ag.petId) : null;
        const c = p ? r.cliente(p.tutorId) : null;
        const u = ag ? r.usuario(ag.responsibleUserId) : null;
        return { ag, p, c, u };
      }
      function metrics() {
        const list = TiaLari.store
          .all("atendimentos")
          .filter((a) => a.status !== "Cancelado");
        const cards = [
          ["clipboard", "Atendimentos", list.length, "Registros criados"],
          [
            "clock",
            "Aguardando",
            list.filter((a) => a.status === "Aguardando").length,
            "Ainda não iniciados",
          ],
          [
            "play",
            "Em andamento",
            list.filter((a) => a.status === "Em andamento").length,
            "Em execução",
          ],
          [
            "check",
            "Finalizados",
            list.filter((a) => a.status === "Finalizado").length,
            "Serviços concluídos",
          ],
        ];
        document.getElementById("attendance-metrics").innerHTML = cards
          .map(
            ([i, l, n, m]) =>
              `<article class="card summary-card"><span class="feature-mark">${icon(i)}</span><div><div class="stat-label">${l}</div><div class="stat-num">${n}</div><p class="kpi-meta">${m}</p></div></article>`,
          )
          .join("");
      }
      function render() {
        const term = normalize(search.value),
          status = statusFilter.value;
        const rows = TiaLari.store
          .all("atendimentos")
          .filter((a) => a.status !== "Cancelado")
          .filter((a) => {
            const { ag, p, c, u } = context(a);
            return (
              (!status || a.status === status) &&
              (!term ||
                normalize(
                  `${p?.name} ${c?.name} ${ag?.service} ${u?.name}`,
                ).includes(term))
            );
          })
          .sort((a, b) => {
            const aa = context(a).ag,
              bb = context(b).ag;
            return `${bb?.date} ${bb?.time}`.localeCompare(
              `${aa?.date} ${aa?.time}`,
            );
          });
        table.innerHTML = rows.length
          ? rows
              .map((a) => {
                const { ag, p, c, u } = context(a);
                return `<tr><td><strong>${formatDate(ag?.date)}</strong><br><small class="muted">${escape(ag?.time || "—")}</small></td><td><div class="user-cell"><span class="mini-avatar">${escape((p?.name || "?")[0])}</span><div><strong>${escape(p?.name || "—")}</strong><small>${escape(c?.name || "—")}</small></div></div></td><td>${escape(ag?.service || "—")}</td><td>${escape(u?.name || "—")}</td><td><span class="status-badge ${statusClass(a.status)}">${escape(a.status)}</span></td><td><div class="table-actions"><button class="btn btn-sm-soft" data-detail="${a.id}">Ver</button>${a.status === "Aguardando" ? `<button class="btn btn-sm-soft" data-start="${a.id}">${icon("play")}Iniciar</button>` : ""}${a.status === "Em andamento" ? `<button class="btn btn-sm-soft" data-finish="${a.id}">${icon("check")}Finalizar</button>` : ""}</div></td></tr>`;
              })
              .join("")
          : '<tr><td colspan="6" class="empty-state">Nenhum atendimento encontrado.</td></tr>';
        metrics();
      }
      [statusFilter].forEach((el) => el.addEventListener("change", render));
      search.addEventListener("input", render);
      table.addEventListener("click", (e) => {
        const btn = e.target.closest(
          "button[data-detail],button[data-start],button[data-finish]",
        );
        if (!btn) return;
        const id = Number(
          btn.dataset.detail || btn.dataset.start || btn.dataset.finish,
        );
        const a = TiaLari.store.find("atendimentos", id);
        const { ag, p, c, u } = context(a);
        if (btn.dataset.detail) {
          modal(
            `Atendimento de ${p?.name || "pet"}`,
            `<div class="stack"><div class="detail-row"><span>Tutor</span><strong>${escape(c?.name || "—")}</strong></div><div class="detail-row"><span>Serviço</span><strong>${escape(ag?.service || "—")}</strong></div><div class="detail-row"><span>Responsável</span><strong>${escape(u?.name || "—")}</strong></div><div class="detail-row"><span>Início</span><strong>${a.startedAt ? new Date(a.startedAt).toLocaleString("pt-BR") : "Não iniciado"}</strong></div><div class="detail-row"><span>Fim</span><strong>${a.finishedAt ? new Date(a.finishedAt).toLocaleString("pt-BR") : "—"}</strong></div><div class="detail-row"><span>Observações</span><strong>${escape(a.observations || "Nenhuma")}</strong></div></div>`,
          );
          return;
        }
        if (btn.dataset.start) {
          if (ag?.status === "Cancelado") {
            modal(
              "Atendimento indisponível",
              "<p>Um agendamento cancelado não pode ser iniciado.</p>",
            );
            return;
          }
          TiaLari.store.update("atendimentos", id, {
            status: "Em andamento",
            startedAt: new Date().toISOString(),
          });
          if (ag)
            TiaLari.store.update("agendas", ag.id, { status: "Em andamento" });
          toast("Atendimento iniciado.");
        }
        if (btn.dataset.finish) {
          TiaLari.store.update("atendimentos", id, {
            status: "Finalizado",
            finishedAt: new Date().toISOString(),
          });
          if (ag)
            TiaLari.store.update("agendas", ag.id, { status: "Finalizado" });
          toast("Atendimento finalizado.");
        }
        render();
      });
      render();
    })
    .catch(showDataError);
})();
