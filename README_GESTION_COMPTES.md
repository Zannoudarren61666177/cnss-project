# 📚 Documentation Complète: Gestion des Comptes CNSS

## 🎯 Bienvenue!

Cette documentation explique comment créer des comptes utilisateur et gérer les mots de passe dans **CNSS REFONTE**.

### ⚡ Accès Rapide

| Besoin | Document |
|--------|----------|
| **Je veux créer un compte maintenant** | → [README_CREATION_COMPTES.md](README_CREATION_COMPTES.md) (2 min) |
| **Je veux des instructions détaillées** | → [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md) (15 pages complètes) |
| **Je veux copier-coller des requêtes SQL** | → [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql) |
| **Je veux des commandes CLI** | → [COMMANDES_CLI_UTILES.md](COMMANDES_CLI_UTILES.md) |
| **Je veux voir les modifications** | → [RESUME_MODIFICATIONS.md](RESUME_MODIFICATIONS.md) |
| **Je veux générer des hashs** | → [generate_password_hashes.sh](generate_password_hashes.sh) |

---

## 🚀 Quick Start (2 minutes)

### Pour créer un compte **IMMÉDIATEMENT**:

#### Option 1: Via le Web ✅ (Recommandée)
```
1. Allez à: http://localhost:5173/creer-compte
2. Remplissez le formulaire
3. Cliquez "Créer mon compte"
4. Vous êtes connecté!
```

#### Option 2: Via SQL (Base de données)
```sql
-- Dans MySQL:
INSERT INTO users VALUES (NULL, 'Mon Entreprise', 'email@cnss.bj', 
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q', 
  'employeur', 'actif', NULL, NOW(), NOW());

SET @uid = LAST_INSERT_ID();

INSERT INTO employeurs VALUES (NULL, @uid, '12345678', 
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q', 
  'IFU123', 'Mon Entreprise', 'actif', NOW(), NOW());
```

### Pour changer un mot de passe:

#### Option 1: Via le Web ✅
```
1. Connectez-vous
2. Allez à: Paramètres → Sécurité
3. Entrez l'ancien et nouveau mot de passe
4. Cliquez "Modifier le mot de passe"
```

#### Option 2: Via SQL
```sql
UPDATE users SET password = '$2y$12$...' WHERE email = 'email@cnss.bj';
```

---

## 📊 Vue d'ensemble des Trois Solutions

### Solution 1: Frontend (Formulaire Web) ✅
**Utilisation**: Créer un compte utilisateur via le site web
- **URL**: `http://localhost:5173/creer-compte`
- **Avantages**: Interface intuitive, validation en temps réel
- **Public**: Oui, accessible sans authentification
- **Documentation**: [README_CREATION_COMPTES.md](README_CREATION_COMPTES.md)

### Solution 2: Base de Données (SQL) 🗄️
**Utilisation**: Créer directement dans MySQL
- **Accès**: `mysql -u root laravel`
- **Avantages**: Contrôle total, batch creation possible
- **Public**: Non, administrateur seulement
- **Documentation**: [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql)

### Solution 3: API Directe 🔌
**Utilisation**: Intégration programmatique via API REST
- **Endpoint**: `POST /api/v1/auth/register`
- **Avantages**: Automatisation, intégration tierce
- **Public**: Oui, accessible via HTTP
- **Documentation**: [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md#-endpoints-api-backend)

---

## 📋 Formats de Numéro CNSS

| Type | Format | Chiffres | Exemple |
|------|--------|----------|---------|
| **Employeur** | Numérique | 8 | `21055652` |
| **Travailleur** | Numérique | 10-12 | `18005907638009` |
| **Agent** | Numérique | 10-12 | `18005907638009` |

⚠️ **Important**: Pas de traits d'union, pas de préfixes (ex: pas "BJ-" ou "AGT-")

---

## 📁 Fichiers de Documentation

### 🟢 Pour Débuter Rapidement
- **[README_CREATION_COMPTES.md](README_CREATION_COMPTES.md)** - Quick start 2 min
- **[RESUME_MODIFICATIONS.md](RESUME_MODIFICATIONS.md)** - Modifications effectuées

### 🔵 Pour Détails Complets
- **[GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md)** - Guide complet (15+ pages)
- **[COMMANDES_CLI_UTILES.md](COMMANDES_CLI_UTILES.md)** - Commandes CLI

### 🟠 Pour Administrateurs
- **[SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql)** - Requêtes SQL
- **[generate_password_hashes.sh](generate_password_hashes.sh)** - Générateur de hashs

---

## 🧪 Comptes de Test Fournis

Ces comptes sont pré-créés dans la base de données pour vos tests:

```
Employeur:
  CNSS: 16879391
  Email: employeur.test@cnss.bj
  Mot de passe: password123
  → Accès: http://localhost:5173/connexion

Travailleur:
  CNSS: 449454426121
  Email: travailleur.test@cnss.bj
  Mot de passe: password123
  → Accès: http://localhost:5173/connexion
```

---

## 🔑 Endpoints API Importants

### 📝 Créer un Compte
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "numero_cnss": "21055652",
  "email": "user@cnss.bj",
  "password": "MyPassword123"
}

