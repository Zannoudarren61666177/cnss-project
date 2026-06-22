# Formats des numéros d'immatriculation CNSS

Ce document décrit les formats attendus pour les numéros d'immatriculation utilisés par l'API CNSS.

Rules
- Les numéros doivent être numériques uniquement (chiffres 0-9), sans préfixes ou tirets.

Formats
- Employeur : exactement 8 chiffres
  - Exemple : `21055652`
- Travailleur : entre 10 et 12 chiffres
  - Exemple : `180059076380` (ex. 12 chiffres) ou `1800590763` (10 chiffres)
- Agent : mêmes règles que Travailleur (10 à 12 chiffres)

Backend
- L'API `/auth/login` attend `numero_cnss` (string numérique) et `password`.
- Si `numero_cnss` contient autre chose que des chiffres, l'API renvoie une erreur 422.
- Si longueur = 8 → recherche d'un `Employeur` par `numero_cnss` et récupération du `User` lié.
- Si longueur 10–12 → tentative de recherche d'un `User` role `agent` avec `name = numero_cnss`, sinon recherche d'un `Travailleur` par `numero_cnss`.

Frontend
- Le frontend envoie `numero_cnss` numérique et `password` à `/auth/login`.
- Le frontend s'attend à trouver dans la réponse JSON un objet `user` et un `token`.

Seeders / Tests
- Les seeders et tests de l'application doivent insérer des `numero_cnss` conformes aux règles ci-dessus pour permettre l'authentification en environnement de développement.

