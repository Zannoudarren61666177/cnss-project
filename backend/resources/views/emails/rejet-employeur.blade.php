<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto;">

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

        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px; color: #dc2626; font-weight: bold;">
                ❌ Votre demande d'immatriculation a été rejetée.
            </p>
        </div>

        <p>Bonjour <strong>{{ $employeur->company_name }}</strong>,</p>

        <p>Après vérification, votre demande d'immatriculation a malheureusement été rejetée pour la raison suivante :</p>

        <div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #991b1b;">
                {{ $raison }}
            </p>
        </div>

        <p>Si vous pensez qu'il s'agit d'une erreur ou que vous pouvez corriger les éléments mentionnés, veuillez soumettre à nouveau votre demande ou contacter le support.</p>

        <p>Cordialement,<br>L'équipe CNSS Digital</p>

    </div>

    {{-- Footer --}}
    <div style="background: #1e3a5f; padding: 14px; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="color: #93c5fd; margin: 0; font-size: 12px;">
            CNSS Bénin — Caisse Nationale de Sécurité Sociale<br>
            Cet email est envoyé automatiquement, merci de ne pas y répondre.
        </p>
    </div>

</body>
</html>