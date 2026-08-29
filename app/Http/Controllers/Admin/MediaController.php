<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:10240'],
        ]);

        $file = $request->file('image');
        $path = $file->store('uploads', 'public');
        $url = Storage::url($path);

        ActivityLogger::log(
            action: 'created',
            subjectType: 'Media',
            subjectId: null,
            subjectTitle: 'Uploaded image: '.$file->getClientOriginalName(),
            details: ['url' => $url, 'size_bytes' => $file->getSize()]
        );

        return response()->json([
            'success' => true,
            'url' => $url,
            'filename' => $file->getClientOriginalName(),
        ]);
    }
}
