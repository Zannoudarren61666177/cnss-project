<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slide;

class SlideController extends Controller
{
    public function index()
    {
        return response()->json(
            Slide::where('actif', true)
                ->orderBy('ordre')
                ->get(['id', 'title', 'subtitle', 'description', 'image'])
        );
    }
}