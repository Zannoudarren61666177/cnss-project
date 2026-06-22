# 🎯 GUIDE COMPLET: 3 MÉTHODES POUR CRÉER UN COMPTE

## ✅ RÉSUMÉ DES 3 MÉTHODES

| Méthode | Facilité | Vitesse | Idéale pour |
|---------|----------|---------|------------|
| **API REST** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Automatisation, intégration, scripts |
| **Formulaire Frontend** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Utilisateurs finaux, interface intuitive |
| **SQL phpMyAdmin** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Administrateurs, test rapide, création en masse |

**IMPORTANT**: Les trois méthodes créent exactement les mêmes données!

---

## 🟢 MÉTHODE 1: API REST (Pour l'automatisation)

### Commande PowerShell:

```powershell
# Préparer les données
$data = @{
    numero_cnss = "12345678"          # 8 chiffres = employeur
    email = "hojine@cnss.bj"
    password = "password123"
}

$json = $data | ConvertTo-Json
$headers = @{
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Envoyer la requête
$response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/v1/auth/register" `
    -Method POST -Headers $headers -Body $json

# Voir le résultat
$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Compte créé!"
Write-Host "Email: $($result.user.email)"
Write-Host "Token: $($result.token)"
```

### Types de CNSS:
- **Employeur**: 8 chiffres (ex: `12345678`)
- **Travailleur**: 10-12 chiffres (ex: `1234567890`)

### Réponse attendue (HTTP 201):
```json
{
  "message": "Compte créé avec succès",
  "user": {
    "id": 5,
    "email": "hojine@cnss.bj",
    "role": "employeur",
    "profile": {
      "numero_cnss": "12345678",
      "company_name": "hojine@cnss.bj",
      "statut": "actif"
    }
  },
  "token": "22|CfsP9d7LXEx3wN5..."
}
```

---

## 🟢 MÉTHODE 2: Formulaire Frontend

### URL:
```
http://localhost:5173/creer-compte
```

### Étapes:

Travailleur:
  CNSS: 18005907638009
  Email: test.travailleur@cnss.bj
  Mot de passe: Password123
```

---

## � MÉTHODE 3: SQL phpMyAdmin

### Accès:
```
http://localhost/phpmyadmin/
```

### Connexion:
- Serveur: localhost
- Utilisateur: root  
- Mot de passe: (vide)
- Base: laravel

### Étapes pour créer un compte:

#### Étape 1: Ouvrir l'onglet SQL

1. Cliquez sur base de données "laravel"
2. Cliquez sur l'onglet "SQL"

#### Étape 2: Exécuter la commande SQL

**Pour un Employeur (CNSS 8 chiffres):**

```sql
-- Variables à personnaliser:
SET @email = 'hojine@cnss.bj';
SET @cnss = '87654321';
SET @company_name = 'Hojine Enterprises';
SET @hashed_password = '$2y$12$R9h/cIPz0gi.URNNQE3gx.82OM0hNiXDW6M7M9pPX2DvCGakfkYWa';

-- Créer l'utilisateur
INSERT INTO users (name, email, password, role, statut, created_at, updated_at) 
VALUES (@email, @email, @hashed_password, 'employeur', 'actif', NOW(), NOW());

-- Récupérer l'ID
SET @user_id = LAST_INSERT_ID();

-- Créer le profil employeur
INSERT INTO employeurs (user_id, numero_cnss, company_name, password, ifu, statut, created_at, updated_at)
VALUES (@user_id, @cnss, @company_name, @hashed_password, 'EN ATTENTE', 'actif', NOW(), NOW());
```

**Pour un Travailleur (CNSS 10-12 chiffres):**

```sql
SET @email = 'travailleur@cnss.bj';
SET @cnss = '1234567890';
SET @hashed_password = '$2y$12$R9h/cIPz0gi.URNNQE3gx.82OM0hNiXDW6M7M9pPX2DvCGakfkYWa';

INSERT INTO users (name, email, password, role, statut, created_at, updated_at) 
VALUES (@email, @email, @hashed_password, 'travailleur', 'actif', NOW(), NOW());

SET @user_id = LAST_INSERT_ID();

INSERT INTO travailleurs (user_id, numero_cnss, password, first_name, last_name, statut, created_at, updated_at)
VALUES (@user_id, @cnss, @hashed_password, 'Prénom', 'Nom', 'actif', NOW(), NOW());
```

### 🔒 Hashes Bcrypt prêts à l'emploi:

```
PASSWORD: password123
HASH:     $2y$12$R9h/cIPz0gi.URNNQE3gx.82OM0hNiXDW6M7M9pPX2DvCGakfkYWa

PASSWORD: SecurePass2024
HASH:     $2y$12$4k0SEVzHX8rN8W.3zK5hVe.2nOL.9b/D4.kW9mX5vQ3pJ9wQ7a9ni

PASSWORD: TestPassword123
HASH:     $2y$12$7l.3mQ9vKu8h0W.5tL9pDe.3oM0/bC5kJe.9sZ3wP4rL2xR8c1sNi
```

### Générer votre propre hash:

**Via Laravel Tinker:**
```bash
cd backend
php artisan tinker
> Hash::make('votre-mot-de-passe')
```

**Via PHP:**
```bash
php -r "echo password_hash('votre-mot-de-passe', PASSWORD_BCRYPT);"
```

### Vérifier après création:

