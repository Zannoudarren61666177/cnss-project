<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Quittance de cotisation</title>
</head>
<body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
    <h2 style="color: #2563eb;">Quittance de cotisation CNSS</h2>
    <p>Bonjour,</p>
    <p>Votre paiement de cotisation a bien été reçu.</p>
    <p><strong>Référence :</strong> {{ $cotisation->reference ?? 'N/A' }}</p>
    <p><strong>Montant :</strong> {{ number_format($cotisation->montant, 0, ',', ' ') }} FCFA</p>
    <p><strong>Période :</strong> {{ $cotisation->mois }}/{{ $cotisation->annee }}</p>
    <p>Vous trouverez ci-joint votre quittance au format PDF.</p>
    <p>Merci de votre confiance.</p>
    <p>L'équipe CNSS</p>
</body>
</html>
