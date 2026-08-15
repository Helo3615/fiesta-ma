// État des réponses : { apero: 3, sale: 12, fromage: 0, sucre: 1 }
// En production, cet état serait chargé depuis un backend gratuit
// (ex : Google Apps Script + Google Sheets). En local, on utilise
// localStorage pour la démonstration, avec un état initial vide.
const STORAGE_KEY = "fiesta-ma-counts-v1";

function loadCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCounts();
    return Object.assign(emptyCounts(), JSON.parse(raw));
  } catch (e) {
    return emptyCounts();
  }
}

function saveCounts(counts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch (e) {
    /* localStorage indisponible : on continue sans persistance */
  }
}

function emptyCounts() {
  const counts = {};
  Object.keys(OPTIONS).forEach((key) => (counts[key] = 0));
  return counts;
}

let counts = loadCounts();

function renderOptions() {
  const container = document.getElementById("options-list");
  container.innerHTML = "";

  Object.keys(OPTIONS).forEach((key) => {
    const opt = OPTIONS[key];
    const current = counts[key] || 0;
    const reached = current >= opt.max;

    const wrapper = document.createElement("div");
    wrapper.className = "option" + (reached ? " disabled" : "");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `opt-${key}`;
    input.name = "choix";
    input.value = key;
    input.disabled = reached;

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.className = "option-label";

    const labelText = document.createElement("span");
    labelText.className = "label-text";
    labelText.textContent = `${opt.label} (${opt.max} max)`;

    const count = document.createElement("span");
    count.className = "count";
    count.textContent = `${current}/${opt.max} réponse(s)`;

    label.appendChild(labelText);
    label.appendChild(count);

    // Quand le max est atteint, on explique pourquoi la case est grisée.
    if (reached) {
      const reason = document.createElement("span");
      reason.className = "reason";
      reason.textContent =
        "Cette option n'est plus sélectionnable : le nombre maximum de " +
        "participants a déjà été atteint.";
      label.appendChild(reason);
    }

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  const messageEl = document.getElementById("form-message");
  messageEl.className = "message";
  messageEl.textContent = "";

  const selected = Array.from(
    document.querySelectorAll('input[name="choix"]:checked')
  ).map((el) => el.value);

  if (selected.length === 0) {
    messageEl.className = "message error";
    messageEl.textContent = "Veuillez sélectionner au moins une option.";
    return;
  }

  // Vérifie qu'aucune option sélectionnée n'a déjà atteint son maximum.
  const blocked = selected.filter((key) => (counts[key] || 0) >= OPTIONS[key].max);
  if (blocked.length > 0) {
    messageEl.className = "message error";
    messageEl.textContent =
      "Une option sélectionnée n'est plus disponible. Merci de rafraîchir la page.";
    renderOptions();
    return;
  }

  // Incrémente les compteurs.
  selected.forEach((key) => (counts[key] = (counts[key] || 0) + 1));
  saveCounts(counts);

  messageEl.className = "message success";
  messageEl.textContent = "Merci ! Votre choix a bien été enregistré. 🎉";
  renderOptions();
  document.getElementById("form-fiesta").reset();
}

document.addEventListener("DOMContentLoaded", () => {
  renderOptions();
  document.getElementById("form-fiesta").addEventListener("submit", handleSubmit);
});
