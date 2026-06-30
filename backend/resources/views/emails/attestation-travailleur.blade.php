<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 600px; margin: 0 auto;">

    {{-- En-tête CNSS --}}
    <div style="background: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <img src="{{ asset('images/cnsslogo.png') }}" 
            style="height: 60px; width: auto; margin-bottom: 8px;" 
            alt="Logo CNSS">
        <h1 style="color: white; margin: 0; font-size: 20px; letter-spacing: 1px;">
            CAISSE NATIONALE DE SÉCURITÉ SOCIALE
        </h1>
        <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 13px;">
            01 BP 374 Cotonou — Tél : 01 21 30 27 21 / 01 21 30 27 27
        </p>
    </div>

    {{-- Contenu --}}
    <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">

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

    </div>

    {{-- Footer --}}
    <div style="background: #1e3a5f; padding: 14px; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="color: #93c5fd; margin: 0; font-size: 12px;">
            Cet email est envoyé automatiquement, merci de ne pas y répondre.
        </p>
    </div>

</body>
</html>