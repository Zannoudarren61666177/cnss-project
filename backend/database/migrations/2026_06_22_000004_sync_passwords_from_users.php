<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Sync passwords from users table
        DB::statement('UPDATE employeurs e SET e.password = (SELECT u.password FROM users u WHERE u.id = e.user_id) WHERE e.user_id IS NOT NULL AND e.password IS NULL');
        
        DB::statement('UPDATE travailleurs t SET t.password = (SELECT u.password FROM users u WHERE u.id = t.user_id) WHERE t.user_id IS NOT NULL AND t.password IS NULL');
        
        DB::statement('UPDATE agents a SET a.password = (SELECT u.password FROM users u WHERE u.id = a.user_id) WHERE a.user_id IS NOT NULL AND a.password IS NULL');
    }

    public function down(): void
    {
        // Reset passwords to NULL
        DB::statement('UPDATE employeurs SET password = NULL');
        DB::statement('UPDATE travailleurs SET password = NULL');
        DB::statement('UPDATE agents SET password = NULL');
    }
};
