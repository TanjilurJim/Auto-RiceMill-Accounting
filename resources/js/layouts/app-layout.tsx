import { useFontClass } from '@/components/useFontClass';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
// import { type ReactNode } from 'react';
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const fontClass = useFontClass();
    const { props: inertiaProps } = usePage();

    useEffect(() => {
        // property name matches HandleInertiaRequests::share()
        const shouldReload = Boolean((inertiaProps as any).firstAppReload);

        if (shouldReload && !sessionStorage.getItem('appReloadedOnce')) {
            // prevent loops (per tab)
            sessionStorage.setItem('appReloadedOnce', '1');

            // slight delay ensures Inertia has time to finish rendering the current response
            setTimeout(() => {
                window.location.reload();
            }, 50);
        }
    }, [inertiaProps]);

    return (
        <div className={fontClass}>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </div>
    );
};
