<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('service_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('author_name');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->longText('body')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
