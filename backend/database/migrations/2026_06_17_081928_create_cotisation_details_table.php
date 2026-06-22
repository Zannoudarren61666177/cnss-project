<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotisation_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cotisation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('travailleur_id')->constrained()->cascadeOnDelete();
            $table->decimal('salaire_brut', 12, 2);
            $table->decimal('taux_salarial', 5, 2);
            $table->decimal('taux_patronal', 5, 2);
            $table->decimal('montant_salarial', 12, 2);
            $table->decimal('montant_patronal', 12, 2);
            $table->decimal('montant_total', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotisation_details');
    }
};