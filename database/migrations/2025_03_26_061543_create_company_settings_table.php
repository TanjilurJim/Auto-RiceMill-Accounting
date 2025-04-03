<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('created_by')->index(); // for multi-tenant
            $table->string('company_name');
            $table->string('mailing_name')->nullable();
            $table->string('country')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('financial_year')->nullable();
            $table->string('mobile')->nullable();
            $table->text('address')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable(); // image upload
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};

