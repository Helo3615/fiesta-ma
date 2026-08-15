# Fête pour Maman 🎉

Site statique (HTML/CSS/JS + Firebase) permettant d'organiser une fête
et de gérer les apports des participants avec un comptage **partagé en
temps réel**.

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
se **grise** en temps réel pour tous les participants, avec un message
expliquant qu'elle n'est plus sélectionnable (trop de monde l'a déjà
choisie).

## Contraintes respectées

- Volume d'utilisateurs attendu : 20 max.
- Site nécessaire jusqu'à fin septembre.
- Tout est gratuit : HTML/CSS/JS statique + Firebase (plan Spark gratuit,
  largement suffisant pour 20 utilisateurs).

## Backend : Firebase Cloud Firestore

Les compteurs sont stockés dans Firestore (collection `counts`, un
document par option, ex : `counts/apero -> { count: 3 }`).

- **Lecture** : ouverte à tous (écoute temps réel via `onSnapshot`).
- **Écriture** : incrément atomique via transaction, avec contrôle du
  maximum côté client **et** côté serveur (`firestore.rules`).

### Configuration à renseigner

Dans `config.js`, remplacer les valeurs de `firebaseConfig` par celles de
ton projet Firebase :

```
Console Firebase → Paramètres du projet → Général → Vos applications → Config SDK
```

### Règles de sécurité

Déployer `firestore.rules` dans la console Firebase :
`Firestore Database → Règles → Publier`.

### Base de données (mode production/test)

Créer la base Firestore en mode **production** (les règles ci-dessus
sécurisent l'accès). Les documents de la collection `counts` sont créés
automatiquement au premier enregistrement.

## Structure

```
index.html        # structure du formulaire + chargement du SDK Firebase
config.js         # firebaseConfig + objet constant OPTIONS (nom + nb max)
app.js            # logique : écoute temps réel, compteur, grisage + explication
style.css         # mise en forme
firestore.rules   # règles de sécurité Firestore (max par option côté serveur)
```

## Hébergement gratuit

Deux options gratuites :

1. **Firebase Hosting** : `firebase deploy` (après `firebase init hosting`).
2. **GitHub Pages** : Settings du dépôt → Pages → branche `main`, racine.
