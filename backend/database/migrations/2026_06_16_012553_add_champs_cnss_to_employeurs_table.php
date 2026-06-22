<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employeurs', function (Blueprint $table) {
            $table->string('statut')->default('en_attente')->after('email');
            $table->string('numero_cnss')->nullable()->unique()->after('statut');
            $table->string('secteur')->nullable()->after('numero_cnss');
            $table->string('forme_juridique')->nullable()->after('secteur');
            $table->string('ifu')->nullable()->after('forme_juridique');
        });
    }

    public function down(): void
    {
        Schema::table('employeurs', function (Blueprint $table) {
            $table->dropColumn(['statut', 'numero_cnss', 'secteur', 'forme_juridique', 'ifu']);
        });
    }
};