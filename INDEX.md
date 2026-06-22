# 📚 INDEX CENTRAL - Documentation CNSS Gestion des Comptes

## 🎯 Aller au Point

### ⚡ Vous avez 2 minutes?
→ [README_CREATION_COMPTES.md](README_CREATION_COMPTES.md)  
Quick start avec les deux méthodes essentielles

### ⏱️ Vous avez 15 minutes?
→ [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md)  
Guide complet avec tous les détails

### 💾 Vous avez besoin de requêtes SQL?
→ [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql)  
Requêtes prêtes à copier-coller

### 🛠️ Vous avez besoin de commandes CLI?
→ [COMMANDES_CLI_UTILES.md](COMMANDES_CLI_UTILES.md)  
Commandes utiles pour la gestion

### 📋 Vous voulez voir les modifications?
→ [RESUME_MODIFICATIONS.md](RESUME_MODIFICATIONS.md)  
Détail des changements effectués

### 🎓 Vous débutez?
→ [README_GESTION_COMPTES.md](README_GESTION_COMPTES.md)  
Documentation principale complète

---

## 📂 Structure des Fichiers

```
cnss-project/
├── README_GESTION_COMPTES.md          ← LIRE D'ABORD (documentation principale)
├── README_CREATION_COMPTES.md         ← Quick start (2 min)
├── GUIDE_CREATION_COMPTES.md          ← Guide détaillé (15+ pages)
├── SQL_QUERIES_CREATION_COMPTES.sql   ← Requêtes SQL
├── COMMANDES_CLI_UTILES.md            ← Commandes CLI
├── RESUME_MODIFICATIONS.md            ← Modifications effectuées
├── generate_password_hashes.sh        ← Script générateur de hashs
│
├── backend/
│   ├── app/Http/Controllers/Api/
│   │   └── AuthController.php         ← Modifié: register() et changePassword()
│   ├── routes/
│   │   └── api.php                    ← Modifié: nouvelle route change-password
│   └── ...
│
└── frontend/
    └── src/app/
        ├── components/
        │   ├── CreateAccountPage.tsx  ← Modifié: intégration API
        │   ├── ParametresPage.tsx     ← Modifié: changement mot de passe
        │   └── ...
        ├── api.ts                     ← Modifié: registerWithCnss() et changePassword()
        └── ...
```

---

## 🎨 Flux d'Utilisation

### 1️⃣ Créer un Compte

```
User Visit: /creer-compte
    ↓
Fill Form (CNSS, Email, Password)
    ↓
Submit → POST /api/v1/auth/register
    ↓
Backend: Create User + Profile
    ↓
Return: Token + User Data
    ↓
Store in localStorage
    ↓
Redirect: /employeur/tableau-de-bord (or /travailleur/...)
```

### 2️⃣ Changer Mot de Passe

```
User: Connected
    ↓
Visit: /employeur/parametres → Sécurité
    ↓
Fill Form: Old + New Password
    ↓
Submit → POST /auth/change-password (Authenticated)
    ↓
Backend: Update users + profile tables
    ↓
Show: Success message
    ↓
Reset form
```

### 3️⃣ Créer via Base de Données

```
Admin: MySQL Console
    ↓
Copy SQL from SQL_QUERIES_CREATION_COMPTES.sql
    ↓
INSERT users + employeurs/travailleurs/agents
    ↓
User can now login
```

---

## 📊 Comparaison des Trois Méthodes

| Critère | Frontend | SQL | API |
|---------|----------|-----|-----|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Vitesse** | Normale | Rapide | Variable |
| **Accès** | Public | Admin | Public |
| **Validation** | Complète | Manuelle | Standard |
| **Batch** | Non | Oui | Oui |
| **UI** | Oui | Non | Non |
| **Recommandé** | ✅ Oui | Pour admins | Intégration |

---

## 🚀 Démarrage Rapide (3 étapes)

### Étape 1: Vérifier les serveurs
```bash
# Terminal 1: Backend (port 8000)
cd backend
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

### Étape 2: Créer un compte
Allez à: `http://localhost:5173/creer-compte`

Remplissez:
- **CNSS**: `21055652` (8 chiffres pour employeur)
- **Email**: `test@cnss.bj`
- **Mot de passe**: `Password123`

Cliquez: "Créer mon compte"

### Étape 3: Connexion
Allez à: `http://localhost:5173/connexion`

Connectez-vous avec:
- **CNSS**: `21055652`
- **Mot de passe**: `Password123`

Vous êtes maintenant sur le dashboard!

---

## 🔑 Endpoints API Clés

### Création
```
POST /api/v1/auth/register
{
  "numero_cnss": "21055652",
  "email": "user@cnss.bj",
  "password": "Password123"
}
```

### Connexion
```
POST /api/v1/auth/login
{
  "numero_cnss": "21055652",
  "password": "Password123"
}
```

### Changement Mot de Passe
```
POST /api/v1/auth/change-password
Authorization: Bearer {token}
{
  "current_password": "OldPass",
  "new_password": "NewPass",
  "new_password_confirmation": "NewPass"
}
```

