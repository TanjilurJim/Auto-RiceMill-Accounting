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
        Schema::create('smtp_settings', function (Blueprint $t) {
            $t->id();

            $t->unsignedBigInteger('created_by')->nullable()->index();
            $t->unsignedBigInteger('updated_by')->nullable()->index();

            $t->string('host');
            $t->unsignedInteger('port')->default(587);
            $t->enum('encryption', ['none', 'ssl', 'tls'])->default('tls');
            $t->string('username')->nullable();
            $t->text('password')->nullable(); // will be encrypted via cast
            $t->string('from_name')->nullable();
            $t->string('from_address')->nullable();
            $t->unsignedInteger('timeout')->nullable(); // seconds
            $t->boolean('active')->default(true);


            $t->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('smtp_settings');
    }
};
