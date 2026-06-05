<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employeur;
use Illuminate\Http\Request;

class EmployeurController extends Controller
{
    public function index()
    {
        return Employeur::with(['user', 'travailleurs'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'siret' => ['required', 'string', 'max:50', 'unique:employeurs,siret'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $data['user_id'] = $request->user()->id;

        return response()->json(Employeur::create($data), 201);
    }

    public function show(string $id)
    {
        return Employeur::with(['user', 'travailleurs'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $employeur = Employeur::findOrFail($id);

        $data = $request->validate([
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'siret' => ['sometimes', 'required', 'string', 'max:50', 'unique:employeurs,siret,' . $employeur->id],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $employeur->update($data);

        return response()->json($employeur);
    }

    public function destroy(string $id)
    {
        $employeur = Employeur::findOrFail($id);
        $employeur->delete();

        return response()->json(['message' => 'Employeur supprimé']);
    }
}
