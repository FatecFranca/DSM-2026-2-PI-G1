(() => {
  const { escape, icon, formatDateLong, showDataError } = TiaLari.ui;
  const localIso = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const today = localIso(new Date());
  document.getElementById("today-label").textContent = formatDateLong(today);

  const statusClass = (status) =>
    status === "Em andamento"
      ? "status-progress"
      : status === "Finalizado"
        ? "status-success"
        : status === "Cancelado"
          ? "status-danger"
          : "";
  TiaLari.store.ready
    .then(() => {
      const clients = TiaLari.store.all("clientes");
      const pets = TiaLari.store.all("pets");
      const agendas = TiaLari.store.all("agendas");
      const attendances = TiaLari.store.all("atendimentos");
      const rel = TiaLari.store.relation();
      const todays = agendas
        .filter((a) => a.date === today)
        .sort((a, b) => a.time.localeCompare(b.time));
      const inProgress = attendances.filter(
        (a) => a.status === "Em andamento",
      ).length;
      const metrics = [
        ["users", "Tutores", clients.length, "Cadastros ativos"],
        ["paw", "Pets", pets.length, "Pets vinculados"],
        ["calendar", "Agendamentos de hoje", todays.length, "Agenda do dia"],
        ["clipboard", "Em atendimento", inProgress, "Serviços em execução"],
      ];
      document.getElementById("dashboard-metrics").innerHTML = metrics
        .map(
          ([i, l, n, m]) =>
            `<article class="card summary-card"><span class="feature-mark">${icon(i)}</span><div><div class="stat-label">${l}</div><div class="stat-num num">${String(n).padStart(2, "0")}</div><p class="kpi-meta">${m}</p></div></article>`,
        )
        .join("");
      document.getElementById("agenda-subtitle").textContent = todays.length
        ? `${todays.length} compromisso(s) programado(s) para hoje.`
        : "Nenhum compromisso programado para hoje.";
      document.getElementById("today-agenda").innerHTML = todays.length
        ? todays
            .map((a) => {
              const pet = rel.pet(a.petId);
              const client = pet ? rel.cliente(pet.tutorId) : null;
              const user = rel.usuario(a.responsibleUserId);
              return `<tr><td><strong>${escape(a.time)}</strong></td><td><div class="table-avatar"><span class="mini-avatar">${escape((pet?.name || "?")[0])}</span><strong>${escape(pet?.name || "—")}</strong></div></td><td class="muted">${escape(client?.name || "—")}</td><td>${escape(a.service)}</td><td>${escape(user?.name || "—")}</td><td><span class="status-badge ${statusClass(a.status)}">${escape(a.status)}</span></td></tr>`;
            })
            .join("")
        : '<tr><td colspan="6" class="empty-state">Nenhum agendamento para hoje.</td></tr>';
    })
    .catch(showDataError);
})();
