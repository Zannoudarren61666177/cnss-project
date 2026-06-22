<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actualite;

class ActualiteController extends Controller
{
    public function index()
    {
        return response()->json(
            Actualite::where('actif', true)
                ->orderByDesc('date_publication')
                ->get(['id', 'categorie', 'titre', 'description', 'extrait', 'date_publication', 'temps_lecture', 'image'])
        );
    }
}