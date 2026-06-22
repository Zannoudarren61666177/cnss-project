<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        return Faq::where('actif', true)->orderByDesc('vues')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'question'  => ['required', 'string', 'max:500'],
            'reponse'   => ['required', 'string'],
            'categorie' => ['nullable', 'string', 'max:100'],
        ]);

        return response()->json(Faq::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $faq = Faq::findOrFail($id);

        $data = $request->validate([
            'question'  => ['sometimes', 'required', 'string', 'max:500'],
            'reponse'   => ['sometimes', 'required', 'string'],
            'categorie' => ['nullable', 'string', 'max:100'],
        ]);

        $faq->update($data);

        return response()->json($faq);
    }

    public function destroy(string $id)
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['message' => 'FAQ supprimée']);
    }
}