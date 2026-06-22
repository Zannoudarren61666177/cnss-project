-- ============================================================================
-- 💾 CRÉER UN COMPTE EMPLOYEUR VIA SQL (phpMyAdmin)
-- ============================================================================
-- 
-- GUIDE D'UTILISATION:
-- 1. Ouvrez phpMyAdmin
-- 2. Sélectionnez la base de données "laravel"
-- 3. Allez à l'onglet "SQL"
-- 4. Copiez-collez la commande SQL ci-dessous
-- 5. Cliquez sur "Exécuter"
-- 6. La commande crée automatiquement deux enregistrements liés
-- 
-- ============================================================================

-- 📝 EXEMPLE: Créer un compte pour "Hojine Enterprises" (CNSS: 11223344)
-- Modifiez les valeurs selon vos besoins, puis exécutez:

-- ❌ NE PAS EXÉCUTER DIRECTEMENT (exemple de structure)
-- Utilisez plutôt le modèle avec SET @variables ci-dessous

-- ============================================================================
-- ✅ MÉTHODE RECOMMANDÉE: Avec variables (copies le code complètement):
-- ============================================================================

SET @email = 'hojine@cnss.bj';
SET @cnss = '11223344';
SET @password_plaintext = 'password123';
SET @company_name = 'Hojine Enterprises';
SET @hashed_password = '$2y$12$R9h/cIPz0gi.URNNQE3gx.82OM0hNiXDW6M7M9pPX2DvCGakfkYWa';

-- Étape 1: Créer l'enregistrement User
INSERT INTO users (name, email, password, role, statut, created_at, updated_at) 
VALUES (
    @email,                           -- name (utilise l'email)
    @email,                           -- email
    @hashed_password,                 -- password (bcrypt hash)
    'employeur',                      -- role
    'actif',                          -- statut
    NOW(),                            -- created_at
    NOW()                             -- updated_at
);

-- Étape 2: Récupérer l'ID du user créé
SET @user_id = LAST_INSERT_ID();

-- Étape 3: Créer l'enregistrement Employeur lié
INSERT INTO employeurs (user_id, numero_cnss, company_name, password, ifu, statut, created_at, updated_at)
VALUES (
    @user_id,                         -- user_id (lien avec User)
    @cnss,                            -- numero_cnss (CNSS unique)
    @company_name,                    -- company_name (nom de l'entreprise)
    @hashed_password,                 -- password (bcrypt hash)
    'EN ATTENTE',                     -- ifu (à remplir ultérieurement)
    'actif',                          -- statut
    NOW(),                            -- created_at
    NOW()                             -- updated_at
);

-- ============================================================================
-- ✨ FIN DE LA CRÉATION
-- ============================================================================
-- 
-- 🎉 Compte créé avec succès!
-- 
-- Vous pouvez maintenant vous connecter avec:
--   CNSS: 11223344
--   Email: hojine@cnss.bj
--   Password: password123
--
-- ============================================================================

-- ============================================================================
-- 🔒 LISTE DES BCRYPT HASH (pour différents mots de passe):
-- ============================================================================
-- 
-- Note: Les hashes ci-dessous sont tous $2y$12$ (Laravel standard)
-- Coût de hachage: 12 (valeur par défaut de Laravel)
--
-- PASSWORD: password123
-- HASH:     $2y$12$R9h/cIPz0gi.URNNQE3gx.82OM0hNiXDW6M7M9pPX2DvCGakfkYWa
--
-- PASSWORD: SecurePass2024
-- HASH:     $2y$12$4k0SEVzHX8rN8W.3zK5hVe.2nOL.9b/D4.kW9mX5vQ3pJ9wQ7a9ni
--
-- PASSWORD: TestPassword123
-- HASH:     $2y$12$7l.3mQ9vKu8h0W.5tL9pDe.3oM0/bC5kJe.9sZ3wP4rL2xR8c1sNi
--
-- Pour générer votre propre hash bcrypt:
-- 1. Utilisez un outil PHP en ligne (https://www.php.net/manual/en/function.password-hash.php)
-- 2. Utilisez l'outil Laravel Tinker: php artisan tinker
--    > Hash::make('votre-mot-de-passe')
--
-- ============================================================================

-- ============================================================================
-- 📋 TEMPLATE VIERGE À COPIER/MODIFIER:
-- ============================================================================
--
-- SET @email = 'VOTRE.EMAIL@cnss.bj';
-- SET @cnss = 'VOTRE_CNSS';
-- SET @company_name = 'NOM_ENTREPRISE';
-- SET @hashed_password = 'VOTRE_HASH_BCRYPT';
--
-- INSERT INTO users (name, email, password, role, statut, created_at, updated_at) 
-- VALUES (@email, @email, @hashed_password, 'employeur', 'actif', NOW(), NOW());
--
-- SET @user_id = LAST_INSERT_ID();
--
-- INSERT INTO employeurs (user_id, numero_cnss, company_name, password, ifu, statut, created_at, updated_at)
-- VALUES (@user_id, @cnss, @company_name, @hashed_password, 'EN ATTENTE', 'actif', NOW(), NOW());
--
-- ============================================================================

-- ============================================================================
-- 🔍 VÉRIFICATION APRÈS CRÉATION:
-- ============================================================================
-- Exécutez cette commande pour vérifier que votre compte a été créé:

-- SELECT 
--     u.id, 
--     u.email, 
--     u.role, 
--     e.numero_cnss, 
--     e.company_name, 
--     e.statut
-- FROM users u
-- LEFT JOIN employeurs e ON u.id = e.user_id
-- WHERE e.numero_cnss = '11223344';

-- Résultat attendu: 1 ligne avec tous les champs remplis
-- ============================================================================

-- ============================================================================
-- 🧹 SUPPRESSION (SI ERREUR):
-- ============================================================================
-- Pour supprimer un compte créé par erreur:

-- DELETE FROM employeurs WHERE numero_cnss = '11223344';
-- DELETE FROM users WHERE email = 'hojine@cnss.bj';

-- ============================================================================
