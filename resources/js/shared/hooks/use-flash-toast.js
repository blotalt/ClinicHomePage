import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useFlashToast() {
    useEffect(() => {
        // Check initial page flash on mount if available
        if (router.page?.props?.flash) {
            handleFlash(router.page.props.flash);
        }

        // Handle direct router flash events
        const unsubscribeFlash = router.on('flash', (event) => {
            const flashData = event.detail?.flash;
            handleFlash(flashData);
        });

        // Handle navigation and form responses
        const unsubscribeFinish = (event) => {
            const pageProps = event?.detail?.page?.props || router.page?.props;
            if (pageProps?.flash) {
                handleFlash(pageProps.flash);
            }
        };

        const unsubscribeSuccess = router.on('success', (event) => {
            const pageProps = event?.detail?.page?.props || router.page?.props;
            if (pageProps?.flash) {
                handleFlash(pageProps.flash);
            }
        });

        return () => {
            unsubscribeFlash();
            unsubscribeSuccess();
        };
    }, []);
}

function handleFlash(flash) {
    if (!flash) return;

    if (flash.toast?.message) {
        const type = flash.toast.type || 'success';
        if (typeof toast[type] === 'function') {
            toast[type](flash.toast.message);
        } else {
            toast(flash.toast.message);
        }
    } else if (flash.success) {
        toast.success(flash.success);
    } else if (flash.error) {
        toast.error(flash.error);
    }
}
