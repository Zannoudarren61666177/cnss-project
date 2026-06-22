<?php
namespace App\Services\Chatbot;

use App\Models\Faq;

class KeywordMatchEngine implements ChatbotEngineInterface
{
    public function repondre(string $message): array
    {
        $motsClefs = preg_split('/\s+/', mb_strtolower(trim($message)));
        $motsClefs = array_filter($motsClefs, fn($m) => mb_strlen($m) > 2);

        $faqs = Faq::where('actif', true)->get();

        $meilleureFaq = null;
        $meilleurScore = 0;

        foreach ($faqs as $faq) {
            $texteFaq = mb_strtolower($faq->question . ' ' . $faq->reponse);
            $score = 0;
            foreach ($motsClefs as $mot) {
                if (str_contains($texteFaq, $mot)) {
                    $score++;
                }
            }
            if ($score > $meilleurScore) {
                $meilleurScore = $score;
                $meilleureFaq = $faq;
            }
        }

        if ($meilleureFaq && $meilleurScore > 0) {
            $meilleureFaq->increment('vues');
            return [
                'reponse' => $meilleureFaq->reponse,
                'source'  => $meilleureFaq->question,
                'trouve'  => true,
            ];
        }

        return [
            'reponse' => "Je n'ai pas trouvé de réponse précise à votre question. Vous pouvez contacter notre service support ou consulter la FAQ complète.",
            'source'  => null,
            'trouve'  => false,
        ];
    }
}