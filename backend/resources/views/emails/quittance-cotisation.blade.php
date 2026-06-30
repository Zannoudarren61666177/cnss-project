<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Quittance de cotisation CNSS</title>
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

        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px; color: #15803d;">
                ✅ Votre paiement de cotisation a bien été reçu.
            </p>
        </div>

        <p>Bonjour <strong>{{ $cotisation->employeur?->company_name ?? '' }}</strong>,</p>
        <p>Nous vous confirmons la bonne réception de votre paiement de cotisation. Vous trouverez ci-joint votre quittance au format PDF.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
                <td style="padding: 10px; font-weight: bold;">Référence</td>
                <td style="padding: 10px;">{{ $cotisation->reference ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Période</td>
                <td style="padding: 10px;">{{ $cotisation->mois }}/{{ $cotisation->annee }}</td>
            </tr>
            <tr style="background: #e5e7eb;">
                <td style="padding: 10px; font-weight: bold;">Date de paiement</td>
                <td style="padding: 10px;">{{ $cotisation->date_paiement ? \Carbon\Carbon::parse($cotisation->date_paiement)->format('d/m/Y') : now()->format('d/m/Y') }}</td>
            </tr>
            <tr style="background: #16a34a;">
                <td style="padding: 12px; font-weight: bold; color: white; font-size: 16px;">Montant payé</td>
                <td style="padding: 12px; color: white; font-weight: bold; font-size: 18px;">
                    {{ number_format($cotisation->montant, 0, ',', ' ') }} FCFA
                </td>
            </tr>
        </table>

        <p>Merci de votre confiance.</p>
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