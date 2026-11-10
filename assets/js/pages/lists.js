(() => {
  const isPet = document.body.dataset.page === "pets";
  const { escape, icon, modal, showDataError } = TiaLari.ui;
  const search = document.getElementById("search");
  const filter = document.getElementById("status-filter");
  const sort = document.getElementById("sort");
  const container = document.getElementById("records");
  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");

  TiaLari.store.ready
    .then(() => {
      const pets = TiaLari.store.all("pets");
      const clients = TiaLari.store.all("clientes");
      const records = isPet ? pets : clients;
      const rel = TiaLari.store.relation();
      const linkedPets = (client) => rel.petsDoTutor(client.id);
      const tutorName = (pet) =>
        rel.cliente(pet.tutorId)?.name || "Tutor não encontrado";

      function render() {
        const term = normalize(search.value.trim());
        const rows = records
          .filter((record) => {
            const text = isPet
              ? `${record.name} ${tutorName(record)} ${record.breed}`
              : `${record.name} ${record.cpf} ${record.phone} ${record.email}`;
            const matchesSearch = normalize(text).includes(term);
            const matchesFilter =
              !filter.value ||
              (isPet
                ? record.size === filter.value
                : filter.value === "with"
                  ? linkedPets(record).length > 0
                  : linkedPets(record).length === 0);
            return matchesSearch && matchesFilter;
          })
          .sort((a, b) =>
            sort.value === "original"
              ? b.id - a.id
              : a.name.localeCompare(b.name, "pt-BR") *
                (sort.value === "asc" ? 1 : -1),
          );

        document.getElementById("record-count").textContent =
          `${rows.length} ${rows.length === 1 ? "cadastro" : "cadastros"}`;
        document.getElementById("list-summary").textContent =
          `Exibindo ${rows.length} de ${records.length} registros`;
        container.innerHTML = rows.length
          ? rows
              .map((record) => {
                const petsOfClient = isPet ? [] : linkedPets(record);
                const sub = isPet ? record.breed : record.phone;
                const photo = record.photo || "";
                const avatar = photo
                  ? `<img class="record-avatar-photo" src="${escape(photo)}" alt="Foto demonstrativa de ${escape(record.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='inline-flex'"/><span class="record-avatar-fallback" style="display:none">${icon(isPet ? "paw" : "users")}</span>`
                  : `<span class="record-avatar-fallback" style="display:inline-flex">${icon(isPet ? "paw" : "users")}</span>`;
                const relation = isPet
                  ? tutorName(record)
                  : petsOfClient.map((p) => p.name).join(", ") ||
                    "Nenhum pet vinculado";
                return `<div class="col-12 col-md-6 col-xl-4"><article class="card record h-100"><div class="tl-row"><span class="record-icon">${avatar}</span><div><h3>${escape(record.name)}</h3><p class="sub">${escape(sub)}</p></div></div><span class="pill">${isPet ? `Porte ${escape(record.size.toLowerCase())}` : "Cadastro ativo"}</span><div class="relation"><small>${isPet ? "Tutor" : "Pets vinculados"}</small><strong>${escape(relation)}</strong></div><div class="record-footer"><span>${isPet ? "Cuidados e informações" : `${petsOfClient.length} ${petsOfClient.length === 1 ? "pet vinculado" : "pets vinculados"}`}</span><button class="btn btn-ghost btn-arrow" type="button" data-detail="${record.id}">Ver</button></div></article></div>`;
              })
              .join("")
          : '<div class="col-12"><div class="empty-state"><h3>Nenhum cadastro encontrado</h3><p>Tente outro termo ou altere o filtro.</p></div></div>';
      }

      search.addEventListener("input", render);
      [filter, sort].forEach((el) => el.addEventListener("change", render));
      container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-detail]");
        if (!button) return;
        const record = records.find(
          (item) => Number(item.id) === Number(button.dataset.detail),
        );
        const fields = isPet
          ? [
              ["Tutor", tutorName(record)],
              ["Raça", record.breed],
              ["Porte", record.size],
              ["Observações", record.notes || "Nenhuma registrada"],
            ]
          : [
              ["Telefone", record.phone],
              ["CPF", record.cpf || "Não informado"],
              ["E-mail", record.email || "Não informado"],
              ["Endereço", record.address || "Não informado"],
              [
                "Pets",
                linkedPets(record)
                  .map((p) => p.name)
                  .join(", ") || "Nenhum pet vinculado",
              ],
            ];
        modal(
          record.name,
          `<div class="stack">${fields.map(([label, value]) => `<div class="detail-row"><span>${escape(label)}</span><strong class="text-end text-break">${escape(value)}</strong></div>`).join("")}</div>`,
        );
      });
      render();
    })
    .catch(showDataError);
})();
