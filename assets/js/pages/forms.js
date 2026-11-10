(() => {
  const form = document.querySelector(".needs-validation");
  if (!form) return;
  const { toast, showDataError } = TiaLari.ui;
  const cpf = document.getElementById("cpf");
  const phone = document.getElementById("phone");
  const tutor = document.getElementById("tutor");

  function onlyDigits(value) {
    return value.replace(/\D/g, "");
  }
  function validCpf(value) {
    const digits = onlyDigits(value);
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
    for (let length = 9; length < 11; length++) {
      let sum = 0;
      for (let i = 0; i < length; i++)
        sum += Number(digits[i]) * (length + 1 - i);
      const digit = (sum * 10) % 11 === 10 ? 0 : (sum * 10) % 11;
      if (digit !== Number(digits[length])) return false;
    }
    return true;
  }
  function maskCpf(input) {
    const d = onlyDigits(input.value).slice(0, 11);
    input.value = d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  function maskPhone(input) {
    const d = onlyDigits(input.value).slice(0, 11);
    input.value =
      d.length > 10
        ? d.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3")
        : d.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  }
  cpf?.addEventListener("input", () => maskCpf(cpf));
  phone?.addEventListener("input", () => maskPhone(phone));

  TiaLari.store.ready
    .then(() => {
      if (tutor) {
        TiaLari.store
          .all("clientes")
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
          .forEach((client) => tutor.add(new Option(client.name, client.id)));
      }
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        [
          ...form.querySelectorAll(
            'input[type="text"], input[type="email"], textarea',
          ),
        ].forEach((input) => (input.value = input.value.trim()));

        if (cpf) {
          const duplicate = TiaLari.store
            .all("clientes")
            .some(
              (client) =>
                client.cpf && onlyDigits(client.cpf) === onlyDigits(cpf.value),
            );
          cpf.setCustomValidity(
            validCpf(cpf.value) && !duplicate
              ? ""
              : "CPF inválido ou já cadastrado.",
          );
        }
        if (phone)
          phone.setCustomValidity(
            onlyDigits(phone.value).length >= 10 ? "" : "Telefone inválido.",
          );
        form.classList.add("was-validated");
        if (!form.checkValidity()) {
          form.querySelector(":invalid")?.focus();
          return;
        }

        if (form.id === "client-form") {
          const client = TiaLari.store.add("clientes", {
            name: form.elements.name.value,
            cpf: form.elements.cpf.value,
            phone: form.elements.phone.value,
            email: form.elements.email.value,
            address: form.elements.address.value,
          });
          TiaLari.store.add("pets", {
            name: form.elements.petName.value,
            breed: form.elements.breed.value,
            size: form.elements.size.value,
            tutorId: client.id,
            notes: form.elements.notes.value,
          });
          toast("Tutor e primeiro pet cadastrados com sucesso.");
          setTimeout(() => (location.href = "clientes.html"), 350);
        } else {
          TiaLari.store.add("pets", {
            name: form.elements.name.value,
            breed: form.elements.breed.value,
            size: form.elements.size.value,
            tutorId: Number(form.elements.tutor.value),
            notes: form.elements.notes.value,
          });
          toast("Pet cadastrado com sucesso.");
          setTimeout(() => (location.href = "pets.html"), 350);
        }
      });
    })
    .catch(showDataError);
})();
