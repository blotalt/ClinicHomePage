import { Form, Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/shared/components/admin/rich-text-editor';
import ImagePicker from '@/shared/components/admin/image-picker';
import Heading from '@/shared/components/common/heading';
import InputError from '@/shared/components/common/input-error';
import { adminHome } from '@/shared/lib/admin-nav';
import { ICON_NAMES, resolveIcon } from '@/shared/lib/icons';

/** Which extra fields each collection needs. */
const EXTRAS = {
    services: ['tone', 'featured', 'show_on_home', 'cta', 'image', 'clinical'],
    pillars: ['tone', 'image'],
    home_highlights: ['image'],
    clinic_details: ['lines', 'badge', 'href', 'image'],
};

const TONES = [
    { value: 'bg-mint', label: 'Mint' },
    { value: 'bg-sage', label: 'Sage' },
    { value: 'bg-sky text-brand', label: 'Sky' },
    { value: 'bg-brand text-white', label: 'Brand (dark)' },
    { value: 'bg-mint text-brand', label: 'Mint + brand text' },
];

const NONE = '__none__';

export default function ContentForm({
    collection,
    collectionLabel,
    basePath,
    item,
    departments = [],
    doctors = [],
}) {
    const editing = item !== null;
    const extras = EXTRAS[collection] ?? [];

    const [pendingDelete, setPendingDelete] = useState(false);
    const [icon, setIcon] = useState(item?.icon ?? ICON_NAMES[0]);
    const [tone, setTone] = useState(item?.meta?.tone ?? TONES[0].value);
    const [lines, setLines] = useState((item?.meta?.lines ?? ['']).join('\n'));
    const [departmentId, setDepartmentId] = useState(
        item?.department_id ? String(item.department_id) : NONE,
    );
    const [doctorIds, setDoctorIds] = useState(item?.doctor_ids ?? []);

    const IconPreview = resolveIcon(icon);

    return (
        <>
            <Head title={editing ? `Edit ${item.title}` : 'New item'} />

            <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
                <Link
                    href={basePath}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to {collectionLabel.toLowerCase()}
                </Link>

                <Heading
                    title={
                        editing
                            ? `Edit ${collection === 'services' ? 'service' : 'item'}`
                            : `New ${collectionLabel.toLowerCase()} item`
                    }
                    description="This content appears on the public site."
                />

                <Form
                    action={editing ? `${basePath}/${item.id}` : basePath}
                    method={editing ? 'put' : 'post'}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={item?.title ?? ''}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            {collection !== 'home_highlights' ? (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Description</Label>
                                        <RichTextEditor
                                            name="body"
                                            defaultValue={item?.body ?? ''}
                                            placeholder="Describe this in a sentence or two…"
                                        />
                                        <InputError message={errors.body} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="icon">Icon</Label>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-accent text-accent-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
                                                <IconPreview
                                                    className="size-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <Select
                                                name="icon"
                                                value={icon}
                                                onValueChange={setIcon}
                                            >
                                                <SelectTrigger
                                                    id="icon"
                                                    className="w-full"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ICON_NAMES.map((name) => (
                                                        <SelectItem
                                                            key={name}
                                                            value={name}
                                                        >
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <InputError message={errors.icon} />
                                    </div>
                                </>
                            ) : null}

                            {/* Relational fields, services only. */}
                            {extras.includes('clinical') ? (
                                <section className="space-y-5 rounded-lg border p-5">
                                    <h2 className="text-sm font-semibold tracking-wide uppercase">
                                        Clinical details
                                    </h2>

                                    <div className="grid gap-2">
                                        <Label htmlFor="department">
                                            Department
                                        </Label>
                                        {departmentId !== NONE ? (
                                            <input
                                                type="hidden"
                                                name="department_id"
                                                value={departmentId}
                                            />
                                        ) : null}
                                        <Select
                                            value={departmentId}
                                            onValueChange={setDepartmentId}
                                        >
                                            <SelectTrigger
                                                id="department"
                                                className="w-full"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={NONE}>
                                                    No department
                                                </SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem
                                                        key={dept.id}
                                                        value={String(dept.id)}
                                                    >
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.department_id}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="duration_minutes">
                                                Appointment length (minutes)
                                            </Label>
                                            <Input
                                                id="duration_minutes"
                                                name="duration_minutes"
                                                type="number"
                                                min="0"
                                                max="1440"
                                                defaultValue={
                                                    item?.duration_minutes ?? ''
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.duration_minutes
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Price</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                defaultValue={item?.price ?? ''}
                                            />
                                            <InputError
                                                message={errors.price}
                                            />
                                        </div>
                                    </div>

                                    {doctors.length > 0 ? (
                                        <fieldset className="grid gap-3">
                                            <legend className="text-sm font-medium">
                                                Practitioners offering this
                                            </legend>
                                            {doctors.map((doctor) => {
                                                const checked =
                                                    doctorIds.includes(
                                                        doctor.id,
                                                    );

                                                return (
                                                    <div
                                                        key={doctor.id}
                                                        className="flex items-center gap-3"
                                                    >
                                                        {checked ? (
                                                            <input
                                                                type="hidden"
                                                                name="doctor_ids[]"
                                                                value={
                                                                    doctor.id
                                                                }
                                                            />
                                                        ) : null}
                                                        <Checkbox
                                                            id={`doctor-${doctor.id}`}
                                                            checked={checked}
                                                            onCheckedChange={(
                                                                value,
                                                            ) =>
                                                                setDoctorIds(
                                                                    (prev) =>
                                                                        value ===
                                                                        true
                                                                            ? [
                                                                                  ...prev,
                                                                                  doctor.id,
                                                                              ]
                                                                            : prev.filter(
                                                                                  (
                                                                                      id,
                                                                                  ) =>
                                                                                      id !==
                                                                                      doctor.id,
                                                                              ),
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`doctor-${doctor.id}`}
                                                            className="font-normal"
                                                        >
                                                            {doctor.name}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </fieldset>
                                    ) : null}
                                </section>
                            ) : null}

                            {extras.includes('tone') ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="tone">Card colour</Label>
                                    <Select
                                        name="meta[tone]"
                                        value={tone}
                                        onValueChange={setTone}
                                    >
                                        <SelectTrigger
                                            id="tone"
                                            className="w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TONES.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : null}

                            {extras.includes('lines') ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="lines">
                                        Detail lines (one per line)
                                    </Label>
                                    <textarea
                                        id="lines"
                                        rows={3}
                                        value={lines}
                                        onChange={(e) =>
                                            setLines(e.target.value)
                                        }
                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    />
                                    {lines
                                        .split('\n')
                                        .filter((line) => line.trim() !== '')
                                        .map((line, index) => (
                                            <input
                                                key={index}
                                                type="hidden"
                                                name={`meta[lines][${index}]`}
                                                value={line}
                                            />
                                        ))}
                                </div>
                            ) : null}

                            {extras.includes('badge') ? (
                                <TextExtra
                                    name="meta[badge]"
                                    label="Badge"
                                    defaultValue={item?.meta?.badge ?? ''}
                                />
                            ) : null}

                            {extras.includes('href') ? (
                                <TextExtra
                                    name="meta[href]"
                                    label="Link (tel:, mailto: or URL)"
                                    defaultValue={item?.meta?.href ?? ''}
                                />
                            ) : null}

                            {extras.includes('cta') ? (
                                <TextExtra
                                    name="meta[cta]"
                                    label="Button label (featured card only)"
                                    defaultValue={item?.meta?.cta ?? ''}
                                />
                            ) : null}

                            {extras.includes('image') ? (
                                <ImagePicker
                                    name="image_path"
                                    label={
                                        collection === 'services'
                                            ? 'Featured Service Photo'
                                            : 'Card Photo / Illustration'
                                    }
                                    defaultValue={item?.image_path ?? ''}
                                    placeholder="/images/home/consulting-room.svg"
                                    helpText="Upload a photo from your computer, choose a clinic preset, or enter an image URL."
                                />
                            ) : null}

                            <div className="space-y-3 rounded-lg border p-4">
                                <CheckboxRow
                                    name="is_published"
                                    label="Visible on the public site"
                                    defaultChecked={item?.is_published ?? true}
                                />

                                {extras.includes('featured') ? (
                                    <CheckboxRow
                                        name="meta[featured]"
                                        label="Show as the large photo card"
                                        defaultChecked={
                                            item?.meta?.featured ?? false
                                        }
                                    />
                                ) : null}

                                {extras.includes('show_on_home') ? (
                                    <CheckboxRow
                                        name="meta[show_on_home]"
                                        label="Also show on the home page"
                                        defaultChecked={
                                            item?.meta?.show_on_home ?? false
                                        }
                                    />
                                ) : null}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
                                <div className="flex items-center gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {editing ? 'Save changes' : 'Create item'}
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={basePath}>Cancel</Link>
                                    </Button>
                                </div>

                                {editing ? (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => setPendingDelete(true)}
                                    >
                                        <Trash2 className="size-4" />
                                        Delete {collection === 'services' ? 'service' : 'item'}
                                    </Button>
                                ) : null}
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {editing ? (
                <Dialog
                    open={pendingDelete}
                    onOpenChange={setPendingDelete}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="gap-2">
                            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="size-6" aria-hidden="true" />
                            </div>
                            <DialogTitle className="text-lg font-semibold">
                                Are you sure you want to delete this {collection === 'services' ? 'service' : 'item'}?
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm">
                                “{item?.title}” will be permanently removed from the
                                public site. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button variant="outline">
                                    No, keep it
                                </Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    router.delete(`${basePath}/${item.id}`);
                                    setPendingDelete(false);
                                }}
                            >
                                <Trash2 className="size-4" />
                                Yes, delete it
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : null}
        </>
    );
}

function TextExtra({ name, label, defaultValue, placeholder }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
            />
        </div>
    );
}

/**
 * A checkbox that always submits: the hidden 0 is overridden by the 1 when
 * checked, so unticking actually persists.
 */
function CheckboxRow({ name, label, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center gap-3">
            <input type="hidden" name={name} value={checked ? 1 : 0} />
            <Checkbox
                id={name}
                checked={checked}
                onCheckedChange={(value) => setChecked(value === true)}
            />
            <Label htmlFor={name} className="font-normal">
                {label}
            </Label>
        </div>
    );
}
ContentForm.layout = {
    breadcrumbs: [
        {
            title: 'Content admin',
            href: adminHome(),
        },
    ],
};
