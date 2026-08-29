<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppointmentRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentRequestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/requests/index', [
            'requests' => AppointmentRequest::query()
                ->latest()
                ->paginate(20)
                ->through(fn (AppointmentRequest $r): array => [
                    'id' => $r->id,
                    'name' => $r->name,
                    'email' => $r->email,
                    'phone' => $r->phone,
                    'service' => $r->service,
                    'created_at' => $r->created_at?->format('j M Y, g:ia'),
                    'is_read' => $r->read_at !== null,
                ]),
        ]);
    }

    public function show(AppointmentRequest $appointmentRequest): Response
    {
        // Opening a request marks it read.
        if ($appointmentRequest->read_at === null) {
            $appointmentRequest->update(['read_at' => now()]);
        }

        return Inertia::render('admin/requests/show', [
            'request' => [
                'id' => $appointmentRequest->id,
                'name' => $appointmentRequest->name,
                'email' => $appointmentRequest->email,
                'phone' => $appointmentRequest->phone,
                'service' => $appointmentRequest->service,
                'message' => $appointmentRequest->message,
                'created_at' => $appointmentRequest->created_at
                    ?->format('j M Y, g:ia'),
            ],
        ]);
    }

    public function destroy(
        AppointmentRequest $appointmentRequest,
    ): RedirectResponse {
        $name = $appointmentRequest->name;
        $id = $appointmentRequest->id;
        $appointmentRequest->delete();

        \App\Services\ActivityLogger::log(
            action: 'deleted',
            subjectType: 'AppointmentRequest',
            subjectId: $id,
            subjectTitle: "Request from {$name}",
            details: []
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Request deleted.'),
        ]);

        return to_route('admin.requests.index');
    }
}
