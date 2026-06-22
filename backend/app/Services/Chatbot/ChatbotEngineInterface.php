<?php
namespace App\Services\Chatbot;

interface ChatbotEngineInterface
{
    /**
     * @return array{reponse: string, source: ?string, trouve: bool}
     */
    public function repondre(string $message): array;
}