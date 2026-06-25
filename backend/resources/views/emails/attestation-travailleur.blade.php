<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
    <h2 style="color: #2563eb;">Votre affiliation CNSS est validée</h2>

    <p>Bonjour {{ $travailleur->first_name }} {{ $travailleur->last_name }},</p>

    <p>
        Votre employeur <strong>{{ $employeur->company_name }}</strong> vous a déclaré auprès de la
        Caisse Nationale de Sécurité Sociale du Bénin. Votre immatriculation a été validée.
    </p>

    <p style="font-size: 20px; font-weight: bold; background: #eff6ff; padding: 12px 16px; border-radius: 8px; display: inline-block; color: #2563eb; font-family: monospace;">
        {{ $travailleur->numero_cnss }}
    </p>

    <p>
        Vous trouverez en pièce jointe votre <strong>attestation d'affiliation</strong> au format PDF.
    </p>

    <p>
        Pour accéder à votre <strong>espace travailleur</strong> en ligne, créez votre compte en cliquant sur le bouton ci-dessous.
        Vous utiliserez votre numéro CNSS et l'adresse email renseignée lors de votre déclaration.
    </p>

    <p style="margin: 28px 0;">
        <a href="{{ $activationUrl }}"
           style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
            Créer mon compte et accéder à mon espace
        </a>
    </p>

    <p style="font-size: 13px; color: #6b7280;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
        <a href="{{ $activationUrl }}" style="color: #2563eb;">{{ $activationUrl }}</a>
    </p>

    <p>Cordialement,<br>L'équipe CNSS Digital</p>
</body>
</html>
