<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employeurs', function (Blueprint $table) {
            // Add pieces_justificatives if not present (some migrations may already have added it)
            if (! Schema::hasColumn('employeurs', 'pieces_justificatives')) {
                $table->json('pieces_justificatives')->nullable()->after('telephone_representant');
            }

            if (! Schema::hasColumn('employeurs', 'raison_rejet')) {
                $table->text('raison_rejet')->nullable()->after('pieces_justificatives');
            }
        });
    }

    public function down(): void
    {
        Schema::table('employeurs', function (Blueprint $table) {
            if (Schema::hasColumn('employeurs', 'raison_rejet')) {
                $table->dropColumn('raison_rejet');
            }

            if (Schema::hasColumn('employeurs', 'pieces_justificatives')) {
                $table->dropColumn('pieces_justificatives');
            }
        });
    }
};
