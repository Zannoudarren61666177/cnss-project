<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $syncPassword = function (string $table): void {
            $records = DB::table($table)->whereNotNull('user_id')->whereNull('password')->get(['id', 'user_id']);

            foreach ($records as $record) {
                $password = DB::table('users')->where('id', $record->user_id)->value('password');

                if ($password !== null) {
                    DB::table($table)->where('id', $record->id)->update(['password' => $password]);
                }
            }
        };

        $syncPassword('employeurs');
        $syncPassword('travailleurs');
        $syncPassword('agents');
    }

    public function down(): void
    {
        // Reset passwords to NULL
        DB::statement('UPDATE employeurs SET password = NULL');
        DB::statement('UPDATE travailleurs SET password = NULL');
        DB::statement('UPDATE agents SET password = NULL');
    }
};
