// resources/js/Pages/sales/inbox/SalesInboxTable.tsx

import Pagination from '@/components/Pagination';
import { StatusBadge } from '@/components/StatusBadge';
import { useTranslation } from '@/components/useTranslation';
import { CheckIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

// HELPER: Format date to dd/mm/yyyy
// You can place this in your '@/utils/format' file
const fmtDate = (dateString: string | null) => {
    if (!dateString) return '—';
    // Use en-GB locale for dd/mm/yyyy format
    return new Date(dateString).toLocaleDateString('en-GB');
};

const fmtMoney = (amount: string | number) => {
    const number = Number(amount);
    return new Intl.NumberFormat('en-IN').format(number);
};

// --- INTERFACES ---
interface SaleRow {
    id: number;
    date: string;
    voucher_no: string;
    grand_total: string | number;
    customer?: string;
    godown?: string;
    salesman?: string;
    sub_status: 'approved' | 'pending' | 'rejected';
    sub_by?: string;
    resp_status: 'approved' | 'pending' | 'rejected' | '—';
    resp_by?: string;
    received?: number | string;
    due?: number | string;
}

interface SalePaginator {
    data: SaleRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    sales: SalePaginator;
    approveRoute: (id: number) => string;
    rejectRoute: (id: number) => string;
}

interface ModalState {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
}

// --- COMPONENT ---
export default function SalesInboxTable({ sales, approveRoute, rejectRoute }: Props) {
    const t = useTranslation();
    const [selected, setSelected] = useState<number[]>([]);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        message: '',
        onConfirm: () => {},
    });

    const toggle = (id: number) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    // --- Custom Confirmation Modal Logic ---
    const confirmThen = (ids: number[], routeFn: (id: number) => string, msg: string) => {
        if (!ids.length) return;
        setModalState({
            isOpen: true,
            message: msg,
            onConfirm: () => {
                ids.forEach((id) =>
                    router.post(
                        routeFn(id),
                        {},
                        {
                            onSuccess: () => setSelected((prev) => prev.filter((sid) => !ids.includes(sid))),
                        },
                    ),
                );
                setModalState({ isOpen: false, message: '', onConfirm: () => {} });
            },
        });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, message: '', onConfirm: () => {} });
    };

    const allChecked = sales.data.length > 0 && selected.length === sales.data.length;
    const someChecked = selected.length > 0 && !allChecked;

    return (
        <>
            <div className="bg-background overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs tracking-wider text-gray-600 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
                            <tr>
                                <th className="w-10 p-3">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:ring-sky-600"
                                        checked={allChecked}
                                        ref={(el) => el && (el.indeterminate = someChecked)}
                                        onChange={() => setSelected(allChecked ? [] : sales.data.map((r) => r.id))}
                                    />
                                </th>
                                <th className="p-3">{t('dateHeader')}</th>
                                <th className="p-3">{t('voucherHeader')}</th>
                                <th className="p-3">{t('customerHeader')}</th>
                                <th className="p-3">{t('godownHeader')}</th>
                                <th className="p-3">{t('salesmanHeader')}</th>
                                {/* <th className="p-3">{t('subApprovalHeader')}</th> */}
                                <th className="p-3">{t('respApprovalHeader')}</th>
                                <th className="p-3 text-right">Received</th> {/* 👈 NEW */}
                                <th className="p-3 text-right">Due</th>
                                <th className="p-3 text-right">{t('totalHeader')}</th>
                                <th className="p-3 text-center">{t('actionsHeader')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                            {sales.data.length > 0 ? (
                                sales.data.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:ring-sky-600"
                                                checked={selected.includes(row.id)}
                                                onChange={() => toggle(row.id)}
                                            />
                                        </td>
                                        <td className="p-3 whitespace-nowrap">{fmtDate(row.date)}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            <Link href={`/sales/${row.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-500">
                                                {row.voucher_no}
                                            </Link>
                                        </td>
                                        <td className="p-3">{row.customer ?? '—'}</td>
                                        <td className="p-3">{row.godown ?? '—'}</td>
                                        <td className="p-3">{row.salesman ?? '—'}</td>
                                        {/* <td className="p-3">
  <StatusBadge
    status={row.sub_by ? 'approved' : row.sub_status}
    by={row.sub_by}
  />
</td> */}
                                        <td className="p-3">
                                            <StatusBadge status={row.resp_status} by={row.resp_by} />
                                        </td>
                                        <td className="p-3 text-right whitespace-nowrap">{fmtMoney(row.received ?? 0)} TK</td>
                                        <td className="p-3 text-right whitespace-nowrap">
                                            {fmtMoney(row.due ?? Math.max(0, Number(row.grand_total) - Number(row.received ?? 0)))} TK
                                        </td>

                                        <td className="p-3 text-right font-medium whitespace-nowrap">{fmtMoney(row.grand_total)} TK</td>

                                        <td className="p-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <ActionButton
                                                    as={Link}
                                                    href={`/sales/${row.id}`}
                                                    tooltip={t('viewTooltip')}
                                                    className="hover:text-sky-600"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={() => confirmThen([row.id], approveRoute, t('approveSaleMessage'))}
                                                    tooltip={t('approveTooltip')}
                                                    className="hover:text-green-600"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={() => confirmThen([row.id], rejectRoute, t('rejectSaleMessage'))}
                                                    tooltip={t('rejectTooltip')}
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
                                        {t('noSalesAwaitingMessage')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Bulk Actions Bar --- */}
            {selected.length > 0 && (
                <div className="bg-background mt-4 rounded-lg border border-gray-200 px-4 py-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium">
                            <span className="font-bold">{selected.length}</span> {t('itemsSelected')}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                className="btn-green-sm"
                                onClick={() =>
                                    confirmThen(
                                        selected,
                                        approveRoute,
                                        `${t('approveAllSelectedMessage')} ${selected.length} ${t('selectedSalesText')}`,
                                    )
                                }
                            >
                                {t('approveSelected')}
                            </button>
                            <button
                                className="btn-red-sm"
                                onClick={() =>
                                    confirmThen(
                                        selected,
                                        rejectRoute,
                                        `${t('rejectAllSelectedMessage')} ${selected.length} ${t('selectedSalesText')}`,
                                    )
                                }
                            >
                                {t('rejectSelected')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Pagination links={sales.links} currentPage={sales.current_page} lastPage={sales.last_page} total={sales.total} />

            {/* --- Custom Confirmation Modal --- */}
            {modalState.isOpen && (
                <div
                    className="/* translucent dark overlay */ /* adds effect */ fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
                    aria-modal="true"
                >
                    <div className="bg-background w-full max-w-md transform rounded-lg p-6 shadow-xl transition-all dark:bg-neutral-800">
                        <h3 className="text-lg leading-6 font-medium text-foreground">{t('confirmActionTitle')}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-foreground ">{modalState.message}</p>
                        </div>
                        <div className="mt-5 flex justify-end gap-3">
                            <button type="button" className="btn-gray" onClick={closeModal}>
                                {t('cancelActionButton')}
                            </button>
                            <button type="button" className="btn-red" onClick={modalState.onConfirm}>
                                {t('confirmButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// --- Action Button with Tooltip Sub-component ---
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

/* Recommended CSS to add to your globals.css (or equivalent) for button styles.
  You may need to install @heroicons/react: npm install @heroicons/react

  .btn-sky { @apply rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600; }
  .btn-green-sm { @apply rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700; }
  .btn-red-sm { @apply rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700; }
  .btn-gray { @apply rounded-md bg-background px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-neutral-700 dark:text-white dark:ring-neutral-600 dark:hover:bg-neutral-600; }
*/
