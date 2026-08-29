<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('service_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            // The web enquiry this booking came from, if any.
            $table->foreignId('appointment_request_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->dateTime('scheduled_at');
            $table->unsignedSmallInteger('duration_minutes')->default(30);
            $table->string('status', 32)->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['scheduled_at', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
