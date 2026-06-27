<?php
namespace App\Services\Chatbot;

use Illuminate\Support\Facades\Http;

class OpenAIEngine implements ChatbotEngineInterface
{
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY', '');
        $this->model = env('OPENAI_MODEL', 'gpt-3.5-turbo');
    }

    public function repondre(string $message): array
    {
        if (empty($this->apiKey)) {
            return [
                'reponse' => "Clé API OpenAI non configurée. Veuillez contacter l'administrateur.",
                'source' => null,
                'trouve' => false,
            ];
        }

        try {
            $systemPrompt = "Tu es un assistant virtuel pour la CNSS (Caisse Nationale de Sécurité Sociale). Tu dois répondre aux questions des utilisateurs de manière professionnelle, précise et utile. Tes réponses doivent être en français. Si tu ne connais pas la réponse, suggère à l'utilisateur de contacter le support ou de consulter la FAQ.";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => false,
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $message],
                ],
                'max_tokens' => 500,
                'temperature' => 0.7,
            ]);

            if (!$response->successful()) {
                \Log::error('OpenAI API Error: ' . $response->body());
                return [
                    'reponse' => "Erreur de communication avec le service d'IA. Veuillez réessayer plus tard.",
                    'source' => null,
                    'trouve' => false,
                ];
            }

            $data = $response->json();
            $aiResponse = $data['choices'][0]['message']['content'] ?? "Pas de réponse générée.";

            return [
                'reponse' => $aiResponse,
                'source' => 'OpenAI',
                'trouve' => true,
            ];

        } catch (\Exception $e) {
            \Log::error('OpenAI Exception: ' . $e->getMessage());
            return [
                'reponse' => "Une erreur est survenue. Veuillez réessayer ou contacter le support.",
                'source' => null,
                'trouve' => false,
            ];
        }
    }
}
