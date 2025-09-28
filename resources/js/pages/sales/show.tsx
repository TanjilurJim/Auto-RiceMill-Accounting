/*  resources/js/Pages/sales/show.tsx  */
import AppLayout from '@/layouts/app-layout';
import {
    BuildingStorefrontIcon,
    CheckCircleIcon,
    ClockIcon,
    PaperAirplaneIcon,
    TruckIcon,
    UserCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { useState } from 'react';

/* -------------------------------------------------------------------------- */
/*  Types (mirror SaleController@show)                                        */
interface Approval {
    id: number;
    user: { name: string };
    action: 'submitted' | 'approved' | 'rejected';
    note?: string;
    created_at: string;
}

interface SaleItem {
    id: number;
    item: { item_name: string; unit: { name: string } };
    qty: number;
    main_price: number;
    subtotal: number;
}

interface Sale {
    id: number;
    voucher_no: string;
    date: string;
    status: 'pending_sub' | 'pending_resp' | 'approved' | 'rejected';
    grand_total: number;
    subtotal: number;
    account_ledger: { account_ledger_name: string };
    salesman?: { name: string };
    godown?: { name: string };
    sale_items: SaleItem[];
    approvals: Approval[];
    me: number;
    sub_responsible_id: number;
    responsible_id: number;
    created_at: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

const fmtMoney = (n: number) =>
    `${new Intl.NumberFormat('en-BD', {
        minimumFractionDigits: 2,
    }).format(n)} Tk`;

/* -------------------------------------------------------------------------- */
/*  Status badge                                                              */
const StatusBadge = ({ status }: { status: Sale['status'] }) => {
    const colour: Record<Sale['status'], string> = {
        pending_sub: 'bg-yellow-50  text-yellow-700  dark:bg-yellow-900/30  dark:text-yellow-300',
        pending_resp: 'bg-orange-50  text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        approved: 'bg-green-50   text-green-700  dark:bg-green-900/30  dark:text-green-300',
        rejected: 'bg-red-50     text-red-700    dark:bg-red-900/30    dark:text-red-300',
    };
    const label: Record<Sale['status'], string> = {
        pending_sub: 'Pending Sub-Approval',
        pending_resp: 'Pending Final Approval',
        approved: 'Approved',
        rejected: 'Rejected',
    };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colour[status]}`}>{label[status]}</span>;
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
export default function SaleShow({ sale }: { sale: Sale }) {
    const [note, setNote] = useState('');
    const [showModal, setShowModal] = useState(false);

    const mayAct =
        (sale.status === 'pending_sub' && sale.sub_responsible_id === sale.me) || (sale.status === 'pending_resp' && sale.responsible_id === sale.me);

    const approveRoute = sale.status === 'pending_sub' ? 'approve-sub' : 'approve-final';

    const approve = () => router.post(`/sales/${sale.id}/${approveRoute}`);

    const reject = () => router.post(`/sales/${sale.id}/reject`, { note }, { onSuccess: () => setShowModal(false) });

    return (
        <AppLayout title={`Sale ${sale.voucher_no}`}>
            {/* ------------------------------------------------------------------ */}
            {/* Header                                                             */}
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Voucher #{sale.voucher_no}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created {fmtDate(sale.created_at)}</p>
                </div>
                <StatusBadge status={sale.status} />
            </header>

            {/* ------------------------------------------------------------------ */}
            {/* Grid                                                               */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* ---------------- Left column ----------------------------------- */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Details */}
                    <Card title="Details">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <DetailItem icon={UserCircleIcon} label="Customer" value={sale.account_ledger.account_ledger_name} />
                            <DetailItem icon={ClockIcon} label="Voucher Date" value={fmtDate(sale.date)} />
                            <DetailItem icon={BuildingStorefrontIcon} label="Salesman" value={sale.salesman?.name ?? '—'} />
                            <DetailItem icon={TruckIcon} label="Godown" value={sale.godown?.name ?? '—'} />
                        </div>
                    </Card>

                    {/* Items */}
                    <Card noPadding>
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs tracking-wider text-gray-600 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
                                <tr>
                                    <th className="p-4">Item</th>
                                    <th className="p-4 text-right">Qty</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                {sale.sale_items.map((it) => (
                                    <tr key={it.id}>
                                        <td className="p-4 font-medium">{it.item.item_name}</td>
                                        <td className="p-4 text-right">
                                            {it.qty} {it.item.unit.name}
                                        </td>
                                        <td className="p-4 text-right">{fmtMoney(it.main_price)}</td>
                                        <td className="p-4 text-right font-semibold">{fmtMoney(it.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end bg-gray-50 p-4 dark:bg-neutral-800/50">
                            <div className="w-full max-w-xs space-y-2 text-sm">
                                {/* <Row label="Subtotal" value={fmtMoney(sale.subtotal)} /> */}
                                <Row label="Grand Total" value={fmtMoney(sale.grand_total)} bold />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ---------------- Right column ---------------------------------- */}
                <div className="space-y-8">
                    {mayAct && (
                        <Card title="Your Action Required">
                            <div className="space-y-3">
                                <button onClick={approve} className="btn-green w-full justify-center">
                                    Approve
                                </button>
                                <button onClick={() => setShowModal(true)} className="btn-red w-full justify-center">
                                    Reject
                                </button>
                            </div>
                        </Card>
                    )}

                    <Card title="Approval Log">
                        <div className="space-y-6 border-l-2 border-gray-200 pl-6 dark:border-neutral-700">
                            {sale.approvals.length ? (
                                sale.approvals.map((a) => <TimelineItem key={a.id} approval={a} />)
                            ) : (
                                <p className="text-sm text-gray-500">No actions recorded yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* Reject modal                                                       */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h3 className="mb-2 text-lg font-bold">Reject Sale</h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Provide a brief reason; it will appear in the log.</p>
                    <textarea
                        className="input mb-4 w-full"
                        rows={4}
                        placeholder="e.g., Incorrect pricing…"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                        <button className="btn-gray" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="btn-red" onClick={reject}>
                            Confirm Rejection
                        </button>
                    </div>
                </Modal>
            )}
        </AppLayout>
    );
}

/* -------------------------------------------------------------------------- */
/*  Reusable helpers                                                          */
function Card({ children, title, noPadding }: { children: React.ReactNode; title?: string; noPadding?: boolean }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-background shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            {title && <h2 className="px-6 pt-6 text-lg font-semibold">{title}</h2>}
            <div className={noPadding ? '' : 'p-6'}>{children}</div>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
    return (
        <div className="flex items-start">
            <Icon className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
            </div>
        </div>
    );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
    return (
        <div className={`flex justify-between ${bold ? 'text-base font-bold' : ''}`}>
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span>{value}</span>
        </div>
    );
}

function TimelineItem({ approval }: { approval: Approval }) {
    const icon = {
        submitted: <PaperAirplaneIcon className="h-5 w-5 text-sky-500" />,
        approved: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
        rejected: <XCircleIcon className="h-5 w-5 text-red-500" />,
    }[approval.action];

    return (
        <div className="relative">
            <div className="absolute top-1 -left-7 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-700">{icon}</div>
            <p className="font-semibold">
                {approval.user.name} <span className="font-normal text-gray-600 dark:text-gray-400">{approval.action} this sale.</span>
            </p>
            <p className="text-xs text-gray-500">{fmtDateTime(approval.created_at)}</p>
            {approval.note && <p className="mt-1 rounded-md bg-gray-100 p-2 text-sm italic dark:bg-neutral-800">“{approval.note}”</p>}
        </div>
    );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            {/* dialog */}
            <div className="relative z-10 w-full max-w-lg rounded-lg bg-background p-6 shadow-xl dark:bg-neutral-800">{children}</div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Tailwind utilities to add to globals.css (if not already present)         */
/*
.btn-green { @apply inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600; }
.btn-red   { @apply inline-flex items-center rounded-md bg-red-600   px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600; }
.btn-gray  { @apply inline-flex items-center rounded-md bg-background     px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-neutral-700 dark:text-white dark:ring-neutral-600 dark:hover:bg-neutral-600; }
.input     { @apply block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-neutral-800 dark:text-white dark:ring-neutral-600 dark:focus:ring-sky-500; }
*/
