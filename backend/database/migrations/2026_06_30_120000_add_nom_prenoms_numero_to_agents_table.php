<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('agents', function (Blueprint $table) {
            if (!Schema::hasColumn('agents', 'nom')) {
                $table->string('nom')->nullable()->after('email');
            }
            if (!Schema::hasColumn('agents', 'prenoms')) {
                $table->string('prenoms')->nullable()->after('nom');
            }
            if (!Schema::hasColumn('agents', 'numero_immatriculation')) {
                $table->string('numero_immatriculation')->nullable()->unique()->after('prenoms');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('agents', function (Blueprint $table) {
            if (Schema::hasColumn('agents', 'numero_immatriculation')) {
                $table->dropUnique(['numero_immatriculation']);
                $table->dropColumn('numero_immatriculation');
            }
            if (Schema::hasColumn('agents', 'prenoms')) {
                $table->dropColumn('prenoms');
            }
            if (Schema::hasColumn('agents', 'nom')) {
                $table->dropColumn('nom');
            }
        });
    }
};
