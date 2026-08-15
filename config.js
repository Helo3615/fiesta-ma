// Configuration Firebase (Cloud Firestore) — projet "fiestma".
const firebaseConfig = {
  apiKey: "AIzaSyDs5xooKwbVHQ-voJtcfkhJcs4oPlaiyW0",
  authDomain: "fiestma.firebaseapp.com",
  projectId: "fiestma",
  storageBucket: "fiestma.firebasestorage.app",
  messagingSenderId: "901466131305",
  appId: "1:901466131305:web:aae62497fb0d0f562a8bf8",
};

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
