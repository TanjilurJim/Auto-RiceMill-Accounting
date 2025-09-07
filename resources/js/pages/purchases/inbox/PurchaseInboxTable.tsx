import Pagination from '@/components/Pagination';
import { StatusBadge } from '@/components/StatusBadge';
import { CheckIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

/* ───────── helpers ───────── */
const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const fmtMoney = (n: string | number) => new Intl.NumberFormat('en-IN').format(Number(n));

/* ───────── types ───────── */
interface PurchaseRow {
    id: number;
    date: string;
    voucher_no: string;
    grand_total: string | number;
    supplier?: string;
    godown?: string;
    salesman?: string;
    sub_status: 'approved' | 'pending' | 'rejected';
    sub_by?: string;
    resp_status: 'approved' | 'pending' | 'rejected' | '—';
    resp_by?: string;
}

interface PurchasePaginator {
    data: PurchaseRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    purchases: PurchasePaginator;
    approveRoute: (id: number) => string;
    rejectRoute: (id: number) => string;
}

interface ModalState {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
}

/* ───────── component ───────── */
export default function PurchaseInboxTable({ purchases, approveRoute, rejectRoute }: Props) {
    const [selected, setSelected] = useState<number[]>([]);
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        message: '',
        onConfirm: () => {},
    });

    const toggle = (id: number) => setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

    const confirmThen = (ids: number[], routeFn: (id: number) => string, msg: string) => {
        if (!ids.length) return;
        setModal({
            isOpen: true,
            message: msg,
            onConfirm: () => {
                ids.forEach((id) => router.post(routeFn(id), {}, { onSuccess: () => setSelected((p) => p.filter((x) => !ids.includes(x))) }));
                setModal({ isOpen: false, message: '', onConfirm: () => {} });
            },
        });
    };

    const closeModal = () => setModal({ isOpen: false, message: '', onConfirm: () => {} });

    const allChecked = purchases.data.length > 0 && selected.length === purchases.data.length;
    const someChecked = selected.length > 0 && !allChecked;

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-background shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-background text-left text-xs tracking-wider text-gray-600 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
                            <tr>
                                <th className="w-10 p-3">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:ring-sky-600"
                                        checked={allChecked}
                                        ref={(el) => el && (el.indeterminate = someChecked)}
                                        onChange={() => setSelected(allChecked ? [] : purchases.data.map((r) => r.id))}
                                    />
                                </th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Voucher</th>
                                <th className="p-3">Supplier</th>
                                <th className="p-3">Godown</th>
                                <th className="p-3">Salesman</th>
                                <th className="p-3">Sub-Approval</th>
                                <th className="p-3">Resp-Approval</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                            {purchases.data.length ? (
                                purchases.data.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                        {/* checkbox */}
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:ring-sky-600"
                                                checked={selected.includes(row.id)}
                                                onChange={() => toggle(row.id)}
                                            />
                                        </td>

                                        {/* data cells */}
                                        <td className="p-3 whitespace-nowrap">{fmtDate(row.date)}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            <Link
                                                href={`/purchases/${row.id}`}
                                                className="font-medium text-sky-600 hover:underline dark:text-sky-500"
                                            >
                                                {row.voucher_no}
                                            </Link>
                                        </td>
                                        <td className="p-3">{row.supplier ?? '—'}</td>
                                        <td className="p-3">{row.godown ?? '—'}</td>
                                        <td className="p-3">{row.salesman ?? '—'}</td>
                                        <td className="p-3">
                                            <StatusBadge status={row.sub_status} by={row.sub_by} />
                                        </td>
                                        <td className="p-3">
                                            <StatusBadge status={row.resp_status} by={row.resp_by} />
                                        </td>
                                        <td className="p-3 text-right font-medium whitespace-nowrap">{fmtMoney(row.grand_total)} TK</td>

                                        {/* action buttons */}
                                        <td className="p-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <ActionButton as={Link} href={`/purchases/${row.id}`} tooltip="View" className="hover:text-sky-600">
                                                    <EyeIcon className="h-5 w-5" />
                                                </ActionButton>

                                                <ActionButton
                                                    onClick={() => confirmThen([row.id], approveRoute, 'Approve this purchase?')}
                                                    tooltip="Approve"
                                                    className="hover:text-green-600"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </ActionButton>

                                                <ActionButton
                                                    onClick={() => confirmThen([row.id], rejectRoute, 'Reject this purchase?')}
                                                    tooltip="Reject"
                                                    className="hover:text-red-600"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </ActionButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="p-6 text-center text-gray-500 dark:text-gray-400">
                                        No purchases awaiting approval 🎉
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* bulk bar */}
            {selected.length > 0 && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium">
                            <span className="font-bold">{selected.length}</span> item(s) selected
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                className="btn-green-sm"
                                onClick={() => confirmThen(selected, approveRoute, `Approve all ${selected.length} selected purchases?`)}
                            >
                                Approve Selected
                            </button>
                            <button
                                className="btn-red-sm"
                                onClick={() => confirmThen(selected, rejectRoute, `Reject all ${selected.length} selected purchases?`)}
                            >
                                Reject Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Pagination links={purchases.links} currentPage={purchases.current_page} lastPage={purchases.last_page} total={purchases.total} />

            {/* modal */}
            {modal.isOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-neutral-800">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Confirm Action</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{modal.message}</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button type="button" className="btn-gray" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn-sky" onClick={modal.onConfirm}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ───────── sub-component ───────── */
function ActionButton({ as: Component = 'button', tooltip, className, ...props }: any) {
    return (
        <div className="group relative flex">
            <Component {...props} className={`text-gray-500 transition-colors duration-200 dark:text-gray-400 ${className}`} />
            <span className="absolute -top-8 left-1/2 w-max -translate-x-1/2 scale-0 rounded bg-gray-800 p-2 text-xs text-white transition-all group-hover:scale-100 dark:bg-gray-700">
                {tooltip}
            </span>
        </div>
    );
}
