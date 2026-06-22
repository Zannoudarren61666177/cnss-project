# 🛠️ Commandes CLI Utiles - CNSS REFONTE

## 📋 Table des Matières
1. [PHP Artisan Tinker](#php-artisan-tinker)
2. [MySQL](#mysql)
3. [Développement Frontend](#développement-frontend)
4. [Tests](#tests)
5. [Dépannage](#dépannage)

---

## 🎯 PHP Artisan Tinker

L'outil interactif Tinker est parfait pour tester les créations de compte et générer des hashs.

### Lancer Tinker
```bash
cd backend
php artisan tinker
```

### Exemples d'utilisation

#### 1. Générer un hash de mot de passe
```php
>>> use Illuminate\Support\Facades\Hash;
>>> $hash = Hash::make('password123');
>>> echo $hash;
```

#### 2. Créer un utilisateur employeur
```php
>>> use App\Models\User;
>>> use App\Models\Employeur;
>>> use Illuminate\Support\Facades\Hash;

>>> $user = User::create([
  'name' => 'Test Entreprise',
  'email' => 'test@cnss.bj',
  'password' => Hash::make('password123'),
  'role' => 'employeur',
  'statut' => 'actif'
]);

>>> $employeur = Employeur::create([
  'user_id' => $user->id,
  'numero_cnss' => '12345678',
  'password' => Hash::make('password123'),
  'raison_sociale' => 'Test Entreprise',
  'statut' => 'actif'
]);

>>> echo "Créé avec succès!";
```

#### 3. Créer un utilisateur travailleur
```php
>>> $user = User::create([
  'name' => 'Jean Dupont',
  'email' => 'jean@cnss.bj',
  'password' => Hash::make('password123'),
  'role' => 'travailleur',
  'statut' => 'actif'
]);

>>> $travailleur = Travailleur::create([
  'user_id' => $user->id,
  'numero_cnss' => '10000000001',
  'password' => Hash::make('password123'),
  'first_name' => 'Jean',
  'last_name' => 'Dupont',
  'statut' => 'actif'
]);
```

#### 4. Lister tous les utilisateurs
```php
>>> User::all();
>>> User::where('role', 'employeur')->get();
>>> User::where('role', 'travailleur')->get();
```

#### 5. Chercher un utilisateur
```php
>>> $user = User::where('email', 'test@cnss.bj')->first();
>>> $user->employeur;
```

#### 6. Changer le mot de passe
```php
>>> $user = User::find(1);
>>> $user->password = Hash::make('newpassword123');
>>> $user->save();
>>> echo "Mot de passe modifié!";
```

#### 7. Supprimer un utilisateur
```php
>>> $user = User::find(1);
>>> $user->employeur()->delete();  // ou travailleur() ou agent()
>>> $user->delete();
>>> echo "Utilisateur supprimé!";
```

#### 8. Quitter Tinker
```php
>>> exit
```

---

## 📊 MySQL

### Connexion à la base de données
```bash
# Connexion locale (sans mot de passe)
mysql -h 127.0.0.1 -u root laravel

# Ou simplement
mysql -u root laravel
```

### Commandes utiles dans MySQL

#### Lister les utilisateurs
```sql
SELECT id, name, email, role, statut FROM users;
```

#### Chercher un utilisateur spécifique
```sql
SELECT * FROM users WHERE email = 'test@cnss.bj';
```

#### Lister les employeurs
```sql
SELECT e.id, e.numero_cnss, u.email, u.name, e.raison_sociale 
FROM employeurs e
LEFT JOIN users u ON e.user_id = u.id;
```

#### Lister les travailleurs
```sql
SELECT t.id, t.numero_cnss, u.email, t.first_name, t.last_name
FROM travailleurs t
LEFT JOIN users u ON t.user_id = u.id;
```

#### Mettre à jour le mot de passe
```sql
UPDATE users SET password = '$2y$12$...' WHERE email = 'test@cnss.bj';
```

#### Supprimer un utilisateur
```sql
DELETE FROM employeurs WHERE user_id = 1;
DELETE FROM users WHERE id = 1;
```

#### Vérifier l'intégrité des données
```sql
-- Chercher les employeurs orphelins (sans user associé)
SELECT * FROM employeurs WHERE user_id NOT IN (SELECT id FROM users);

-- Même pour travailleurs
SELECT * FROM travailleurs WHERE user_id NOT IN (SELECT id FROM users);
```

#### Compter les utilisateurs
```sql
SELECT role, COUNT(*) as total FROM users GROUP BY role;
```

---

## 🎨 Développement Frontend

### Lancer le serveur de développement
```bash
cd frontend
npm run dev
# ou
pnpm run dev
```

Le frontend démarre sur: `http://localhost:5173`

### Compilation production
```bash
cd frontend
npm run build
# ou
pnpm run build
```

### Linting
```bash
cd frontend
npm run lint
# ou
pnpm run lint
```

---

## 🧪 Tests

### Vérifier si les serveurs tournent

#### Frontend (port 5173)
```bash
curl http://localhost:5173
```

#### Backend (port 8000)
```bash
curl http://localhost:8000
```

### Tester l'API directement

#### Créer un compte via curl
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "numero_cnss": "21055652",
    "email": "test@cnss.bj",
    "password": "password123"
  }'
```

#### Se connecter
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "numero_cnss": "21055652",
    "password": "password123"
  }'
```

#### Changer le mot de passe (avec token)
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:8000/api/v1/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "current_password": "password123",
    "new_password": "newpassword123",
    "new_password_confirmation": "newpassword123"
  }'
```

#### Obtenir les infos utilisateur (authentifié)
```bash
TOKEN="your_token_here"

curl -X GET http://localhost:8000/api/v1/auth/user \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Dépannage

### Backend ne démarre pas

#### Vérifier les logs
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
# Regardez les erreurs dans le terminal
```

#### Vérifier la connexion à la base de données
```bash
cd backend
php artisan migrate:status
```

#### Réinitialiser la base de données (attention: supprime tout!)
```bash
cd backend
php artisan migrate:refresh
php artisan db:seed
```

### Frontend ne démarre pas

#### Vérifier les dépendances
```bash
cd frontend
npm install
# ou
pnpm install
```

#### Supprimer le cache
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### Erreurs de CORS

- Assurez-vous que le frontend est sur `localhost:5173`
- Le backend doit avoir CORS configuré pour `localhost:5173`
- Vérifier [CorsMiddleware.php](backend/app/Http/Middleware/CorsMiddleware.php)

### Token expiré/invalide

```php
# Dans Tinker, régénérer les tokens:
>>> use App\Models\User;
>>> $user = User::find(1);
>>> $user->tokens()->delete();
>>> $token = $user->createToken('api-token')->plainTextToken;
>>> echo $token;
```

---

## 📈 Commandes de Monitoring

### Afficher les derniers logs
```bash
cd backend
tail -f storage/logs/laravel.log
```

### Vérifier les processus PHP
```bash
# Linux/Mac
ps aux | grep php

# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -match "php"}
```

### Vérifier les ports utilisés
```bash
# Linux/Mac
lsof -i :8000
lsof -i :5173

# Windows PowerShell
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

### Tuer un processus
```bash
# Linux/Mac
kill -9 <PID>

# Windows PowerShell
Stop-Process -Id <PID> -Force
```

---

## 💾 Sauvegarde et Restauration

### Exporter la base de données
```bash
mysqldump -u root laravel > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Importer une sauvegarde
```bash
mysql -u root laravel < backup.sql
```

---

## 🚀 Déploiement Rapide

### Déployer une mise à jour
```bash
# Backend
cd backend
git pull
composer install
php artisan migrate

# Frontend
cd frontend
git pull
npm install
npm run build
```

---

## 📚 Ressources Utiles

- [Laravel Documentation](https://laravel.com/docs)
- [Sanctum Auth](https://laravel.com/docs/sanctum)
- [React Documentation](https://react.dev)
- [MySQL Reference](https://dev.mysql.com/doc/refman/latest/en/)

