<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cotisation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employeur_id', 'montant', 'mois', 'annee', 'status',
        'reference', 'echeance',
    ];

    protected $appends = ['statut', 'periode', 'montant_formate'];

    public function employeur() { return $this->belongsTo(Employeur::class); }

    public function getStatutAttribute()         { return $this->status; }
    public function getPeriodeAttribute()         { return $this->mois . '/' . $this->annee; }
    public function getMontantFormateAttribute()  {
        return number_format($this->montant, 0, ',', ' ');
    }

    public function details()
{
    return $this->hasMany(CotisationDetail::class);
}
}