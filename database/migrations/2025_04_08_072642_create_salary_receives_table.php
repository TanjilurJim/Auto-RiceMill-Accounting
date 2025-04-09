<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalaryReceivesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salary_receives', function (Blueprint $table) {
            $table->id(); // auto-increment primary key
            $table->string('vch_no')->unique(); // Unique Voucher Number
            $table->date('date'); // Date of salary received
            $table->foreignId('employee_id')->constrained('employees'); // Foreign key to Employee table
            $table->foreignId('received_by')->constrained('received_modes'); // Foreign key to ReceivedMode table
            $table->decimal('amount', 10, 2); // Amount received
            $table->text('description')->nullable(); // Optional description field
            $table->timestamps(); // Created_at and Updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('salary_receives');
    }
}
