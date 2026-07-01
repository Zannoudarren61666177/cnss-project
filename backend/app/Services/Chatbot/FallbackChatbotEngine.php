<?php
namespace App\Services\Chatbot;

class FallbackChatbotEngine implements ChatbotEngineInterface
{
    public function __construct(
        private GroqEngine $groqEngine,
        private OpenAIEngine $openAIEngine,
        private KeywordMatchEngine $keywordMatchEngine
    ) {}

    public function repondre(string $message): array
    {
        $response = $this->groqEngine->repondre($message);
        if ($response['trouve'] || ($response['source'] ?? null) === 'Groq') {
            return $response;
        }

        $response = $this->openAIEngine->repondre($message);
        if ($response['trouve'] || ($response['source'] ?? null) === 'OpenAI') {
            return $response;
        }

        return $this->keywordMatchEngine->repondre($message);
    }
}
