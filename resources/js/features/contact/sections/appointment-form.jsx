import { Form } from '@inertiajs/react';
import ContactController from '@/actions/App/Http/Controllers/ContactController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/shared/components/common/input-error';

export default function AppointmentForm({ form, serviceOptions }) {
    return (
        <div className="relative isolate overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-black/5 sm:p-10">
            {/* Soft brand wash in the top-right corner, as in the design. */}
            <div
                aria-hidden="true"
                className="bg-brand-tint absolute -top-24 -right-24 -z-10 size-64 rounded-full blur-3xl"
            />

            <h2 className="text-brand text-2xl font-semibold">{form.title}</h2>

            <Form
                {...ContactController.store.form()}
                options={{ preserveScroll: true }}
                resetOnSuccess
                className="mt-8 space-y-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    autoComplete="given-name"
                                    placeholder="Jane"
                                    className="bg-mist h-11"
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    autoComplete="family-name"
                                    placeholder="Doe"
                                    className="bg-mist h-11"
                                />
                                <InputError message={errors.last_name} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="jane@example.com"
                                className="bg-mist h-11"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="(555) 123-4567"
                                className="bg-mist h-11"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="service">Service of Interest</Label>
                            <Select name="service">
                                <SelectTrigger
                                    id="service"
                                    className="bg-mist h-11 w-full"
                                >
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.service} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="How can we help you today?"
                                className="bg-mist"
                            />
                            <InputError message={errors.message} />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-brand hover:bg-brand-dark h-12 w-full rounded-lg text-sm font-medium"
                        >
                            {form.submit}
                        </Button>
                    </>
                )}
            </Form>
        </div>
    );
}
