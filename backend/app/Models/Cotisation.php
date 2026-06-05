<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Employeur;

class Cotisation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employeur_id',
        'montant',
        'mois',
        'annee',
        'status',
    ];

    public function employeur()
    {
        return $this->belongsTo(Employeur::class);
    }
}
