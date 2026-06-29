<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query();

        // Admin/agent → toutes les FAQs
        // Public → seulement les actives
        $user = $request->user();
        $isAgent = $user && in_array($user->type ?? $user->role ?? '', ['agent', 'admin']);

        if ($isAgent) {
            $query->orderByDesc('vues');
        } else {
            $query->where('actif', true)->orderByDesc('vues');
        }

        return response()->json($query->get());
    }

    public function show(string $id)
    {
        $faq = Faq::findOrFail($id);
        $faq->increment('vues');
        return response()->json($faq);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'question'  => ['required', 'string', 'max:500'],
            'reponse'   => ['required', 'string'],
            'categorie' => ['nullable', 'string', 'max:100'],
            'actif'     => ['boolean'],
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
            'actif'     => ['sometimes', 'boolean'],
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