<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

class DebugController extends \App\Http\Controllers\Controller
{
    public function testLogin(Request $request)
    {
        try {
            $controller = new AuthController();
            return $controller->login(new \Illuminate\Http\Request([
                'numero_cnss' => '16879391',
                'password' => 'password123',
            ]));
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
}
