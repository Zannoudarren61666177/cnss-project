<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actualite extends Model
{
    protected $fillable = [
        'categorie', 'titre', 'description', 'extrait',
        'date_publication', 'temps_lecture', 'image', 'actif',
    ];
}