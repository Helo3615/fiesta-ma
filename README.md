# Fête pour Maman 🎉

Site statique (HTML/CSS/JS) permettant d'organiser une fête et de gérer
les apports des participants.

## Fonctionnement

Le formulaire propose une seule question :

> **Sélectionnez une option** (cases à cocher)

avec 4 options, chacune limitée en nombre de participants :

| Option                         | Maximum |
| ------------------------------ | :-----: |
| J'apporte accompagnement apéro |   8     |
| J'apporte du salé              |   12    |
| J'apporte du fromage           |   6     |
| J'apporte du sucré             |   12    |

Quand le nombre maximum de réponses est atteint pour une option, sa case
se **grise** et un message explique qu'elle n'est plus sélectionnable
car trop de monde l'a déjà choisie.

## Contraintes respectées

- Volume d'utilisateurs attendu : 20 max.
- Site nécessaire jusqu'à fin septembre.
- Tout est gratuit : HTML/CSS/JS statique, hébergeable gratuitement sur
  **GitHub Pages**.

## Structure

```
index.html   # structure du formulaire
config.js    # objet constant OPTIONS (nom + nombre max par option)
app.js       # logique : rendu des cases, compteur, grisage + explication
style.css    # mise en forme
```

## Persistance des compteurs

Par défaut, les compteurs sont stockés dans le `localStorage` du
navigateur (démo fonctionnelle sur un même appareil).

Pour un comptage **partagé entre les 20 participants** sans frais,
brancher un backend gratuit :

1. Créer un Google Sheet avec une feuille `counts` (colonnes `option`,
   `count`).
2. Déployer un script Google Apps Script (`doGet`/`doPost`) qui lit et
   incrémente les compteurs, puis le publier comme application web.
3. Dans `app.js`, remplacer les appels `loadCounts`/`saveCounts` par des
   `fetch` vers l'URL de l'app web.

## Hébergement gratuit (GitHub Pages)

1. Pousser les fichiers sur la branche `main`.
2. Réglages du dépôt → **Pages** → Source : `Deploy from a branch`,
   branche `main`, dossier `/ (root)`.
3. Le site est accessible sur `https://Helo3615.github.io/fiesta-ma/`.
