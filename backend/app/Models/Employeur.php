<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employeur extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'company_name', 'siret',
        'address', 'phone', 'email',
        'statut', 'numero_cnss', 'secteur', 'forme_juridique', 'password',
        'pieces_justificatives',
        'raison_rejet',
        'type_employeur',
        'ifu',
        'nom_representant',
        'prenom_representant',
        'npi_representant',
        'telephone_representant',
    ];

    protected $appends = ['raison_sociale', 'adresse', 'telephone', 'nb_travailleurs'];

    protected $casts = [
        'pieces_justificatives' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function travailleurs()
    {
        return $this->hasMany(Travailleur::class);
    }

    public function getRaisonSocialeAttribute()
    {
        return $this->company_name;
    }

    public function getAdresseAttribute()
    {
        return $this->address;
    }

    public function getTelephoneAttribute()
    {
        return $this->phone;
    }

    public function getNbTravailleursAttribute()
    {
        return $this->travailleurs()->count();
    }
}