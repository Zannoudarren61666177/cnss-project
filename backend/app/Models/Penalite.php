<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penalite extends Model
{
    protected $fillable = [
        'cotisation_id',
        'employeur_id',
        'montant_cotisation',
        'taux',
        'montant',
        'mois_retard',
        'status',
        'date_application',
    ];

    protected $casts = [
        'date_application' => 'datetime',
    ];

    public function cotisation()
    {
        return $this->belongsTo(Cotisation::class);
    }

    public function employeur()
    {
        return $this->belongsTo(Employeur::class);
    }
}