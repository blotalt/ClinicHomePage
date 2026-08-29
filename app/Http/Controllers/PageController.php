<?php

namespace App\Http\Controllers;

use App\Support\SiteContent;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('welcome', SiteContent::home());
    }

    public function services(): Response
    {
        return Inertia::render('services', SiteContent::services());
    }

    public function philosophy(): Response
    {
        return Inertia::render('philosophy', SiteContent::philosophy());
    }

    public function faq(): Response
    {
        return Inertia::render('faq', SiteContent::faq());
    }
}
