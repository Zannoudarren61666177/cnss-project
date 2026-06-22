<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('actualites', function (Blueprint $table) {
        $table->id();
        $table->string('categorie');
        $table->string('titre');
        $table->text('description');
        $table->text('extrait');
        $table->date('date_publication');
        $table->string('temps_lecture')->nullable();
        $table->string('image')->nullable();
        $table->boolean('actif')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actualites');
    }
};
