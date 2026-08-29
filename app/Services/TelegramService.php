<?php

namespace App\Services;

use App\Models\AppointmentRequest;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    /**
     * Send an instant notification to Telegram when a new appointment request is received.
     */
    public static function sendAppointmentRequestNotification(AppointmentRequest $request): bool
    {
        $botToken = config('services.telegram.bot_token')
            ?: SiteSetting::get('site.telegram_bot_token')
            ?: env('TELEGRAM_BOT_TOKEN');

        $chatId = config('services.telegram.chat_id')
            ?: SiteSetting::get('site.telegram_chat_id')
            ?: env('TELEGRAM_CHAT_ID');

        if (empty($botToken) || empty($chatId)) {
            Log::info('Telegram notification skipped: bot_token or chat_id not configured.');
            return false;
        }

        $service = $request->service ?: 'General Inquiry';
        $phone = $request->phone ?: 'Not provided';
        $adminUrl = url('/admin/requests/'.$request->id);

        $text = "🌿 <b>New Appointment Request — Lumina Wellness</b>\n\n"
            ."👤 <b>Patient:</b> ".e($request->first_name.' '.$request->last_name)."\n"
            ."📧 <b>Email:</b> ".e($request->email)."\n"
            ."📞 <b>Phone:</b> ".e($phone)."\n"
            ."🩺 <b>Service:</b> ".e($service)."\n"
            ."📝 <b>Message:</b>\n<i>\"".e($request->message)."\"</i>\n\n"
            ."🕒 <b>Received:</b> ".now()->toDayDateTimeString()."\n"
            ."👉 <a href=\"".$adminUrl."\">Open in Admin Dashboard</a>";

        try {
            $response = Http::timeout(5)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => false,
            ]);

            if ($response->successful()) {
                Log::info('Telegram notification sent for appointment request #'.$request->id);
                return true;
            }

            Log::error('Telegram API error: '.$response->body());
            return false;
        } catch (\Throwable $e) {
            Log::error('Failed to send Telegram notification: '.$e->getMessage());
            return false;
        }
    }
}
