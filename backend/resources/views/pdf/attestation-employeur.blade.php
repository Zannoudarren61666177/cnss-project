<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #1f2937; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; font-size: 20px; margin: 0; }
        .header p { font-size: 12px; color: #6b7280; margin: 4px 0; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin: 30px 0; text-transform: uppercase; }
        .info-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        .info-table td { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-table td:first-child { font-weight: bold; width: 40%; color: #4b5563; }
        .numero-box { text-align: center; background: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 15px; margin: 30px 0; }
        .numero-box .label { font-size: 12px; color: #4b5563; }
        .numero-box .numero { font-size: 22px; font-weight: bold; color: #2563eb; font-family: monospace; }
        .footer { margin-top: 60px; text-align: right; }
        .footer .date { margin-bottom: 40px; }
        .footer .signature { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RÉPUBLIQUE DU BÉNIN</h1>
        <p>Caisse Nationale de Sécurité Sociale</p>
        <p>390, Avenue Jean-Paul II, 01 BP 374 Cadjèhoun - Cotonou</p>
    </div>

    <div class="title">Attestation d'immatriculation</div>

    <p>La Caisse Nationale de Sécurité Sociale atteste que l'entreprise désignée ci-dessous est régulièrement immatriculée auprès de ses services :</p>

    <table class="info-table">
        <tr>
            <td>Raison sociale</td>
            <td>{{ $employeur->company_name }}</td>
        </tr>
        <tr>
            <td>IFU</td>
            <td>{{ $employeur->ifu ?? '—' }}</td>
        </tr>
        <tr>
            <td>Secteur d'activité</td>
            <td>{{ $employeur->secteur ?? '—' }}</td>
        </tr>
        <tr>
            <td>Adresse</td>
            <td>{{ $employeur->address ?? '—' }}</td>
        </tr>
        <tr>
            <td>Date d'immatriculation</td>
            <td>{{ $employeur->updated_at->format('d/m/Y') }}</td>
        </tr>
    </table>

    <div class="numero-box">
        <div class="label">Numéro d'immatriculation CNSS</div>
        <div class="numero">{{ $employeur->numero_cnss }}</div>
    </div>

    <p>Cette attestation est délivrée pour servir et valoir ce que de droit.</p>

    <div class="footer">
        <div class="date">Fait à Cotonou, le {{ now()->format('d/m/Y') }}</div>
        <div class="signature">Le Directeur Général</div>
    </div>
</body>
</html>