<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travailleurs', function (Blueprint $table) {
            $table->string('statut')->default('actif')->after('position');
            $table->string('numero_cnss')->nullable()->unique()->after('statut');
        });
    }

    public function down(): void
    {
        Schema::table('travailleurs', function (Blueprint $table) {
            $table->dropColumn(['statut', 'numero_cnss']);
        });
    }
};