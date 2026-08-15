// Initialisation de Firebase.
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Collection Firestore : un document par option, ex:
//   collection "counts" / doc "apero" -> { count: 3 }
let counts = emptyCounts();

function emptyCounts() {
  const counts = {};
  Object.keys(OPTIONS).forEach((key) => (counts[key] = 0));
  return counts;
}

// Abonnement temps réel aux compteurs : dès qu'un participant coche une
// option ailleurs, l'affichage se met à jour pour tout le monde.
function subscribeCounts() {
  Object.keys(OPTIONS).forEach((key) => {
    db.collection("counts")
      .doc(key)
      .onSnapshot(
        (doc) => {
          counts[key] = doc.exists ? doc.data().count || 0 : 0;
          renderOptions();
        },
        (err) => {
          console.error("Erreur écoute compteurs:", err);
        }
      );
  });
}

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

// Incrémentation atomique en base avec contrôle du max côté serveur via
// une transaction, pour éviter de dépasser le maximum si deux participants
// valident en même temps.
async function incrementCount(key) {
  const ref = db.collection("counts").doc(key);
  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = doc.exists ? doc.data().count || 0 : 0;
    if (current >= OPTIONS[key].max) {
      throw new Error("MAX_REACHED");
    }
    tx.set(ref, { count: current + 1 });
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  const messageEl = document.getElementById("form-message");
  const btn = document.querySelector(".btn-submit");
  messageEl.className = "message";
  messageEl.textContent = "";
  btn.disabled = true;

  const selected = Array.from(
    document.querySelectorAll('input[name="choix"]:checked')
  ).map((el) => el.value);

  if (selected.length === 0) {
    messageEl.className = "message error";
    messageEl.textContent = "Veuillez sélectionner au moins une option.";
    btn.disabled = false;
    return;
  }

  // Vérification locale avant écriture.
  const blocked = selected.filter(
    (key) => (counts[key] || 0) >= OPTIONS[key].max
  );
  if (blocked.length > 0) {
    messageEl.className = "message error";
    messageEl.textContent =
      "Une option sélectionnée n'est plus disponible (maximum atteint).";
    renderOptions();
    btn.disabled = false;
    return;
  }

  try {
    // Incrémente chaque option sélectionnée dans une transaction.
    await Promise.all(selected.map((key) => incrementCount(key)));
    messageEl.className = "message success";
    messageEl.textContent = "Merci ! Votre choix a bien été enregistré. 🎉";
    document.getElementById("form-fiesta").reset();
  } catch (e) {
    if (e.message === "MAX_REACHED") {
      messageEl.className = "message error";
      messageEl.textContent =
        "Trop tard : le maximum d'une des options a été atteint entre-temps.";
    } else {
      messageEl.className = "message error";
      messageEl.textContent =
        "Une erreur est survenue. Réessayez dans un instant.";
      console.error(e);
    }
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderOptions();
  subscribeCounts();
  document
    .getElementById("form-fiesta")
    .addEventListener("submit", handleSubmit);
});