---

## 📋 Checklist de Configuration

### ✅ Avant de démarrer

- [ ] MySQL est installé et accessible
- [ ] Base de données `laravel` existe
- [ ] Backend: `php artisan migrate` a été exécuté
- [ ] Frontend: `npm install` a été exécuté
- [ ] Fichiers modifiés sont en place
- [ ] Pas d'erreurs de compilation

### ✅ Vérification

- [ ] Backend démarre sans erreurs
- [ ] Frontend démarre sans erreurs
- [ ] CORS fonctionne (pas d'erreurs de fetch)
- [ ] Création de compte fonctionne
- [ ] Connexion fonctionne
- [ ] Changement de mot de passe fonctionne

---

## 🆘 Aide Rapide

### Erreur: "Numéro CNSS invalide"
```
Employeur: 8 chiffres (ex: 21055652)
Travailleur: 10-12 chiffres (ex: 18005907638009)
⚠️ PAS de traits d'union ou préfixes
```
→ [GUIDE_CREATION_COMPTES.md#-dépannage](GUIDE_CREATION_COMPTES.md#-dépannage)

### Erreur: "Email déjà utilisé"
```
Utilisez un nouvel email unique
```

### Erreur: "Impossible de se connecter"
```
1. Vérifiez le numéro CNSS
2. Vérifiez le mot de passe (case-sensitive)
3. Vérifiez le statut du compte (actif)
```

### Erreur: "Failed to fetch"
```
1. Vérifiez que le backend tourne sur :8000
2. Vérifiez CORS dans CorsMiddleware.php
3. Vérifiez la console navigateur pour plus de détails
```

→ [COMMANDES_CLI_UTILES.md#-dépannage](COMMANDES_CLI_UTILES.md#-dépannage)

---

## 🧪 Comptes de Test

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

## 📞 Ressources

### Documentation Officielle
- [Laravel](https://laravel.com/docs)
- [React](https://react.dev)
- [MySQL](https://dev.mysql.com/doc/)
- [Sanctum](https://laravel.com/docs/sanctum)

### Fichiers du Projet
- Backend: `backend/app/Http/Controllers/Api/AuthController.php`
- Frontend: `frontend/src/app/components/CreateAccountPage.tsx`
- API: `frontend/src/app/api.ts`
- Routes: `backend/routes/api.php`

---

## 🎯 Chronologie d'Utilisation

### Jour 1: Configuration
1. Lisez [README_GESTION_COMPTES.md](README_GESTION_COMPTES.md)
2. Vérifiez les serveurs (backend + frontend)
3. Testez avec les comptes fournis

### Jour 2: Utilisation
1. Créez vos propres comptes via `/creer-compte`
2. Testez le changement de mot de passe
3. Créez via SQL si nécessaire

### Au Besoin
1. Consultez [GUIDE_CREATION_COMPTES.md](GUIDE_CREATION_COMPTES.md) pour détails
2. Consultez [SQL_QUERIES_CREATION_COMPTES.sql](SQL_QUERIES_CREATION_COMPTES.sql) pour requêtes
3. Consultez [COMMANDES_CLI_UTILES.md](COMMANDES_CLI_UTILES.md) pour commandes

---

## 📊 Fichiers Modifiés

### Backend
```
backend/app/Http/Controllers/Api/AuthController.php
  ✅ Méthode register() améliorée
  ✅ Nouvelle méthode changePassword()

backend/routes/api.php
  ✅ Route auth/change-password ajoutée
```

### Frontend
```
frontend/src/app/components/CreateAccountPage.tsx
  ✅ Intégration API registerWithCnss()
  ✅ Validation et messages d'erreur

frontend/src/app/components/ParametresPage.tsx
  ✅ Intégration API changePassword()
  ✅ Gestion d'erreur et succès

frontend/src/app/api.ts
  ✅ Fonction registerWithCnss()
  ✅ Fonction changePassword()
```

---

## ✨ Fonctionnalités Ajoutées

- ✅ Création de compte via formulaire web
- ✅ Création de compte via SQL
- ✅ Création de compte via API
- ✅ Changement de mot de passe authentifié
- ✅ Support de tous les types d'utilisateurs
- ✅ Validation complète
- ✅ Messages d'erreur clairs
- ✅ Documentation exhaustive

---

## 🎓 Pour Aller Plus Loin

### Extensions Possibles
- Authentification à deux facteurs (2FA)
- Réinitialisation de mot de passe oublié
- Social login (Google, Facebook)
- LDAP/Active Directory integration
- Audit logs des connexions

### Optimisations
- Mise en cache des utilisateurs
- Rate limiting sur les endpoints
- Cryptage des données sensibles
- Monitoring et alertes

---

## 📝 Versioning

```
Version: 1.0
Date: 2024-06-22
Auteur: GitHub Copilot
Statut: ✅ Production Ready
```

---

**🎉 Vous êtes prêt! Commencez par [README_GESTION_COMPTES.md](README_GESTION_COMPTES.md)**

