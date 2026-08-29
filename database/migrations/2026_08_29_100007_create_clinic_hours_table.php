<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinic_hours', function (Blueprint $table) {
            $table->id();
            // Null = clinic-wide hours; set = hours for one department.
            $table->foreignId('department_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            // 0 = Sunday ... 6 = Saturday
            $table->unsignedTinyInteger('day_of_week');
            $table->time('opens_at')->nullable();
            $table->time('closes_at')->nullable();
            $table->boolean('is_closed')->default(false);
            $table->timestamps();

            $table->unique(['department_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinic_hours');
    }
};