Réponse: 201 Created
{
  "message": "Compte créé avec succès",
  "user": { ... },
  "token": "1|abc..."
}
```

### 🔑 Se Connecter
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "numero_cnss": "21055652",
  "password": "MyPassword123"
}

Réponse: 200 OK
{
  "user": { ... },
  "token": "1|abc..."
}
```

### 🔄 Changer le Mot de Passe
```
POST /api/v1/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "OldPass123",
  "new_password": "NewPass123",
  "new_password_confirmation": "NewPass123"
}

Réponse: 200 OK
{
  "message": "Mot de passe changé avec succès"
}
```

---

## 🎨 Pages Web Importantes

| URL | Fonction | Authentification |
|-----|----------|------------------|
| `/creer-compte` | Créer un compte | ❌ Non |
| `/connexion` | Se connecter | ❌ Non |
| `/employeur/parametres` | Paramètres employeur | ✅ Oui |
| `/travailleur/parametres` | Paramètres travailleur | ✅ Oui |
| `/employeur/tableau-de-bord` | Dashboard employeur | ✅ Oui |
| `/travailleur/tableau-de-bord` | Dashboard travailleur | ✅ Oui |

---

## ⚙️ Configuration

### Variables d'Environnement

**Backend** (`backend/.env`):
```
DB_CONNECTION=mysql
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

**Frontend** (auto-configuré):
```
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

---

## 🔐 Sécurité

- ✅ Tous les mots de passe sont **hashés avec bcrypt**
- ✅ Les tokens utilisent **Sanctum** (Laravel)
- ✅ HTTPS recommandé en production
- ✅ Validation côté backend et frontend
- ✅ CORS configuré pour development

---

## 🆘 Aide et Dépannage

### Erreur: "Numéro CNSS invalide"
```
✓ Employeur: exactement 8 chiffres
✓ Travailleur: 10-12 chiffres
✗ Pas de traits d'union ou préfixes
```
→ Voir [GUIDE_CREATION_COMPTES.md - Dépannage](GUIDE_CREATION_COMPTES.md#-dépannage)

### Erreur: "Email déjà utilisé"
```
L'email doit être unique dans la base de données
→ Utilisez un nouvel email
```

### Erreur: "Impossible de se connecter"
```
1. Vérifiez le numéro CNSS (8 ou 10-12 chiffres)
2. Vérifiez le mot de passe (majuscules/minuscules)
3. Vérifiez que le compte a le statut "actif"
```
→ Voir [COMMANDES_CLI_UTILES.md - Dépannage](COMMANDES_CLI_UTILES.md#-dépannage)

---

## 📊 Modifications Effectuées

Les modifications suivantes ont été apportées au système:

### Backend
- ✅ Endpoint `/auth/register` amélioré
- ✅ Nouveau endpoint `/auth/change-password`
- ✅ Support complet des numéros CNSS (8 ou 10-12 chiffres)

### Frontend
- ✅ Page de création de compte (`/creer-compte`)
- ✅ Section changement de mot de passe dans Paramètres
- ✅ Validation et messages d'erreur améliorés

### Documentation
- ✅ 6 fichiers de documentation fournis
- ✅ Requêtes SQL prêtes à l'emploi
- ✅ Exemples et cas d'usage

→ Voir [RESUME_MODIFICATIONS.md](RESUME_MODIFICATIONS.md) pour plus de détails

---

## 📞 Support

### Ressources
- 📖 [Documentation Laravel](https://laravel.com/docs)
- 📖 [Documentation React](https://react.dev)
- 📖 [MySQL Reference](https://dev.mysql.com/doc/)

### Fichiers Sources
- 🔵 Backend: `backend/app/Http/Controllers/Api/AuthController.php`
- 🔵 Frontend: `frontend/src/app/components/CreateAccountPage.tsx`
- 🔵 Frontend: `frontend/src/app/components/ParametresPage.tsx`
- 🔵 API: `frontend/src/app/api.ts`

---

## ✅ Checklist Rapide

- [ ] Vérifier que le backend tourne sur port 8000
- [ ] Vérifier que le frontend tourne sur port 5173
- [ ] Tester la création de compte via `/creer-compte`
- [ ] Tester le changement de mot de passe
- [ ] Tester la connexion avec les identifiants créés
- [ ] Vérifier les données dans la base de données

---

## 🎯 Prochaines Étapes

1. **Pour débuter**: Lisez [README_CREATION_COMPTES.md](README_CREATION_COMPTES.md)
2. **Pour détails**: Lisez [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md)
3. **Pour SQL**: Consultez [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql)
4. **Pour CLI**: Consultez [COMMANDES_CLI_UTILES.md](COMMANDES_CLI_UTILES.md)

---

## 📝 License

Ce système fait partie du projet CNSS REFONTE.

---

**Dernière mise à jour**: 2024-06-22  
**Auteur**: GitHub Copilot  
**Version**: 1.0

