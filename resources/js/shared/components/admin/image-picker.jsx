import { useState, useRef } from 'react';
import {
    Image as ImageIcon,
    Upload,
    Link as LinkIcon,
    Trash2,
    Check,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

const PRESETS = [
    {
        label: 'Consulting Room',
        url: '/images/home/consulting-room.svg',
    },
    {
        label: 'Care & Hands',
        url: '/images/home/holding-hands.svg',
    },
    {
        label: 'Sanctuary Lounge',
        url: '/images/philosophy/story-lounge.svg',
    },
    {
        label: 'Clinic Reception',
        url: '/images/faq/reception.svg',
    },
];

export default function ImagePicker({
    name = 'image_path',
    label = 'Image / Photo',
    defaultValue = '',
    placeholder = 'https://... or /images/...',
    helpText,
}) {
    const [value, setValue] = useState(defaultValue || '');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFile(file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await uploadFile(file);
    };

    const uploadFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file (PNG, JPG, WEBP, SVG).');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/admin/media/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            });

            const data = await res.json();
            if (res.ok && data.url) {
                setValue(data.url);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error(data.message || 'Failed to upload image.');
            }
        } catch (err) {
            toast.error('Network error during image upload.');
        } finally {
            setUploading(false);
        }
    };

    const getCsrfToken = () => {
        const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
    };

    return (
        <div className="space-y-3 rounded-xl border border-border/70 p-4.5 bg-card/60">
            <div className="flex items-center justify-between">
                <Label htmlFor={name} className="font-semibold text-sm text-ink flex items-center gap-2">
                    <ImageIcon className="size-4 text-primary" />
                    {label}
                </Label>
                {value && (
                    <button
                        type="button"
                        onClick={() => setValue('')}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                        <Trash2 className="size-3" />
                        Remove Image
                    </button>
                )}
            </div>

            {/* Hidden Input that submits to form */}
            <input type="hidden" id={name} name={name} value={value} />

            {/* Live Preview / Dropzone */}
            {value ? (
                <div className="relative group rounded-xl overflow-hidden border border-border/80 bg-muted/40 aspect-[16/9] max-h-56 flex items-center justify-center">
                    <img
                        src={value}
                        alt="Preview"
                        className="size-full object-cover"
                        onError={(e) => {
                            e.target.src = '/images/home/consulting-room.svg';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-1.5 text-xs shadow-md"
                        >
                            <Upload className="size-3.5" />
                            Change Photo
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setValue('')}
                            className="gap-1.5 text-xs shadow-md"
                        >
                            <Trash2 className="size-3.5" />
                            Clear
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2',
                        dragActive
                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-muted/30',
                    )}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="size-8 text-primary animate-spin" />
                            <p className="text-sm font-semibold text-ink">Uploading image...</p>
                        </>
                    ) : (
                        <>
                            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Upload className="size-5" />
                            </div>
                            <p className="text-sm font-semibold text-ink">
                                Click to upload or drag & drop photo
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supports PNG, JPG, WEBP, SVG up to 10MB
                            </p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Direct URL Input fallback */}
            <div className="relative">
                <LinkIcon className="size-3.5 text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-background border border-border/80 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-ink outline-hidden focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Quick Clinic Gallery Presets */}
            <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Sparkles className="size-3 text-primary" />
                    Quick Clinic Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.url}
                            type="button"
                            onClick={() => setValue(preset.url)}
                            className={cn(
                                'text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer inline-flex items-center gap-1.5',
                                value === preset.url
                                    ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                                    : 'border-border hover:bg-muted text-muted-foreground hover:text-ink',
                            )}
                        >
                            {value === preset.url && <Check className="size-3" />}
                            <span>{preset.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
        </div>
    );
}
