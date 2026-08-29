import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import PageContentController from '@/actions/App/Http/Controllers/Admin/PageContentController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImagePicker from '@/shared/components/admin/image-picker';
import RichTextEditor from '@/shared/components/admin/rich-text-editor';
import Heading from '@/shared/components/common/heading';
import InputError from '@/shared/components/common/input-error';
import { adminHome } from '@/shared/lib/admin-nav';

export default function PageContent({ group, groupLabel, fields }) {
    // Group fields by the middle part of their key: hero, philosophy, ...
    const sections = fields.reduce((carry, field) => {
        (carry[field.section] ??= []).push(field);

        return carry;
    }, {});

    return (
        <>
            <Head title={`${groupLabel} content`} />

            <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto">
                <Form
                    {...PageContentController.update.form(group)}
                    options={{ preserveScroll: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <Heading
                                    title={groupLabel}
                                    description="Copy shown on the public site."
                                />
                                <Button type="submit" disabled={processing}>
                                    Save changes
                                </Button>
                            </div>

                            {Object.entries(sections).map(([section, items]) => (
                                <section
                                    key={section}
                                    className="space-y-6 rounded-xl border p-6 shadow-xs"
                                >
                                    <h2 className="text-sm font-semibold tracking-wide uppercase">
                                        {section}
                                    </h2>

                                    {items.map((field) => (
                                        <Field
                                            key={field.key}
                                            field={field}
                                            error={errors[`values.${field.key}`]}
                                        />
                                    ))}
                                </section>
                            ))}

                            <div className="border-t pt-6">
                                <Button type="submit" disabled={processing}>
                                    Save changes
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

function Field({ field, error }) {
    const name = `values[${field.key}]`;
    const isImage =
        field.key.includes('image') ||
        field.key.includes('photo') ||
        field.key.includes('img') ||
        field.label.toLowerCase().includes('image') ||
        field.label.toLowerCase().includes('photo');

    return (
        <div className="grid gap-2">
            {field.type === 'html' ? (
                <>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <RichTextEditor name={name} defaultValue={field.value ?? ''} />
                </>
            ) : isImage ? (
                <ImagePicker
                    name={name}
                    label={field.label}
                    defaultValue={field.value ?? ''}
                    placeholder="/images/home/consulting-room.svg"
                />
            ) : (
                <>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <TextField id={field.key} name={name} value={field.value} />
                </>
            )}

            <p className="text-muted-foreground font-mono text-xs">
                {field.key}
            </p>
            <InputError message={error} />
        </div>
    );
}

/** Uncontrolled would lose the value on validation errors, so track it. */
function TextField({ id, name, value }) {
    const [current, setCurrent] = useState(value ?? '');

    return (
        <Input
            id={id}
            name={name}
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
        />
    );
}
PageContent.layout = {
    breadcrumbs: [
        {
            title: 'Content admin',
            href: adminHome(),
        },
    ],
};
