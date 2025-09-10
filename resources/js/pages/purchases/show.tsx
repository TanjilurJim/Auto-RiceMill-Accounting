import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/PageHeader';
import {
    BuildingStorefrontIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon, // Added for title
    HandThumbDownIcon, // Added for reject button
    HandThumbUpIcon, // Added for approve button
    PaperAirplaneIcon,
    TruckIcon,
    UserCircleIcon,
    XCircleIcon,
    XMarkIcon, // Added for modal close
} from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// --- INTERFACES (No changes) ---
interface Approval {
    id: number;
    user: { name: string };
    action: 'submitted' | 'approved' | 'rejected';
    note?: string;
    created_at: string;
}

interface PurchaseItem {
    id: number;
    item: { item_name: string; unit: { name: string } };
    qty: number;
    price: number;
    subtotal: number;
}

interface Purchase {
    id: number;
    voucher_no: string;
    date: string;
    status: 'pending_sub' | 'pending_resp' | 'approved' | 'rejected';
    grand_total: number;
    subtotal: number;
    account_ledger: { account_ledger_name: string };
    salesman?: { name: string };
    godown?: { name: string };
    purchase_items: PurchaseItem[];
    approvals: Approval[];
    me: number;
    sub_responsible_id: number;
    responsible_id: number;
    created_at: string;
    payments?: PaymentRow[];
}

interface PaymentRow {
    id: number;
    date: string;
    voucher_no: string;
    amount: number;
    description?: string;
    payment_mode?: { mode_name: string };
    account_ledger?: { account_ledger_name: string };
}

interface PaidSummary {
    grand_total: number;
    initial_paid: number;
    extra_paid: number;
    paid_total: number;
    remaining_due: number;
}

// --- HELPER FUNCTIONS (No changes) ---
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtDateTime = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

const fmtMoney = (n: number) => `${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(n)} Tk`;

// --- UI COMPONENTS (Polished) ---

