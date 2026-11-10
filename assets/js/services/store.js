window.TiaLari = window.TiaLari || {};
(() => {
  const collections = [
    "clientes",
    "pets",
    "usuarios",
    "agendas",
    "atendimentos",
  ];
  const cache = {};
  const key = (name) => `tia-lari:v2:${name}`;

  // Atualiza apenas retratos dos registros demonstrativos conhecidos.
  // Mantém outros cadastros já feitos no navegador.
  const photos = {
    clientes: {"Mariana Silva": "assets/images/tutores/tutor-6.jpg", "Carlos Almeida": "assets/images/tutores/tutor-1.jpg", "Ana Costa": "assets/images/tutores/tutor-4.jpg", "Fernanda Lima": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&h=180&fit=crop", "Paulo Roberto": "assets/images/tutores/tutor-3.jpg", "Juliana Rocha": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=180&h=180&fit=crop"},
    usuarios: {"Larissa Martins": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&h=180&fit=crop", "Camila Nunes": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=180&h=180&fit=crop", "Rafael Souza": "assets/images/funcionarios/rafael.jpg", "Bianca Melo": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=180&h=180&fit=crop"},
    pets: {"Luna": "https://images.unsplash.com/photo-1588178393136-4b0950f78c38?w=180&h=180&fit=crop", "Thor": "https://images.unsplash.com/photo-1738001525610-fca097d68b1c?w=180&h=180&fit=crop", "Mel": "https://www.petpetin.com/images/cat-category.jpg", "Bento": "https://images.unsplash.com/photo-1726079424751-d92845e1be08?w=180&h=180&fit=crop", "Nina": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=180&h=180&fit=crop", "Toby": "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=180&h=180&fit=crop"},
  };
  function syncPhotos(name, records) {
    if (!Array.isArray(records)) return records;
    const base = photos[name] || {};
    let changed = false;
    const mapped = records.map((record) => {
      if (record.id >= 1 && record.id <= 6 && base[record.name] && record.photo !== base[record.name]) {
        changed = true;
        return { ...record, photo: base[record.name] };
      }
      return record;
    });
    if (changed) localStorage.setItem(key(name), JSON.stringify(mapped));
    return mapped;
  }

  async function loadCollection(name) {
    const saved = localStorage.getItem(key(name));
    if (saved) {
      try {
        return syncPhotos(name, JSON.parse(saved));
      } catch (_) {
        localStorage.removeItem(key(name));
      }
    }
    const response = await fetch(`assets/json/${name}.json`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Não foi possível carregar ${name}.json`);
    const data = await response.json();
    localStorage.setItem(key(name), JSON.stringify(data));
    return syncPhotos(name, data);
  }

  const ready = Promise.all(
    collections.map(async (name) => {
      cache[name] = await loadCollection(name);
    }),
  ).then(() => cache);

  function persist(name) {
    localStorage.setItem(key(name), JSON.stringify(cache[name] || []));
  }

  function all(name) {
    return [...(cache[name] || [])];
  }
  function find(name, id) {
    return (cache[name] || []).find((item) => Number(item.id) === Number(id));
  }
  function add(name, record) {
    const list = cache[name];
    if (!list) throw new Error(`Coleção ${name} não carregada.`);
    const id =
      list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    const created = { ...record, id };
    list.push(created);
    persist(name);
    return created;
  }
  function update(name, id, changes) {
    const list = cache[name];
    const index = list.findIndex((item) => Number(item.id) === Number(id));
    if (index < 0) return null;
    list[index] = { ...list[index], ...changes, id: list[index].id };
    persist(name);
    return list[index];
  }
  function reset() {
    collections.forEach((name) => localStorage.removeItem(key(name)));
    location.reload();
  }

  function relation() {
    const clientes = cache.clientes || [];
    const pets = cache.pets || [];
    const usuarios = cache.usuarios || [];
    const agendas = cache.agendas || [];
    return {
      cliente: (id) => clientes.find((item) => Number(item.id) === Number(id)),
      pet: (id) => pets.find((item) => Number(item.id) === Number(id)),
      usuario: (id) => usuarios.find((item) => Number(item.id) === Number(id)),
      agenda: (id) => agendas.find((item) => Number(item.id) === Number(id)),
      petsDoTutor: (tutorId) =>
        pets.filter((item) => Number(item.tutorId) === Number(tutorId)),
    };
  }

  TiaLari.store = { ready, all, find, add, update, reset, relation };
})();
