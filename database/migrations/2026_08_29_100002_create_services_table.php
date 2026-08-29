<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('title');
            $table->string('slug', 160)->unique();
            // Rich text, sanitised on save.
            $table->longText('body')->nullable();
            $table->string('icon', 64)->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            // featured / show_on_home / tone / cta
            $table->json('meta')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
