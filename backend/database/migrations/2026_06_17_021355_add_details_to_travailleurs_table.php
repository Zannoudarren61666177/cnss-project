<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travailleurs', function (Blueprint $table) {
            $table->date('date_naissance')->nullable()->after('last_name');
            $table->string('lieu_naissance')->nullable()->after('date_naissance');
            $table->enum('sexe', ['M', 'F'])->nullable()->after('lieu_naissance');
            $table->string('nationalite')->nullable()->after('sexe');
            $table->string('adresse')->nullable()->after('cin');
            $table->string('ville')->nullable()->after('adresse');
            $table->string('type_contrat')->nullable()->after('position');
            $table->date('date_embauche')->nullable()->after('type_contrat');
            $table->decimal('salaire_brut', 12, 2)->nullable()->after('date_embauche');
            $table->string('categorie_emploi')->nullable()->after('salaire_brut');
            $table->string('piece_identite')->nullable()->after('categorie_emploi'); // chemin du fichier stocké
        });
    }

    public function down(): void
    {
        Schema::table('travailleurs', function (Blueprint $table) {
            $table->dropColumn([
                'date_naissance', 'lieu_naissance', 'sexe', 'nationalite',
                'adresse', 'ville', 'type_contrat', 'date_embauche',
                'salaire_brut', 'categorie_emploi', 'piece_identite',
            ]);
        });
    }
};