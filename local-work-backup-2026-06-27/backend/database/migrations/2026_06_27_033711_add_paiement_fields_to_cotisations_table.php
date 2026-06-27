<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotisations', function (Blueprint $table) {
            $table->string('transaction_id')->nullable()->after('reference');
            $table->timestamp('date_paiement')->nullable()->after('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::table('cotisations', function (Blueprint $table) {
            $table->dropColumn(['transaction_id', 'date_paiement']);
        });
    }
};