<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actualite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    public function adminIndex()
    {
        return response()->json(Actualite::orderByDesc('date_publication')->get());
    }

    public function show(string $id)
    {
        return response()->json(Actualite::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'            => 'required|string|max:255',
            'description'      => 'required|string',
            'extrait'          => 'nullable|string',
            'categorie'        => 'nullable|string',
            'date_publication' => 'nullable|date',
            'temps_lecture'    => 'nullable|string|max:50',
            'image'            => 'nullable|image|max:2048', // ← fichier image max 2MB
            'actif'            => 'boolean',
        ]);

        // Sauvegarde du fichier image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('actualites', 'public');
            $data['image'] = Storage::url($path);
        }

        return response()->json(Actualite::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $actualite = Actualite::findOrFail($id);

        $data = $request->validate([
            'titre'            => 'sometimes|required|string|max:255',
            'description'      => 'sometimes|required|string',
            'extrait'          => 'nullable|string',
            'categorie'        => 'nullable|string',
            'date_publication' => 'nullable|date',
            'temps_lecture'    => 'nullable|string|max:50',
            'image'            => 'nullable|image|max:2048', // ← fichier image max 2MB
            'actif'            => 'boolean',
        ]);

        // Nouvelle image uploadée
        if ($request->hasFile('image')) {
            // Supprime l'ancienne image si elle existe
            if ($actualite->image) {
                $oldPath = str_replace('/storage/', 'public/', $actualite->image);
                Storage::delete($oldPath);
            }
            $path = $request->file('image')->store('actualites', 'public');
            $data['image'] = Storage::url($path);
        }

        $actualite->update($data);
        return response()->json($actualite);
    }

    public function destroy(string $id)
    {
        $actualite = Actualite::findOrFail($id);

        // Supprime l'image associée
        if ($actualite->image) {
            $oldPath = str_replace('/storage/', 'public/', $actualite->image);
            Storage::delete($oldPath);
        }

        $actualite->delete();
        return response()->json(['message' => 'Supprimée']);
    }
}