<?php
namespace App\Services\Search;

use App\Models\Faq;
use App\Models\Actualite;
use Illuminate\Support\Facades\Http;

class SemanticSearchEngine implements SearchEngineInterface
{
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY', '');
        $this->model = env('GROQ_MODEL', 'llama-3.3-70b-versatile');
    }

    public function rechercher(string $requete): array
    {
        // Recherche hybride : mots-clés + sémantique
        $resultatsKeywords = $this->rechercheKeywords($requete);
        
        if (empty($this->apiKey)) {
            return $resultatsKeywords;
        }

        try {
            // Utiliser l'IA pour améliorer la recherche
            $resultatsSemantiques = $this->rechercheSemantique($requete);
            
            // Fusionner et dédupliquer les résultats
            return $this->fusionnerResultats($resultatsKeywords, $resultatsSemantiques);
        } catch (\Exception $e) {
            \Log::error('Semantic Search Error: ' . $e->getMessage());
            return $resultatsKeywords;
        }
    }

    private function rechercheKeywords(string $requete): array
    {
        $termes = '%' . trim($requete) . '%';
        $resultats = [];

        // Chercher dans les FAQs
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
                'score'   => 0.5,
            ];
        }

        // Chercher dans les Actualités
        $actualites = Actualite::where('actif', true)
            ->where(function ($q) use ($termes) {
                $q->where('titre', 'like', $termes)
                  ->orWhere('description', 'like', $termes)
                  ->orWhere('extrait', 'like', $termes);
            })
            ->limit(5)
            ->get();

        foreach ($actualites as $actu) {
            $resultats[] = [
                'type'    => 'actualite',
                'title'   => $actu->titre,
                'excerpt' => mb_substr($actu->extrait ?? $actu->description, 0, 120) . '...',
                'url'     => null,
                'score'   => 0.5,
            ];
        }

        return $resultats;
    }

    private function rechercheSemantique(string $requete): array
    {
        // Récupérer toutes les FAQs et actualités
        $faqs = Faq::where('actif', true)->get();
        $actualites = Actualite::where('actif', true)->get();

        $contexte = "";
        foreach ($faqs as $faq) {
            $contexte .= "FAQ: " . $faq->question . " - " . $faq->reponse . "\n";
        }
        foreach ($actualites as $actu) {
            $contexte .= "Actualité: " . $actu->titre . " - " . ($actu->extrait ?? $actu->description) . "\n";
        }

        $systemPrompt = "Tu es un assistant de recherche pour la CNSS. À partir d'une requête utilisateur et d'un contexte de FAQs et actualités, identifie les 5 résultats les plus pertinents. Retourne uniquement une liste JSON avec les éléments pertinents, chaque élément ayant: type (faq ou actualite), title, excerpt. Sois précis et pertinent.";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->withOptions([
            'verify' => false,
        ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => "Requête: " . $requete . "\n\nContexte:\n" . $contexte],
            ],
            'max_tokens' => 1000,
            'temperature' => 0.3,
            'response_format' => ['type' => 'json_object'],
        ]);

        if (!$response->successful()) {
            \Log::error('Groq Semantic Search Error: ' . $response->body());
            return [];
        }

        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? '[]';
        
        $resultatsIA = json_decode($content, true);
        
        if (!is_array($resultatsIA)) {
            return [];
        }

        // Ajouter un score élevé aux résultats de l'IA
        return array_map(function($item) {
            return [
                'type'    => $item['type'] ?? 'faq',
                'title'   => $item['title'] ?? '',
                'excerpt' => $item['excerpt'] ?? '',
                'url'     => null,
                'score'   => 0.9, // Score élevé pour résultats IA
            ];
        }, $resultatsIA);
    }

    private function fusionnerResultats(array $resultatsKeywords, array $resultatsSemantiques): array
    {
        $fusionnes = [];
        $vus = [];

        // Priorité aux résultats sémantiques
        foreach ($resultatsSemantiques as $resultat) {
            $cle = md5($resultat['title'] . $resultat['type']);
            if (!isset($vus[$cle])) {
                $fusionnes[] = $resultat;
                $vus[$cle] = true;
            }
        }

        // Ajouter les résultats par mots-clés non dupliqués
        foreach ($resultatsKeywords as $resultat) {
            $cle = md5($resultat['title'] . $resultat['type']);
            if (!isset($vus[$cle])) {
                $fusionnes[] = $resultat;
                $vus[$cle] = true;
            }
        }

        // Trier par score et limiter à 10 résultats
        usort($fusionnes, function($a, $b) {
            return ($b['score'] ?? 0) <=> ($a['score'] ?? 0);
        });

        return array_slice($fusionnes, 0, 10);
    }
}
