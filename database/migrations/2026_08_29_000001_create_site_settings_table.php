<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            // Dot-notated, e.g. "home.hero.title" or "contact.page.subtitle".
            $table->string('key')->unique();
            // Which admin screen edits it: home, services, philosophy, contact, site.
            $table->string('group')->index();
            $table->longText('value')->nullable();
            // text = plain string, html = rich text, list = JSON array of strings.
            $table->string('type')->default('text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
