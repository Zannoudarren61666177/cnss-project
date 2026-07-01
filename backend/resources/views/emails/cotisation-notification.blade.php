<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Notification CNSS</title>
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 600px; margin: 0 auto;">

    {{-- En-tête CNSS --}}
    <div style="background: #2563eb; padding: 14px 16px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">
            CAISSE NATIONALE DE SÉCURITÉ SOCIALE
        </h1>
        <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 12px;">
            01 BP 374 Cotonou — Tél : 01 21 30 27 21 / 01 21 30 27 27
        </p>
    </div>

    {{-- Body --}}
    <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">

        <p>Bonjour <strong>{{ $cotisation->employeur?->company_name ?? 'Employeur' }}</strong>,</p>

        @if ($type === 'generee')
            <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px;">Votre cotisation mensuelle a été calculée et est disponible pour paiement.</p>
            </div>
            <p>Vous avez jusqu'au <strong>15/{{ $cotisation->mois }}/{{ $cotisation->annee }}</strong> pour effectuer votre paiement afin d'éviter toute pénalité.</p>

        @elseif ($type === 'rappel')
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px;">⚠️ Votre cotisation est due dans <strong>3 jours</strong>.</p>
            </div>
            <p>Pensez à effectuer votre paiement avant le <strong>15/{{ $cotisation->mois }}/{{ $cotisation->annee }}</strong>.</p>

        @elseif ($type === 'jour_j')
            <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px;">🔔 <strong>Aujourd'hui est le dernier jour</strong> pour payer votre cotisation sans pénalité.</p>
            </div>

        @elseif ($type === 'penalite')
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px;">❌ Une pénalité de <strong>{{ $taux }}%</strong> a été appliquée pour retard de paiement.</p>
            </div>
        @endif

        {{-- Résumé cotisation --}}
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
                <td style="padding: 10px; font-weight: bold;">Période</td>
                <td style="padding: 10px;">
                    {{ DateTime::createFromFormat('!m', $cotisation->mois)->format('F') }} {{ $cotisation->annee }}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Référence</td>
                <td style="padding: 10px;">{{ $cotisation->reference ?? 'N/A' }}</td>
            </tr>
            <tr style="background: #e5e7eb;">
                <td style="padding: 10px; font-weight: bold;">Nombre de travailleurs</td>
                <td style="padding: 10px;">{{ $cotisation->details->count() }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Masse salariale</td>
                <td style="padding: 10px;">
                    {{ number_format($cotisation->details->sum('salaire_brut'), 0, ',', ' ') }} FCFA
                </td>
            </tr>
            <tr style="background: #e5e7eb;">
                <td style="padding: 10px; font-weight: bold;">Part salariale (3,6%)</td>
                <td style="padding: 10px;">
                    {{ number_format($cotisation->details->sum('montant_salarial'), 0, ',', ' ') }} FCFA
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Part patronale (15,4%)</td>
                <td style="padding: 10px;">
                    {{ number_format($cotisation->details->sum('montant_patronal'), 0, ',', ' ') }} FCFA
                </td>
            </tr>

            @if ($type === 'penalite' && $montantPenalite > 0)
            <tr style="background: #fef2f2;">
                <td style="padding: 10px; font-weight: bold; color: #dc2626;">Pénalité ({{ $taux }}%)</td>
                <td style="padding: 10px; color: #dc2626; font-weight: bold;">
                    + {{ number_format($montantPenalite, 0, ',', ' ') }} FCFA
                </td>
            </tr>
            @endif

            <tr style="background: #2563eb;">
                <td style="padding: 12px; font-weight: bold; color: white; font-size: 16px;">Total à payer</td>
                <td style="padding: 12px; color: white; font-weight: bold; font-size: 18px;">
                    {{ number_format($cotisation->montant + ($montantPenalite ?? 0), 0, ',', ' ') }} FCFA
                </td>
            </tr>
            <tr style="background: #e5e7eb;">
                <td style="padding: 10px; font-weight: bold;">Date limite</td>
                <td style="padding: 10px; font-weight: bold; color: #dc2626;">
                    15/{{ $cotisation->mois }}/{{ $cotisation->annee }}
                </td>
            </tr>
        </table>

        <p style="font-size: 13px; color: #6b7280; text-align: center;">
            Pour voir le détail complet par travailleur, connectez-vous à votre espace employeur.
        </p>

        <div style="text-align: center; margin: 24px 0;">
            <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/employeur/dashboard"
               style="background: #2563eb; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Voir et payer ma cotisation
            </a>
        </div>
    </div>

    {{-- Footer --}}
    <div style="background: #1e3a5f; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="color: #93c5fd; margin: 0; font-size: 13px;">
            CNSS Bénin — Caisse Nationale de Sécurité Sociale<br>
            Cet email est envoyé automatiquement, merci de ne pas y répondre.
        </p>
    </div>

</body>
</html>