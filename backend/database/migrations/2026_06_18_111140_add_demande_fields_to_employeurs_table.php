<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employeurs', function (Blueprint $table) {
            $table->string('siret')->nullable()->change();

            if (!Schema::hasColumn('employeurs', 'type_employeur')) {
                $table->string('type_employeur')->nullable()->after('company_name');
            }
            if (!Schema::hasColumn('employeurs', 'ifu')) {
                $table->string('ifu')->nullable()->after('siret');
            }
            if (!Schema::hasColumn('employeurs', 'numero_cnss')) {
                $table->string('numero_cnss')->nullable()->unique()->after('ifu');
            }
            if (!Schema::hasColumn('employeurs', 'statut')) {
                $table->string('statut')->default('en_attente')->after('numero_cnss');
            }
            if (!Schema::hasColumn('employeurs', 'nom_representant')) {
                $table->string('nom_representant')->nullable()->after('email');
            }
            if (!Schema::hasColumn('employeurs', 'prenom_representant')) {
                $table->string('prenom_representant')->nullable()->after('nom_representant');
            }
            if (!Schema::hasColumn('employeurs', 'npi_representant')) {
                $table->string('npi_representant')->nullable()->after('prenom_representant');
            }
            if (!Schema::hasColumn('employeurs', 'telephone_representant')) {
                $table->string('telephone_representant')->nullable()->after('npi_representant');
            }
            if (!Schema::hasColumn('employeurs', 'pieces_justificatives')) {
                $table->json('pieces_justificatives')->nullable()->after('telephone_representant');
            }
        });
    }

    public function down(): void
    {
        Schema::table('employeurs', function (Blueprint $table) {
            $table->dropColumn([
                'type_employeur', 'ifu', 'numero_cnss', 'statut',
                'nom_representant', 'prenom_representant', 'npi_representant',
                'telephone_representant', 'pieces_justificatives',
            ]);
        });
    }
};