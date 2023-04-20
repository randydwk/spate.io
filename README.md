![header jsae](/assets/header-moodle-jsae.jpg)
<!-- <h1>spate.io</h1> -->


## Description

<table>
        <tr>
          <td>Ce dépôt contient la production de Randy De Wancker et Alexandre Deudon pour la SAÉ4a01.2. Il s'agit d'une version revisitée du célèbre jeu en ligne Agar.io en JavaScript où le joueur contrôle une cellule qui suit la direction du curseur afin d'absorber les petits elements comestibles sur la carte jusqu'à atteindre un taille permettant d'absorber les autres joueurs !</td>
        </tr>
</table>

## Prérequis

+ <code>Node.js</code> version 19.5.* [Télécharger](https://nodejs.org/en/download)
+ <code>git</code> [Télécharger](https://git-scm.com/downloads)
+ Un navigateur web

## Installation

À l'aide d'un terminal, naviguez jusqu'au répertoire de votre choix et lancez la commande suivante :

```shell
git clone https://gitlab.univ-lille.fr/alexandre.deudon.etu/spate.io.git
```

Ouvrez le dossier cloné et executez les commandes suivantes :

```shell
npm i
npm run build:client
npm run build:server
npm start
```
À présent vous pouvez vous rendre sur [localhost:8000](localhost:8000) et tenter d'atteindre une circonférence supérieure à celle d'éric cartman  

![big boned](https://media.giphy.com/media/Oqy8rcWoCx64o/giphy.gif)

## Difficultés techniques rencontrées

Nous avons commencé à développer la base du jeu complètement côté client d'abord.
Lorsqu'il a fallu créer le serveur, c'était très difficile de réadapter notre code en une partie client et une partie serveur pour que le tout refonctionne.
Nous aurions dû créer le serveur dès le départ.

Nous avons eu aussi des problèmes de configuration pour TypeScript mais nous les avons réglé en suivant attentivement les TP de SAE.

## Points d'améliorations

Nous avons pensé à plusieurs améliorations possibles :
- Pouvoir "splitter" son joueur (comme dans agar.io)
- Ajouter des objets bonus sur le plateau (bonus de vitesse, bonus de taille temporaire)
- Pouvoir choisir une couleur précise ou une image pour son joueur

## Petites fiertés

Nous sommes globalement fiers d'avoir réussi à obtenir un jeu fonctionnel et agréable à jouer, mais tout de même, les petites boules de nourriture attirées par les joueurs, c'est plutôt satisfaisant
à voir (et aussi quand le joueur grandi de manière fluide quand il mange).

## Licence
L'ensemble des productions sur ce dépot sont couvertes par la licence by-nc-sa 4.0.
[<img src="https://licensebuttons.net/l/by-nc-sa/3.0/88x31.png">](https://creativecommons.org/licenses/by-nc-sa/4.0/ "License")
