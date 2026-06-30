<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            if (!Schema::hasColumn('agents', 'first_name')) {
                $table->string('first_name')->nullable()->after('email');
            }
            if (!Schema::hasColumn('agents', 'last_name')) {
                $table->string('last_name')->nullable()->after('first_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            if (Schema::hasColumn('agents', 'first_name')) {
                $table->dropColumn('first_name');
            }
            if (Schema::hasColumn('agents', 'last_name')) {
                $table->dropColumn('last_name');
            }
        });
    }
};
