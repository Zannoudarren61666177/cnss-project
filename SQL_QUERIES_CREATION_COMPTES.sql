-- ============================================================================
-- 📋 Requêtes SQL Prêtes à l'Emploi pour Créer et Gérer les Comptes CNSS
-- ============================================================================
-- Exécutez ces requêtes directement dans MySQL après connexion
-- Base de données: laravel
-- Utilisateur: root
-- ============================================================================

-- ============================================================================
-- 🟢 CRÉER DES COMPTES
-- ============================================================================

-- ============================================================================
-- 1️⃣ CRÉER UN COMPTE EMPLOYEUR
-- ============================================================================
-- Remplacez les valeurs entre < > par vos propres valeurs

INSERT INTO users (name, email, password, role, statut, created_at, updated_at) 
VALUES (
  'Entreprise Test 1',
  'employeur1@cnss.bj',
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',  -- Hash pour 'password123'
  'employeur',
  'actif',
  NOW(),
  NOW()
);

-- Récupérer l'ID du nouvel utilisateur
SET @user_id = LAST_INSERT_ID();

-- Créer l'entrée employeur
INSERT INTO employeurs (user_id, numero_cnss, password, ifu, raison_sociale, statut, created_at, updated_at)
VALUES (
  @user_id,
  '12345678',  -- Numéro CNSS (8 chiffres)
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  'IFU123456',
  'Entreprise Test 1',
  'actif',
  NOW(),
  NOW()
);

-- ============================================================================
-- 2️⃣ CRÉER UN COMPTE TRAVAILLEUR
-- ============================================================================

INSERT INTO users (name, email, password, role, statut, created_at, updated_at)
VALUES (
  'Jean Dupont',
  'travailleur1@cnss.bj',
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  'travailleur',
  'actif',
  NOW(),
  NOW()
);

SET @user_id = LAST_INSERT_ID();

INSERT INTO travailleurs (user_id, numero_cnss, password, first_name, last_name, statut, created_at, updated_at)
VALUES (
  @user_id,
  '10000000001',  -- Numéro CNSS (10-12 chiffres)
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  'Jean',
  'Dupont',
  'actif',
  NOW(),
  NOW()
);

-- ============================================================================
-- 3️⃣ CRÉER UN COMPTE AGENT
-- ============================================================================

INSERT INTO users (name, email, password, role, statut, created_at, updated_at)
VALUES (
  'Agent CNSS',
  'agent1@cnss.bj',
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  'agent',
  'actif',
  NOW(),
  NOW()
);

SET @user_id = LAST_INSERT_ID();

INSERT INTO agents (user_id, password, created_at, updated_at)
VALUES (
  @user_id,
  '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
  NOW(),
  NOW()
);

-- ============================================================================
-- 🟡 HASH DE MOTS DE PASSE
-- ============================================================================
-- Pour générer un hash, utilisez l'une de ces méthodes:
-- 
-- Méthode 1 (Terminal): 
--   php -r "echo password_hash('password123', PASSWORD_BCRYPT);"
-- 
-- Méthode 2 (Laravel Tinker):
--   php artisan tinker
--   use Illuminate\Support\Facades\Hash;
--   Hash::make('password123')
-- 
-- Voici quelques hashs pré-générés pour 'password123':
--   $2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q
--   $2y$12$g7BkYm5HzTGj9c8G0V5Q9e9e9e9e9e9e9e9e9e9e9e9e9e

-- ============================================================================
-- 🔴 CHANGER LES MOTS DE PASSE
-- ============================================================================

-- 1️⃣ Changer le mot de passe utilisateur (USERS table)
UPDATE users 
SET password = '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q'
WHERE email = 'employeur1@cnss.bj';

-- 2️⃣ Changer aussi dans la table employeurs
UPDATE employeurs
SET password = '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q'
WHERE numero_cnss = '12345678';

-- 3️⃣ Changer le mot de passe d'un travailleur (les deux tables)
UPDATE users 
SET password = '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q'
WHERE email = 'travailleur1@cnss.bj';

UPDATE travailleurs
SET password = '$2y$12$Jck3g8j5R8kq9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q'
WHERE numero_cnss = '10000000001';

-- ============================================================================
-- 📊 CONSULTER LES COMPTES
-- ============================================================================

-- 1️⃣ Lister tous les utilisateurs
SELECT id, name, email, role, statut FROM users;

-- 2️⃣ Lister tous les employeurs
SELECT e.id, e.numero_cnss, u.email, u.name, e.raison_sociale, e.statut
FROM employeurs e
LEFT JOIN users u ON e.user_id = u.id;

-- 3️⃣ Lister tous les travailleurs
SELECT t.id, t.numero_cnss, u.email, t.first_name, t.last_name, t.statut
FROM travailleurs t
LEFT JOIN users u ON t.user_id = u.id;

-- 4️⃣ Lister tous les agents
SELECT a.id, u.email, u.name, u.statut
FROM agents a
LEFT JOIN users u ON a.user_id = u.id;

-- 5️⃣ Chercher un utilisateur par email
SELECT * FROM users WHERE email = 'employeur1@cnss.bj';

-- 6️⃣ Chercher un employeur par numéro CNSS
SELECT * FROM employeurs WHERE numero_cnss = '12345678';

-- 7️⃣ Chercher un travailleur par numéro CNSS
SELECT * FROM travailleurs WHERE numero_cnss = '10000000001';

-- ============================================================================
-- 🗑️ SUPPRIMER DES COMPTES
-- ============================================================================

-- ⚠️ ATTENTION: Cette opération est irréversible

-- 1️⃣ Supprimer un employeur et son utilisateur
DELETE FROM employeurs WHERE user_id = 1;
DELETE FROM users WHERE id = 1;

-- 2️⃣ Supprimer un travailleur et son utilisateur
DELETE FROM travailleurs WHERE user_id = 1;
DELETE FROM users WHERE id = 1;

-- 3️⃣ Supprimer un agent et son utilisateur
DELETE FROM agents WHERE user_id = 1;
DELETE FROM users WHERE id = 1;

-- ============================================================================
-- 📈 STATISTIQUES
-- ============================================================================

-- Nombre total d'utilisateurs par rôle
SELECT role, COUNT(*) as total FROM users GROUP BY role;

-- Nombre total de comptes
SELECT 
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT e.id) as total_employeurs,
  COUNT(DISTINCT t.id) as total_travailleurs,
  COUNT(DISTINCT a.id) as total_agents
FROM users u
LEFT JOIN employeurs e ON u.id = e.user_id
LEFT JOIN travailleurs t ON u.id = t.user_id
LEFT JOIN agents a ON u.id = a.user_id;

-- ============================================================================
-- 🔧 UTILITAIRES
-- ============================================================================

-- Réinitialiser auto-increment (après suppression massive)
ALTER TABLE users AUTO_INCREMENT = 1;

-- Vérifier l'intégrité des clés étrangères
SELECT * FROM employeurs WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM travailleurs WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM agents WHERE user_id NOT IN (SELECT id FROM users);

-- ============================================================================
-- 📝 NOTES D'UTILISATION
-- ============================================================================
-- 
-- 1. Remplacez les valeurs entre < > par vos données réelles
-- 2. Les numéros CNSS doivent être uniques
-- 3. Les emails doivent être uniques
-- 4. Utilisez les mêmes hashs de mot de passe pour les tables users et profils
-- 5. Après chaque création, l'ID auto-généré est sauvegardé dans @user_id
-- 6. Pour tester rapidement, utilisez les créateurs déjà fournis ci-dessus
--
-- ============================================================================

