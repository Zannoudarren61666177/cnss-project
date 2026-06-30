<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prestations', function (Blueprint $table) {
            if (!Schema::hasColumn('prestations', 'reference')) {
                $table->string('reference')->nullable()->after('id');
            }
            if (!Schema::hasColumn('prestations', 'motif')) {
                $table->text('motif')->nullable()->after('date_fin');
            }
            if (!Schema::hasColumn('prestations', 'raison_rejet')) {
                $table->string('raison_rejet')->nullable()->after('motif');
            }
        });
    }

    public function down(): void
    {
        Schema::table('prestations', function (Blueprint $table) {
            $table->dropColumn(['motif', 'raison_rejet']);
        });
    }
};