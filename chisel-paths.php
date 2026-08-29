<?php

return [
    'login' => 'resources/js/pages/auth/login.jsx',
    'register' => 'resources/js/pages/auth/register.jsx',
    'welcome' => 'resources/js/pages/welcome.jsx',
    'profile' => 'resources/js/pages/settings/profile.jsx',
    'security' => 'resources/js/pages/settings/security.jsx',
    'verify_email' => 'resources/js/pages/auth/verify-email.jsx',
    'two_factor_challenge' => 'resources/js/pages/auth/two-factor-challenge.jsx',
    'confirm_password' => 'resources/js/pages/auth/confirm-password.jsx',
    // No longer exists: shared types were removed when the frontend moved
    // to plain JavaScript. Chisel skips paths that are not present.
    'auth_types' => 'resources/js/types/auth.js',

    'two_factor_files' => [
        'resources/js/shared/components/auth/manage-two-factor.jsx',
        'resources/js/shared/components/auth/two-factor-setup-modal.jsx',
        'resources/js/shared/components/auth/two-factor-recovery-codes.jsx',
        'resources/js/components/ui/input-otp.jsx',
        'resources/js/shared/hooks/use-two-factor-auth.js',
    ],

    'two_factor_otp_package' => 'input-otp',

    'passkey_files' => [
        'resources/js/shared/components/auth/passkey-item.jsx',
        'resources/js/shared/components/auth/passkey-register.jsx',
        'resources/js/shared/components/auth/passkey-verify.jsx',
        'resources/js/shared/components/auth/manage-passkeys.jsx',
    ],
];
