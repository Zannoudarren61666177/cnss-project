<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Search\SearchEngineInterface;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(private SearchEngineInterface $engine) {}

    public function rechercher(Request $request)
    {
        $data = $request->validate(['q' => ['required', 'string', 'min:2']]);
        return response()->json($this->engine->rechercher($data['q']));
    }
}