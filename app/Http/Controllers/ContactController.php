<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\AppointmentRequest;
use App\Services\TelegramService;
use App\Support\SiteContent;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Show the contact page.
     */
    public function show(): Response
    {
        return Inertia::render('contact', SiteContent::contact());
    }

    /**
     * Handle an appointment request.
     */
    public function store(ContactRequest $request): RedirectResponse
    {
        $appointmentRequest = AppointmentRequest::query()->create($request->validated());

        // Send instant alert to clinic Telegram chat/bot
        TelegramService::sendAppointmentRequestNotification($appointmentRequest);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Thanks! We will be in touch shortly.'),
        ]);

        return to_route('contact');
    }
}
