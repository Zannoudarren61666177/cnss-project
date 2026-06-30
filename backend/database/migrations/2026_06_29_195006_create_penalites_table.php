<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penalites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cotisation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employeur_id')->constrained()->cascadeOnDelete();
            $table->decimal('montant_cotisation', 12, 2);
            $table->decimal('taux', 5, 2);
            $table->decimal('montant', 12, 2);
            $table->unsignedTinyInteger('mois_retard');
            $table->string('status')->default('en_attente');
            $table->timestamp('date_application');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penalites');
    }
};