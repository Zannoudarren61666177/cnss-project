<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index()
    {
        return Agent::with('user')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $data['user_id'] = $request->user()->id;

        return response()->json(Agent::create($data), 201);
    }

    public function show(string $id)
    {
        return Agent::with('user')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $agent = Agent::findOrFail($id);

        $data = $request->validate([
            'type' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $agent->update($data);

        return response()->json($agent);
    }

    public function destroy(string $id)
    {
        $agent = Agent::findOrFail($id);
        $agent->delete();

        return response()->json(['message' => 'Agent supprimé']);
    }
}