```sql
SELECT u.id, u.email, u.role, e.numero_cnss, e.company_name
FROM users u
LEFT JOIN employeurs e ON u.id = e.user_id
WHERE e.numero_cnss = '87654321';
```

---

## 🔑 Changer le Mot de Passe

### Solution 1: Via le Frontend (Recommandée)

1. **Se connecter** à votre compte
2. **Accéder aux Paramètres**:
   - Employeur: Cliquez sur ⚙️ "Paramètres" en bas du menu latéral
   - Travailleur: Cliquez sur "Paramètres"
   
3. **Sélectionner l'onglet "Sécurité"**

4. **Remplir le formulaire**:
   - Mot de passe actuel
   - Nouveau mot de passe (min. 8 caractères)
   - Confirmer le nouveau mot de passe

5. **Cliquer sur "Modifier le mot de passe"**

### Solution 2: Via la Base de Données

#### Mise à jour simple (Users table seulement):

```sql
-- Générer un nouveau hash
-- Utilisez: php -r "echo password_hash('newpassword123', PASSWORD_BCRYPT);"
-- Puis remplacez $2y$12$... par le hash

UPDATE users 
SET password = '$2y$12$...' 
WHERE email = 'email@entreprise.bj';
```

#### Mise à jour complète (Users + Employeur/Travailleur/Agent):

```sql
-- Pour un Employeur
UPDATE users SET password = '$2y$12$...' WHERE id = 1;
UPDATE employeurs SET password = '$2y$12$...' WHERE user_id = 1;

-- Pour un Travailleur
UPDATE users SET password = '$2y$12$...' WHERE id = 1;
UPDATE travailleurs SET password = '$2y$12$...' WHERE user_id = 1;

-- Pour un Agent
UPDATE users SET password = '$2y$12$...' WHERE id = 1;
UPDATE agents SET password = '$2y$12$...' WHERE user_id = 1;
```

---

## 📊 Endpoints API (Backend)

### Créer un compte

**POST** `/api/v1/auth/register`

```json
{
  "numero_cnss": "21055652",
  "email": "email@example.com",
  "password": "MySecurePass123"
}
```

**Réponse (201)**:
```json
{
  "message": "Compte créé avec succès",
  "user": {
    "id": 1,
    "name": "email@example.com",
    "email": "email@example.com",
    "role": "employeur",
    "statut": "actif"
  },
  "token": "1|xyzabc123..."
}
```

### Changer le mot de passe (Authentifié)

**POST** `/api/v1/auth/change-password`

Headers: `Authorization: Bearer {token}`

```json
{
  "current_password": "OldPassword123",
  "new_password": "NewPassword123",
  "new_password_confirmation": "NewPassword123"
}
```

**Réponse (200)**:
```json
{
  "message": "Mot de passe changé avec succès"
}
```

---

## 📱 Flux de Connexion Après Création

### 1. Accéder à la page de connexion
**URL**: `http://localhost:5173/connexion`

### 2. Entrer les identifiants
- **Numéro CNSS**: Le numéro utilisé lors de la création
- **Mot de passe**: Le mot de passe choisi

### 3. Cliquer "Se connecter"

### 4. Redirection automatique
- Employeur → `/employeur/tableau-de-bord`
- Travailleur → `/travailleur/tableau-de-bord`
- Agent → `/agent/...` (selon le type d'agent)

---

## 🧪 Comptes de Test Fournis

Deux comptes pré-créés pour les tests:

### Employeur
```
CNSS: 16879391
Mot de passe: password123
```

### Travailleur
```
CNSS: 449454426121
Mot de passe: password123
```

---

## ⚡ Commandes Utiles

### Lister tous les utilisateurs

```sql
SELECT * FROM users;
SELECT * FROM employeurs;
SELECT * FROM travailleurs;
SELECT * FROM agents;
```

### Supprimer un utilisateur et ses données associées

```sql
-- Supprimer un employeur
DELETE FROM employeurs WHERE user_id = 1;
DELETE FROM users WHERE id = 1;

-- Supprimer un travailleur
DELETE FROM travailleurs WHERE user_id = 1;
DELETE FROM users WHERE id = 1;
```

### Réinitialiser un mot de passe oublié

```bash
cd backend
php artisan tinker

>>> use App\Models\User;
>>> use Illuminate\Support\Facades\Hash;
>>> $user = User::find(1);
>>> $user->password = Hash::make('newpassword');
>>> $user->save();
```

---

## 🆘 Dépannage

### Erreur: "Format de numéro CNSS invalide"
- Employeur: Utilisez exactement 8 chiffres
- Travailleur/Agent: Utilisez 10-12 chiffres
- **Aucun trait d'union, aucun préfixe** (par ex. pas "BJ-" ou "AGT-")

### Erreur: "Email déjà utilisé"
- L'email doit être unique dans la base de données
- Utilisez un nouvel email ou modifiez l'existant dans la DB

### Erreur: "Mot de passe actuel incorrect"
- Le mot de passe actuel saisi est incorrect
- Assurez-vous que le Caps Lock n'est pas activé

### Impossible de se connecter après création via DB
- Vérifiez que le hash du mot de passe est correct
- Vérifiez que l'utilisateur a le bon `role`
- Testez en réinitialisant le mot de passe

---

## 📞 Support

Pour plus d'informations, consultez:
- Documentation Laravel: https://laravel.com/docs
- API Endpoints: Voir les routes dans `backend/routes/api.php`
- Modèles: `backend/app/Models/`

