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
}

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

const StatusBadge = ({ status }: { status: Purchase['status'] }) => {
    const colour: Record<Purchase['status'], string> = {
        pending_sub: 'bg-yellow-50  text-yellow-700  dark:bg-yellow-900/30  dark:text-yellow-300',
        pending_resp: 'bg-orange-50  text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        approved: 'bg-green-50   text-green-700  dark:bg-green-900/30  dark:text-green-300',
        rejected: 'bg-red-50     text-red-700    dark:bg-red-900/30    dark:text-red-300',
    };
    const label: Record<Purchase['status'], string> = {
        pending_sub: 'Pending Sub-Approval',
        pending_resp: 'Pending Final Approval',
        approved: 'Approved',
        rejected: 'Rejected',
    };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colour[status]}`}>{label[status]}</span>;
};

export default function PurchaseShow({ purchase }: { purchase: Purchase }) {
    const [note, setNote] = useState('');
    const [showModal, setShowModal] = useState(false);

    const mayAct =
        (purchase.status === 'pending_sub' && purchase.sub_responsible_id === purchase.me) ||
        (purchase.status === 'pending_resp' && purchase.responsible_id === purchase.me);

    const approveRoute = purchase.status === 'pending_sub' ? 'approve-sub' : 'approve-final';

    const approve = () => router.post(`/purchases/${purchase.id}/${approveRoute}`);
    const reject = () => router.post(`/purchases/${purchase.id}/reject`, { note }, { onSuccess: () => setShowModal(false) });

    return (
        <AppLayout title={`Purchase ${purchase.voucher_no}`}>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Voucher #{purchase.voucher_no}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created {fmtDate(purchase.created_at)}</p>
                </div>
                <StatusBadge status={purchase.status} />
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <Card title="Details">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <DetailItem icon={UserCircleIcon} label="Supplier" value={purchase.account_ledger.account_ledger_name} />
                            <DetailItem icon={ClockIcon} label="Voucher Date" value={fmtDate(purchase.date)} />
                            <DetailItem icon={BuildingStorefrontIcon} label="Purchaser" value={purchase.salesman?.name ?? '—'} />
                            <DetailItem icon={TruckIcon} label="Godown" value={purchase.godown?.name ?? '—'} />
                        </div>
                    </Card>

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
                                {purchase.purchase_items.map((it) => (
                                    <tr key={it.id}>
                                        <td className="p-4 font-medium">{it.item.item_name}</td>
                                        <td className="p-4 text-right">
                                            {it.qty} {it.item.unit.name}
                                        </td>
                                        <td className="p-4 text-right">{fmtMoney(it.price)}</td>
                                        <td className="p-4 text-right font-semibold">{fmtMoney(it.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end bg-gray-50 p-4 dark:bg-neutral-800/50">
                            <div className="w-full max-w-xs space-y-2 text-sm">
                                <Row label="Grand Total" value={fmtMoney(purchase.grand_total)} bold />
                            </div>
                        </div>
                    </Card>
                </div>

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
                            {purchase.approvals.length ? (
                                purchase.approvals.map((a) => <TimelineItem key={a.id} approval={a} />)
                            ) : (
                                <p className="text-sm text-gray-500">No actions recorded yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h3 className="mb-2 text-lg font-bold">Reject Purchase</h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Provide a brief reason; it will appear in the log.</p>
                    <textarea
                        className="input mb-4 w-full"
                        rows={4}
                        placeholder="e.g., Wrong supplier or quantity mismatch…"
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

function Card({ children, title, noPadding }: { children: React.ReactNode; title?: string; noPadding?: boolean }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
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
                {approval.user.name} <span className="font-normal text-gray-600 dark:text-gray-400">{approval.action} this purchase.</span>
            </p>
            <p className="text-xs text-gray-500">{fmtDateTime(approval.created_at)}</p>
            {approval.note && <p className="mt-1 rounded-md bg-gray-100 p-2 text-sm italic dark:bg-neutral-800">“{approval.note}”</p>}
        </div>
    );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800">{children}</div>
        </div>
    );
}
