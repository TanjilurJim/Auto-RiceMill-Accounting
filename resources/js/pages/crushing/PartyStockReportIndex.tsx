/* resources/js/pages/crushing/PartyStockReportIndex.tsx */
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import Select from 'react-select';
/* ---------- types ---------- */
interface Row {
    party: string;
    godown: string;
    item: string;
    unit: string;
    in_qty: number;
    out_qty: number;
    balance_qty: number;
}
interface Opt {
    value: string;
    label: string;
}

export default function PartyStockReportIndex({ parties, items, rows, totals, filters }) {
    /* ---------- select options ---------- */
    const partyOpts: Opt[] = parties.map((p) => ({ value: String(p.id), label: p.account_ledger_name }));
    const itemOpts: Opt[] = items.map((i) => ({ value: String(i.id), label: i.item_name }));

    /* ---------- local state ---------- */
    const [partyId, setPartyId] = React.useState(filters.party_id || '');
    const [itemId, setItemId] = React.useState(filters.item_id || '');
    const [dateFrom, setDateFrom] = React.useState(filters.date_from || '');
    const [dateTo, setDateTo] = React.useState(filters.date_to || dayjs().format('YYYY-MM-DD'));

    const buildParams = () => {
        const p: Record<string, string> = {};
        if (partyId) p.party_id = partyId;
        if (itemId) p.item_id = itemId;
        if (dateFrom) p.date_from = dateFrom;
        if (dateTo) p.date_to = dateTo;
        return p;
    };
    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: 'var(--input)',
            borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
            boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
            color: 'var(--foreground)',
            minHeight: '2.5rem',
            borderRadius: 'var(--radius-md)',
        }),
        singleValue: (base: any) => ({ ...base, color: 'var(--foreground)' }),
        input: (base: any) => ({ ...base, color: 'var(--foreground)' }),
        placeholder: (base: any) => ({ ...base, color: 'var(--muted-foreground)' }),

        menu: (base: any) => ({
            ...base,
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
            border: '1px solid var(--border)',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--accent)' : 'transparent',
            color: state.isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)',
        }),

        indicatorSeparator: (b: any) => ({ ...b, backgroundColor: 'var(--border)' }),
        dropdownIndicator: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
        clearIndicator: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),

        // if you render into a portal (recommended to avoid overflow issues)
        menuPortal: (base: any) => ({ ...base, zIndex: 60 }), // adjust to your stack
    };

    const apply = () => {
        if (!dateTo) {
            alert('Please select a “To” date');
            return;
        }
        router.get(route('crushing.party-stock-report.index'), buildParams());
    };

    const reset = () => router.get(route('crushing.party-stock-report.index'));

    const print = () => window.print();

    /* ---------- columns ---------- */
    const columns = [
        { header: 'Party', accessor: 'party' },
        { header: 'Godown', accessor: 'godown' },
        { header: 'Item', accessor: 'item' },
        { header: 'Unit', accessor: 'unit' },
        // { header: 'Opening', accessor: (r) => r.opening.toFixed(3), className: 'text-right' },
        { header: 'Deposit', accessor: (r) => r.deposit.toFixed(3), className: 'text-right' },
        { header: 'Withdraw', accessor: (r) => r.withdraw.toFixed(3), className: 'text-right' },
        { header: 'Generated', accessor: (r) => r.conv_in.toFixed(3), className: 'text-right' },
        { header: 'Consumed', accessor: (r) => r.conv_out.toFixed(3), className: 'text-right' },
        {
            header: 'Current Stock',
            accessor: (r) => r.closing.toFixed(3),
            className: 'text-right font-semibold',
            cellClass: (r) => (r.closing < 0 ? 'text-red-600' : ''),
        },
    ];

    const breakdown = React.useMemo(() => {
        const m = new Map<string, number>();
        rows.forEach((r: any) => {
            const key = `${r.item}|${r.unit || ''}`;
            m.set(key, (m.get(key) || 0) + Number(r.closing));
        });
        return Array.from(m.entries())
            .map(([key, qty]) => {
                const [item, unit] = key.split('|');
                return { item, unit, qty };
            })
            .sort((a, b) => a.item.localeCompare(b.item));
    }, [rows]);

    /* ---------- JSX ---------- */
    return (
        <AppLayout>
            <Head title="Crushing – Party Stock Report" />

            <div className="p-4 md:p-12 print:p-0 h-full w-screen lg:w-full">
                <div className="print:p-4 print:shadow-none">
                    <PageHeader title="Party Stock Report" />

                    {/* filter bar */}
                    <div className="mb-6 grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5 print:hidden">
                        {/* Party */}
                        <div className="">
                            <label htmlFor="">Party</label>
                            <Select
                                options={partyOpts}
                                classNamePrefix="rs"
                                placeholder="All Parties"
                                value={partyOpts.find((o) => o.value === partyId) || null}
                                onChange={(o) => setPartyId(o?.value ?? '')}
                                isClearable
                                className="min-w-[180px]"
                                styles={selectStyles}
                            />
                        </div>
                        {/* Items */}
                        <div className="">
                            <label htmlFor="">Items</label>
                            <Select
                                options={itemOpts}
                                classNamePrefix="rs"
                                placeholder="All Items"
                                value={itemOpts.find((o) => o.value === itemId) || null}
                                onChange={(o) => setItemId(o?.value ?? '')}
                                isClearable
                                className="min-w-[180px]"
                                styles={selectStyles}
                            />
                        </div>

                        {/* From */}
                        <InputCalendar label="From" value={dateFrom} onChange={setDateFrom} max={dateTo || dayjs().format('YYYY-MM-DD')} />

                        {/* To */}
                        <InputCalendar
                            label="To"
                            value={dateTo}
                            onChange={setDateTo}
                            min={dateFrom || undefined}
                            max={dayjs().format('YYYY-MM-DD')}
                        />

                        {/* Apply and reset buttons */}
                        <div className="flex gap-2 items-center mt-3">
                            <button
                                onClick={apply}
                                className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
                            >
                                Apply
                            </button>
                            <button
                                onClick={reset}
                                className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* table */}
                    <TableComponent
                        columns={columns}
                        data={rows}
                        noDataMessage="No records"
                        className="max-h-[65vh] overflow-auto [&_tbody_tr:nth-child(odd)]:bg-gray-50 [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:bg-background"
                    />

                    {/* totals ribbon */}
                    <div className="mt-6 grid max-w-lg grid-cols-2 gap-2 text-sm print:text-base">
                        <span className="font-semibold">Opening</span>
                        <span className="text-right">{Number(totals.opening ?? 0).toFixed(3)}</span>

                        <span className="font-semibold">Deposit</span>
                        <span className="text-right text-blue-900">{Number(totals.deposit ?? 0).toFixed(3)}</span>

                        <span className="font-semibold">Withdraw</span>
                        <span className="text-right text-red-600">- {Number(totals.withdraw ?? 0).toFixed(3)}</span>

                        <span className="font-semibold">Generated</span>
                        <span className="text-right text-green-800">+ {Number(totals.conv_in ?? 0).toFixed(3)}</span>

                        <span className="font-bold">Consumed</span>
                        <span className="text-right text-gray-700">- {Number(totals.conv_out ?? 0).toFixed(3)}</span>

                        <hr className="col-span-2" />

                        <span className="font-semibold">Closing / Balance</span>
                        <span className="text-right font-semibold">{Number(totals.closing ?? 0).toFixed(3)}</span>
                    </div>

                    {/* concise breakdown */}
                    {breakdown.length > 0 && (
                        <div className="mt-8 space-y-1 text-sm print:text-base">
                            <h3 className="mb-1 font-semibold">Summary</h3>
                            {breakdown.map((b, i) => (
                                <div key={i}>
                                    • {b.item}: {b.qty.toFixed(3)} {b.unit || ''}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* print button */}
                    <div className="mt-6 print:hidden">
                        <button onClick={print} className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 w-full md:w-auto">
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
