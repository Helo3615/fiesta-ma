// Configuration des options du formulaire de fête.
// Chaque option possède un libellé et un nombre maximum de réponses.
// Quand le nombre de réponses atteint le maximum, la case correspondante
// est désactivée (grisée) pour les autres participants.
const OPTIONS = {
  apero: {
    label: "J'apporte accompagnement apéro",
    max: 8,
  },
  sale: {
    label: "J'apporte du salé",
    max: 12,
  },
  fromage: {
    label: "J'apporte du fromage",
    max: 6,
  },
  sucre: {
    label: "J'apporte du sucré",
    max: 12,
  },
};
