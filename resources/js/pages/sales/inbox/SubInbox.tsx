import AppLayout from '@/layouts/app-layout';
import SalesInboxTable from './SalesInboxTable';

export default function SubInbox({ sales }) {
    return (
        <AppLayout title="Pending Sub-Approval">
            <h1 className="mb-4 text-xl font-semibold">Sales needing your Sub-Approval</h1>

            <SalesInboxTable sales={sales} approveRoute={(id) => `/sales/${id}/approve-sub`} rejectRoute={(id) => `/sales/${id}/reject`} />
        </AppLayout>
    );
}
