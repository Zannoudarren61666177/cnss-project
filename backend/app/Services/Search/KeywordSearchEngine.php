<?php
namespace App\Services\Search;

use App\Models\Faq;
use App\Models\Actualite;

class KeywordSearchEngine implements SearchEngineInterface
{
    public function rechercher(string $requete): array
    {
        $termes = '%' . trim($requete) . '%';
        $resultats = [];

        $faqs = Faq::where('actif', true)
            ->where(function ($q) use ($termes) {
                $q->where('question', 'like', $termes)
                  ->orWhere('reponse', 'like', $termes);
            })
            ->limit(5)
            ->get();

        foreach ($faqs as $faq) {
            $resultats[] = [
                'type'    => 'faq',
                'title'   => $faq->question,
                'excerpt' => mb_substr($faq->reponse, 0, 120) . '...',
                'url'     => null,
            ];
        }

            $actualites = Actualite::where('titre', 'like', $termes)
            ->orWhere('description', 'like', $termes)
            ->limit(5)
            ->get();

        foreach ($actualites as $actu) {
            $resultats[] = [
                'type'    => 'actualite',
                'title'   => $actu->titre,
                'excerpt' => mb_substr($actu->extrait ?? $actu->description, 0, 120) . '...',
                'url'     => null,
            ];
        }

        return $resultats;
    }
}