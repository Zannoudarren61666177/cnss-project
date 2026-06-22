<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CotisationDetail extends Model
{
    protected $fillable = [
        'cotisation_id', 'travailleur_id', 'salaire_brut',
        'taux_salarial', 'taux_patronal',
        'montant_salarial', 'montant_patronal', 'montant_total',
    ];

    public function cotisation()
    {
        return $this->belongsTo(Cotisation::class);
    }

    public function travailleur()
    {
        return $this->belongsTo(Travailleur::class);
    }
}