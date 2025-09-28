import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import SalesInboxTable from './SalesInboxTable';

export default function RespInbox({ sales }) {
    const t = useTranslation();

    return (
        <AppLayout>
            <Head title={t('salesFinalApprovalTitle')} />
            <div className="p-4 md:p-12">
                <h1 className="mb-4 text-xl font-semibold">{t('salesFinalApprovalTitle')}</h1>

                <SalesInboxTable sales={sales} approveRoute={(id) => `/sales/${id}/approve-final`} rejectRoute={(id) => `/sales/${id}/reject`} />
            </div>
        </AppLayout>
    );
}
