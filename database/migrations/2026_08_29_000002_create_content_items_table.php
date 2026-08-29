<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_items', function (Blueprint $table) {
            $table->id();
            // services | pillars | home_highlights | clinic_details
            $table->string('collection')->index();
            $table->string('title');
            $table->longText('body')->nullable();
            // Lucide icon name, e.g. "Stethoscope".
            $table->string('icon')->nullable();
            $table->string('image_path')->nullable();
            // Per-collection extras (tone, badge, cta label, address lines...).
            $table->json('meta')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['collection', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_items');
    }
};
