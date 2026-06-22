<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Chatbot\ChatbotEngineInterface;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function __construct(private ChatbotEngineInterface $engine) {}

    public function repondre(Request $request)
    {
        $data = $request->validate(['message' => ['required', 'string']]);
        return response()->json($this->engine->repondre($data['message']));
    }
}