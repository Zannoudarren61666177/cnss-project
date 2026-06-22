#!/bin/bash

# ============================================================================
# 🔐 Générateur de Hash de Mot de Passe CNSS
# ============================================================================
# Utilité: Générer des hashs bcrypt pour les mots de passe
# Utilisation: bash generate_hashes.sh
# ============================================================================

echo "════════════════════════════════════════════════════════════════════════════════"
echo "🔐 GÉNÉRATEUR DE HASH DE MOT DE PASSE CNSS"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""

# Vérifier si PHP est installé
if ! command -v php &> /dev/null; then
    echo "❌ Erreur: PHP n'est pas installé"
    exit 1
fi

# Fonction pour générer un hash
generate_hash() {
    local password=$1
    php -r "echo password_hash('$password', PASSWORD_BCRYPT);"
    echo ""
}

# Menu principal
while true; do
    echo ""
    echo "Que voulez-vous faire?"
    echo "1. Générer un hash personnalisé"
    echo "2. Générer des hashs de test"
    echo "3. Quitter"
    echo ""
    read -p "Entrez votre choix (1-3): " choice

    case $choice in
        1)
            echo ""
            read -p "Entrez le mot de passe à hasher: " password
            if [ -z "$password" ]; then
                echo "❌ Le mot de passe ne peut pas être vide"
                continue
            fi
            echo ""
            echo "Hash généré:"
            echo "───────────────────────────────────────────────────────────────────────────────"
            generate_hash "$password"
            echo "───────────────────────────────────────────────────────────────────────────────"
            ;;
        2)
            echo ""
            echo "Hashs de test générés:"
            echo "───────────────────────────────────────────────────────────────────────────────"
            echo ""
            echo "password123:"
            generate_hash "password123"
            echo ""
            echo "SecurePass2024:"
            generate_hash "SecurePass2024"
            echo ""
            echo "TestAdmin123:"
            generate_hash "TestAdmin123"
            echo ""
            echo "Employeur2024:"
            generate_hash "Employeur2024"
            echo ""
            echo "Travailleur2024:"
            generate_hash "Travailleur2024"
            echo "───────────────────────────────────────────────────────────────────────────────"
            ;;
        3)
            echo ""
            echo "Au revoir!"
            exit 0
            ;;
        *)
            echo "❌ Choix invalide. Veuillez réessayer."
            ;;
    esac
done