const StatusBadge = ({ status }: { status: Purchase['status'] }) => {
    const styles: Record<Purchase['status'], string> = {
        pending_sub: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        pending_resp: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    const label: Record<Purchase['status'], string> = {
        pending_sub: 'Pending Sub-Approval',
        pending_resp: 'Pending Final Approval',
        approved: 'Approved',
        rejected: 'Rejected',
    };
    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{label[status]}</span>;
};

// --- MAIN COMPONENT (Refactored for Responsiveness & Polish) ---

export default function PurchaseShow({ purchase, paid_summary }: { purchase: Purchase; paid_summary: PaidSummary }) {
    const [note, setNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const mayAct =
        (purchase.status === 'pending_sub' && purchase.sub_responsible_id === purchase.me) ||
        (purchase.status === 'pending_resp' && purchase.responsible_id === purchase.me);

    const approveRoute = purchase.status === 'pending_sub' ? 'approve-sub' : 'approve-final';

    const approve = () => router.post(`/purchases/${purchase.id}/${approveRoute}`);
    const reject = () => router.post(`/purchases/${purchase.id}/reject`, { note }, { onSuccess: () => setShowRejectModal(false) });

    return (
        <AppLayout>
            <Head title={`${purchase.voucher_no}`} />
            <div className="h-full w-screen bg-background p-6 lg:w-full">
                <div className="h-full rounded-lg bg-background p-6">
                    <PageHeader title="" addLinkHref="/purchases" addLinkText="Back" />

                    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-200">
                                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                                <span>Voucher #{purchase.voucher_no}</span>
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Created on {fmtDate(purchase.created_at)}</p>
                        </div>
                        <StatusBadge status={purchase.status} />
                    </header>

                    {/* --- Main Grid: Now responsive on medium screens --- */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="space-y-8 md:col-span-2">
                            <Card title="Details">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                    <DetailItem icon={UserCircleIcon} label="Supplier" value={purchase.account_ledger.account_ledger_name} />
                                    <DetailItem icon={ClockIcon} label="Voucher Date" value={fmtDate(purchase.date)} />
                                    <DetailItem icon={BuildingStorefrontIcon} label="Purchaser" value={purchase.salesman?.name ?? '—'} />
                                    <DetailItem icon={TruckIcon} label="Godown" value={purchase.godown?.name ?? '—'} />
                                </div>
                            </Card>

                            <Card noPadding>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
                                            <tr>
                                                <th className="px-6 py-3">Item</th>
                                                <th className="px-6 py-3 text-right">Qty</th>
                                                <th className="px-6 py-3 text-right">Price</th>
                                                <th className="px-6 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                            {purchase.purchase_items.map((it) => (
                                                <tr key={it.id}>
                                                    <td className="px-6 py-4 font-medium">{it.item.item_name}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        {it.qty} {it.item.unit.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">{fmtMoney(it.price)}</td>
                                                    <td className="px-6 py-4 text-right font-semibold">{fmtMoney(it.subtotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {/* --- Footer for Totals (Semantic HTML) --- */}
                                        <tfoot className="border-t-2 border-gray-300 bg-gray-50 font-bold dark:border-neutral-700 dark:bg-neutral-800/50">
                                            <tr>
                                                <td colSpan={3} className="px-6 py-3 text-right">
                                                    Grand Total
                                                </td>
                                                <td className="px-6 py-3 text-right">{fmtMoney(purchase.grand_total)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </Card>

                            <Card title="Payments Against This Purchase">
                                <div className="overflow-x-auto rounded border dark:border-neutral-700">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-neutral-800">
                                            <tr>
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">Voucher No</th>
                                                <th className="px-4 py-2">Mode</th>
                                                <th className="px-4 py-2">Ledger</th>
                                                <th className="px-4 py-2 text-right">Amount</th>
                                                <th className="px-4 py-2">Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchase.payments?.length ? (
                                                purchase.payments.map((p) => (
                                                    <tr
                                                        key={p.id}
                                                        className="border-t hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                                                    >
                                                        <td className="px-4 py-2">{fmtDate(p.date)}</td>
                                                        <td className="px-4 py-2">{p.voucher_no}</td>
                                                        <td className="px-4 py-2">{p.payment_mode?.mode_name ?? '—'}</td>
                                                        <td className="px-4 py-2">{p.account_ledger?.account_ledger_name ?? '—'}</td>
                                                        <td className="px-4 py-2 text-right">{fmtMoney(p.amount)}</td>
                                                        <td className="px-4 py-2">{p.description ?? '—'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="py-4 text-center text-gray-500" colSpan={6}>
                                                        No payments have been recorded yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            {mayAct && (
                                <Card title="Your Action Required">
                                    <div className="space-y-3">
                                        <button onClick={approve} className="btn-green flex w-full items-center justify-center gap-2">
                                            <HandThumbUpIcon className="h-5 w-5" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="btn-red flex w-full items-center justify-center gap-2"
                                        >
                                            <HandThumbDownIcon className="h-5 w-5" />
                                            Reject
                                        </button>
                                    </div>
                                </Card>
                            )}

                            <Card title="Approval Log">
                                <div className="space-y-6 border-l-2 border-gray-200 pl-8 dark:border-neutral-700">
                                    {purchase.approvals.length ? (
                                        purchase.approvals.map((a) => <TimelineItem key={a.id} approval={a} />)
                                    ) : (
                                        <p className="text-sm text-gray-500">No actions recorded yet.</p>
                                    )}
                                </div>
                            </Card>

                            <Card title="Payment Summary">
                                {/* --- Summary Grid: Now responsive on small screens --- */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    <SummaryBox label="Grand Total" value={fmtMoney(paid_summary.grand_total)} />
                                    <SummaryBox label="Paid Initially" value={fmtMoney(paid_summary.initial_paid)} />
                                    <SummaryBox label="Additional Payments" value={fmtMoney(paid_summary.extra_paid)} />
                                    <SummaryBox label="Paid Total" value={fmtMoney(paid_summary.paid_total)} />
                                    <SummaryBox label="Remaining Due" value={fmtMoney(paid_summary.remaining_due)} danger />
                                </div>

                                <div className="mt-6 flex justify-end">
                                    {paid_summary.remaining_due > 0 && (
                                        <a
                                            href={route('purchase.payments.create', purchase.id)}
                                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                        >
                                            Settle Due
                                        </a>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Polished Modal --- */}
            <Modal title="Reject Purchase" show={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Provide a brief reason for the rejection. This will be recorded in the approval log.
                </p>
                <textarea
                    className="input mb-4 w-full"
                    rows={4}
                    placeholder="e.g., Wrong supplier or quantity mismatch…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button className="btn-gray" onClick={() => setShowRejectModal(false)}>
                        Cancel
                    </button>
                    <button className="btn-red" onClick={reject}>
                        Confirm Rejection
                    </button>
                </div>
            </Modal>
        </AppLayout>
    );
}

// --- SUPPORTING COMPONENTS (Polished) ---

function Card({ children, title, noPadding }: { children: React.ReactNode; title?: string; noPadding?: boolean }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            {title && <h2 className="border-b border-gray-200 px-6 py-4 text-lg font-semibold dark:border-neutral-700">{title}</h2>}
            <div className={noPadding ? '' : 'p-6'}>{children}</div>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
            </div>
        </div>
    );
}

function TimelineItem({ approval }: { approval: Approval }) {
    const styles = {
        submitted: {
            icon: <PaperAirplaneIcon className="h-5 w-5 text-sky-600" />,
            bg: 'bg-sky-100 dark:bg-sky-900/50',
        },
        approved: {
            icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
            bg: 'bg-green-100 dark:bg-green-900/50',
        },
        rejected: {
            icon: <XCircleIcon className="h-5 w-5 text-red-600" />,
            bg: 'bg-red-100 dark:bg-red-900/50',
        },
    };
    const { icon, bg } = styles[approval.action];

    return (
        <div className="relative">
            <div className={`absolute top-0 -left-[2.1rem] flex h-8 w-8 items-center justify-center rounded-full ${bg}`}>{icon}</div>
            <p className="font-semibold">
                {approval.user.name} <span className="font-normal text-gray-600 dark:text-gray-400">{approval.action} this purchase.</span>
            </p>
            <p className="text-xs text-gray-500">{fmtDateTime(approval.created_at)}</p>
            {approval.note && <p className="mt-2 rounded-md bg-gray-100 p-3 text-sm italic dark:bg-neutral-800">“{approval.note}”</p>}
        </div>
    );
}

function Modal({ children, show, onClose, title }: { children: React.ReactNode; show: boolean; onClose: () => void; title: string }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-neutral-900">
                <header className="flex items-center justify-between border-b p-4 dark:border-neutral-700">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </header>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function SummaryBox({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
    const styles = danger
        ? 'border-l-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
        : 'border-l-gray-400 bg-gray-50 text-gray-800 dark:bg-neutral-800/50 dark:text-gray-200';

    return (
        <div className={`rounded border-l-4 p-3 ${styles}`}>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    );
}
