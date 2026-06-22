<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prestation extends Model
{
    use HasFactory;

    protected $fillable = [
        'travailleur_id', 'type', 'montant',
        'status', 'date_debut', 'date_fin', 'reference',
    ];

    protected $appends = ['statut', 'nom_beneficiaire'];

    public function travailleur() { return $this->belongsTo(Travailleur::class); }

    public function getStatutAttribute()         { return $this->status; }
    public function getNomBeneficiaireAttribute() {
        return $this->travailleur
            ? ($this->travailleur->nom . ' ' . $this->travailleur->prenom)
            : '—';
    }
}