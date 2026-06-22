<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937;">
    <h2>Félicitations, votre immatriculation CNSS est validée</h2>

    <p>Bonjour {{ $employeur->company_name }},</p>

    <p>
        Votre demande d'immatriculation auprès de la Caisse Nationale de Sécurité Sociale du Bénin
        a été validée. Votre numéro CNSS est le suivant :
    </p>

    <p style="font-size: 20px; font-weight: bold; background: #eff6ff; padding: 12px; border-radius: 8px; display: inline-block;">
        {{ $employeur->numero_cnss }}
    </p>

    <p>
        Pour accéder à votre espace en ligne, rendez-vous sur la page d'activation de compte
        et munissez-vous de votre numéro CNSS ainsi que de l'adresse email que vous avez
        renseignée lors de votre demande.
    </p>

    <p>Cordialement,<br>L'équipe CNSS Digital</p>
</body>
</html>