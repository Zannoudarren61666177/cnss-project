<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Travailleur;

class Prestation extends Model
{
    use HasFactory;

    protected $fillable = [
        'travailleur_id',
        'type',
        'montant',
        'status',
        'date_debut',
        'date_fin',
    ];

    public function travailleur()
    {
        return $this->belongsTo(Travailleur::class);
    }
}
