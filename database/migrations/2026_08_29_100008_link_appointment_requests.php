<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointment_requests', function (Blueprint $table) {
            // The visitor picked a service by name; resolve it to a row when
            // we can, but keep the free-text `service` for the audit trail.
            $table->foreignId('service_id')
                ->nullable()
                ->after('phone')
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('doctor_id')
                ->nullable()
                ->after('service_id')
                ->constrained()
                ->nullOnDelete();
            // Set once the enquiry is matched to a patient record.
            $table->foreignId('patient_id')
                ->nullable()
                ->after('doctor_id')
                ->constrained()
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('appointment_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('service_id');
            $table->dropConstrainedForeignId('doctor_id');
            $table->dropConstrainedForeignId('patient_id');
        });
    }
};
