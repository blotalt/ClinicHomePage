import { Form, Head, Link } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';
import InputError from '@/shared/components/common/input-error';
import PasswordInput from '@/shared/components/common/password-input';
import TextLink from '@/shared/components/common/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { contact } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/shared/components/auth/passkey-verify';

export default function Login({ status, canResetPassword }) {
    return (
        <>
            <Head title="Welcome Back - Log in" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email input with icon */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail
                                        className="text-muted-foreground/60 absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2"
                                        aria-hidden="true"
                                    />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password input with icon */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-[#104838] hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock
                                        className="text-muted-foreground/60 absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 z-10"
                                        aria-hidden="true"
                                    />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center space-x-2.5 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="bg-[#104838] hover:bg-[#0c382b] text-white w-full rounded-full py-2.5 text-sm font-medium shadow-xs transition-colors cursor-pointer mt-2"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Sign In
                            </Button>
                        </div>

                        {/* Registration / Contact note */}
                        <div className="text-muted-foreground text-center text-xs pt-2">
                            Don't have an account?{' '}
                            <Link href={contact()} className="text-[#104838] font-semibold hover:underline">
                                Contact clinic to register
                            </Link>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-700 bg-green-50 rounded-lg p-2.5">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
};
