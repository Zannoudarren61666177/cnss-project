<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1a1a1a; margin: 40px; }
        .header { text-align: center; border-bottom: 3px solid #1a5fa8; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 16px; color: #1a5fa8; margin: 4px 0; }
        .header p { margin: 2px 0; font-size: 11px; color: #555; }
        .titre { text-align: center; font-size: 18px; font-weight: bold; text-transform: uppercase;
                 letter-spacing: 2px; margin: 24px 0; color: #1a5fa8; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        td { padding: 8px 12px; border: 1px solid #ddd; font-size: 11px; }
        td:first-child { font-weight: bold; background: #f5f8ff; width: 40%; }
        .numero { text-align: center; font-size: 20px; font-weight: bold; color: #1a5fa8;
                  border: 3px solid #1a5fa8; padding: 12px; margin: 24px auto; width: 60%; }
        .footer { margin-top: 40px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 12px; }
        .signature { margin-top: 40px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RÉPUBLIQUE DU BÉNIN</h1>
        <p>Caisse Nationale de Sécurité Sociale</p>
        <p>390, Avenue Jean-Paul II — 01 BP 374 Cadjèhoun, Cotonou</p>
        <p>Tél : +229 90 19 00 00 — info@cnss.bj</p>
    </div>

    <div class="titre">Attestation d'Affiliation</div>

    <p style="text-align:center; margin-bottom:20px;">
        La Caisse Nationale de Sécurité Sociale du Bénin atteste que le travailleur ci-dessous
        est régulièrement affilié et à jour de ses cotisations.
    </p>

    <table>
        <tr><td>Nom et Prénom(s)</td><td>{{ strtoupper($travailleur->last_name) }} {{ $travailleur->first_name }}</td></tr>
        <tr><td>Date de naissance</td><td>{{ $travailleur->date_naissance ? \Carbon\Carbon::parse($travailleur->date_naissance)->format('d/m/Y') : '—' }}</td></tr>
        <tr><td>Employeur</td><td>{{ $employeur->company_name ?? '—' }}</td></tr>
        <tr><td>Numéro CNSS Employeur</td><td>{{ $employeur->numero_cnss ?? '—' }}</td></tr>
        <tr><td>Poste occupé</td><td>{{ $travailleur->position ?? '—' }}</td></tr>
        <tr><td>Date d'embauche</td><td>{{ $travailleur->date_embauche ? \Carbon\Carbon::parse($travailleur->date_embauche)->format('d/m/Y') : '—' }}</td></tr>
        <tr><td>Statut</td><td>Actif</td></tr>
    </table>

    <div class="numero">
        N° CNSS Travailleur : {{ $travailleur->numero_cnss ?? 'En attente d\'attribution' }}
    </div>

    <div class="signature">
        <p>Fait à Cotonou, le {{ \Carbon\Carbon::now()->format('d/m/Y') }}</p>
        <br><br>
        <p><strong>Le Directeur Général</strong></p>
        <p>Apollinaire CADETE TCHINTCHIN</p>
    </div>

    <div class="footer">
        Document généré automatiquement par CNSS Digital — Valable uniquement avec le cachet officiel de la CNSS
    </div>
</body>
</html>