<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937;">
    <h2>Votre immatriculation CNSS a été rejetée</h2>

    <p>Bonjour {{ $employeur->company_name }},</p>

    <p>
        Après vérification, votre demande d'immatriculation a malheureusement été rejetée pour la raison suivante :
    </p>

    <p style="font-size: 16px; font-weight: bold; background: #fee2e2; padding: 12px; border-radius: 8px; display: inline-block;">
        {{ $raison }}
    </p>

    <p>
        Si vous pensez qu'il s'agit d'une erreur ou que vous pouvez corriger les éléments mentionnés, veuillez soumettre à nouveau votre demande ou contacter le support.
    </p>

    <p>Cordialement,<br>L'équipe CNSS Digital</p>
</body>
</html>
