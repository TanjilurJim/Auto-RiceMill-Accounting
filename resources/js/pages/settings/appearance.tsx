import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { useTranslation } from '@/components/useTranslation';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    const t = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('set-appearance-settings'),
            href: '/settings/appearance',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('set-appearance-settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={t('set-appearance-settings')} description={t('set-appearance-description')} />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
