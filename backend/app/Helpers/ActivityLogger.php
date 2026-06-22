<?php
namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    public static function log(string $action, string $service = null): void
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action'  => $action,
            'service' => $service,
        ]);
    }
}