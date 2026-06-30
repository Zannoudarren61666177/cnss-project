<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        return Ticket::with('user')->orderByDesc('created_at')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'sujet' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priorite' => ['nullable', 'in:Basse,Normale,Haute,Critique'],
        ]);

        return response()->json(Ticket::create($data), 201);
    }

    public function show(string $id)
    {
        return Ticket::with('user')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $ticket = Ticket::findOrFail($id);

        $data = $request->validate([
            'statut' => ['nullable', 'in:Ouvert,En cours,Résolu,Fermé'],
            'reponse' => ['nullable', 'string'],
            'priorite' => ['nullable', 'in:Basse,Normale,Haute,Critique'],
        ]);

        if (isset($data['statut']) && $data['statut'] === 'Résolu') {
            $data['date_resolution'] = now();
        }

        $ticket->update($data);

        return response()->json($ticket);
    }

    public function destroy(string $id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();

        return response()->json(['message' => 'Ticket supprimé']);
    }
}
