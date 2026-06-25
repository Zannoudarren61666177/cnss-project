<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Travailleur extends Model
{
    use HasFactory;

   protected $fillable = [
    'user_id', 'employeur_id', 'first_name', 'last_name',
    'cin', 'phone', 'email', 'position', 'statut', 'numero_cnss', 'raison_rejet',
    'date_naissance', 'lieu_naissance', 'sexe', 'nationalite',
    'adresse', 'ville', 'type_contrat', 'date_embauche',
    'salaire_brut', 'categorie_emploi', 'piece_identite', 'password',
];

    protected $appends = ['nom', 'prenom', 'poste'];

    public function employeur()
    {
        return $this->belongsTo(Employeur::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getNomAttribute()
    {
        return $this->last_name;
    }

    public function getPrenomAttribute()
    {
        return $this->first_name;
    }

    public function getPosteAttribute()
    {
        return $this->position;
    }
}