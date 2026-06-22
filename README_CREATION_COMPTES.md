# 🚀 Quick Start: Création de Comptes CNSS

## 📋 Résumé Rapide

Deux méthodes pour créer des comptes et gérer les mots de passe dans CNSS REFONTE:

---

## ✅ Méthode 1: Interface Web (Recommandée)

### Créer un compte
1. Allez à: `http://localhost:5173/creer-compte`
2. Remplissez le formulaire:
   - **CNSS**: 8 chiffres (employeur) ou 10-12 chiffres (travailleur)
   - **Email**: `votremail@example.com`
   - **Mot de passe**: Min. 8 caractères
3. Cliquez "Créer mon compte"
4. Vous êtes automatiquement connecté et redirigé au tableau de bord

### Changer le mot de passe
1. Connectez-vous
2. Allez à: **Paramètres → Sécurité**
3. Entrez:
   - Mot de passe actuel
   - Nouveau mot de passe
   - Confirmation
4. Cliquez "Modifier le mot de passe"

---

## 🗄️ Méthode 2: Base de Données (Pour admins)

### Connexion à MySQL
```bash
mysql -h 127.0.0.1 -u root laravel
```

### Créer un compte employeur
```sql
INSERT INTO users VALUES (NULL, 'Mon Entreprise', 'email@cnss.bj', 
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q', 
  'employeur', 'actif', NULL, NOW(), NOW());

SET @uid = LAST_INSERT_ID();

INSERT INTO employeurs VALUES (NULL, @uid, '12345678', 
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q', 
  'IFU123', 'Mon Entreprise', 'actif', NOW(), NOW());
```

### Créer un compte travailleur
```sql
INSERT INTO users VALUES (NULL, 'Jean Dupont', 'jean@cnss.bj',
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  'travailleur', 'actif', NULL, NOW(), NOW());

SET @uid = LAST_INSERT_ID();

INSERT INTO travailleurs VALUES (NULL, @uid, '10000000001',
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  'Jean', 'Dupont', 'actif', NOW(), NOW());
```

### Générer un hash de mot de passe
```bash
php -r "echo password_hash('votremotdepasse', PASSWORD_BCRYPT);"
```

---

## 📁 Fichiers de Référence

| Fichier | Description |
|---------|-------------|
| [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md) | Guide complet avec tous les détails |
| [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql) | Requêtes SQL prêtes à l'emploi |
| [generate_password_hashes.sh](generate_password_hashes.sh) | Script pour générer les hashs |

---

## 🧪 Comptes de Test

Pré-créés dans la base de données:

```
Employeur:
  CNSS: 16879391
  Email: employeur.test@cnss.bj
  Mot de passe: password123

Travailleur:
  CNSS: 449454426121
  Email: travailleur.test@cnss.bj
  Mot de passe: password123
```

---

## 🔑 URLs Importantes

| URL | Fonction |
|-----|----------|
| `http://localhost:5173/creer-compte` | Créer un compte |
| `http://localhost:5173/connexion` | Se connecter |
| `http://localhost:5173/employeur/parametres` | Paramètres employeur |
| `http://localhost:5173/travailleur/parametres` | Paramètres travailleur |

---

## 🆘 Aide Rapide

**Erreur: "Numéro CNSS invalide"**
- Employeur: 8 chiffres exactement
- Travailleur: 10-12 chiffres
- Pas de traits d'union ni de préfixes

**Erreur: "Email déjà utilisé"**
- L'email doit être unique

**Impossible de se connecter?**
- Vérifiez le numéro CNSS
- Vérifiez le mot de passe (majuscules/minuscules)
- Assurez-vous que le compte a le statut "actif"

---

## 📞 Support Détaillé

Pour des instructions complètes avec exemples et dépannage, consultez:
👉 [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md)

Pour les requêtes SQL prêtes à copier-coller:
👉 [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql)

