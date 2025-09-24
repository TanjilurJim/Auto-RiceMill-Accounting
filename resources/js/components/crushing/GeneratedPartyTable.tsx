import TableComponent from '@/components/TableComponent';
import React from 'react';
import { ErrorsBag, GeneratedRow, UnitLite } from './types';

interface Props {
    rows: GeneratedRow[];
    units: UnitLite[];
    errors: ErrorsBag;
    onAdd: () => void;
    onRemove: (idx: number) => void;
    onPatch: (idx: number, patch: Partial<GeneratedRow>) => void;
    flashMain?: boolean;
}

const GeneratedPartyTable: React.FC<Props> = React.memo(({ rows, units, errors, onAdd, onRemove, onPatch, flashMain }) => {
    const err = (p: string) => (errors?.[p] as string) || undefined;

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: 'মেইন',
            accessor: (row: GeneratedRow, idx: number) => (
                <input
                    type="radio"
                    name="mainGenerated"
                    checked={!!row.is_main}
                    onChange={() => onPatch(idx, { is_main: true })}
                    title="Mark as main product"
                />
            ),
            className: 'text-center',
        },
        {
            header: 'পণ্যের নাম',
            accessor: (row: GeneratedRow, idx: number) => (
                <>
                    <input
                        className="w-full rounded border px-2 py-1"
                        value={row.item_name}
                        onChange={(e) => onPatch(idx, { item_name: e.target.value })}
                        placeholder="e.g. Rice (Miniket)"
                    />
                    {err(`generated.${idx}.item_name`) && <p className="text-xs text-red-500">{err(`generated.${idx}.item_name`)}</p>}
                </>
            ),
        },
        {
            header: 'পরিমাণ',
            accessor: (row: GeneratedRow, idx: number) => (
                <>
                    <input
                        type="number"
                        className="w-full rounded border px-1 py-1.5 text-right"
                        value={row.qty}
                        onChange={(e) => onPatch(idx, { qty: e.target.value })}
                    />
                    {err(`generated.${idx}.qty`) && <p className="text-xs text-red-500">{err(`generated.${idx}.qty`)}</p>}
                </>
            ),
        },
        {
            header: 'একক',
            accessor: (row: GeneratedRow, idx: number) => (
                <>
                    <select
                        className="w-full rounded border py-1.5"
                        value={row.unit_name || ''}
                        onChange={(e) => onPatch(idx, { unit_name: e.target.value })}
                    >
                        <option value=""></option>
                        {units.map((u) => (
                            <option key={u.id} value={u.name}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {err(`generated.${idx}.unit_name`) && <p className="text-xs text-red-500">{err(`generated.${idx}.unit_name`)}</p>}
                </>
            ),
        },
        {
            header: 'বস্তার ওজন (kg)',
            accessor: (row: GeneratedRow, idx: number) =>
                String(row.unit_name || '').toLowerCase() === 'bosta' ? (
                    <select
                        className="w-full rounded border py-1.5"
                        value={row.bosta_weight ?? ''}
                        onChange={(e) => onPatch(idx, { bosta_weight: e.target.value })}
                    >
                        <option value="">Select…</option>
                        {[10, 20, 25, 50, 75].map((k) => (
                            <option key={k} value={k}>
                                {k}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
        {
            header: 'প্রতি কেজি পরতা',
            accessor: (row: GeneratedRow, idx: number) =>
                row.is_main ? (
                    <input
                        readOnly
                        className={`w-full cursor-not-allowed rounded border bg-gray-50 px-1 py-1.5 text-right transition ${row._justComputed ? 'animate-pulse ring-2 ring-green-500' : ''}`}
                        value={(row as any).per_kg_rate || ''}
                        placeholder="—"
                        title="Computed from total cost ÷ main weight"
                    />
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
        {
            header: 'ওজন (kg)',
            accessor: (row: GeneratedRow, idx: number) => (
                <>
                    <input
                        type="number"
                        step="0.001"
                        className="w-full rounded border px-1 py-1.5 text-right"
                        value={row.weight || ''}
                        onChange={(e) => onPatch(idx, { weight: e.target.value })}
                    />
                    {String(row.unit_name || '').toLowerCase() === 'bosta' && row.bosta_weight ? (
                        <div className="mt-1 text-[11px] text-[tomato]">
                            1 <b>Bosta</b> = <b>{row.bosta_weight}</b> kg
                        </div>
                    ) : null}
                </>
            ),
        },
        {
            header: 'বাই-প্রোডাক্ট এর ভ্যালু (৳)',
            accessor: (row: GeneratedRow, idx: number) =>
                row.is_main ? (
                    <span className="text-gray-400">—</span>
                ) : (
                    <input
                        type="number"
                        step="0.01"
                        className="w-full rounded border px-1 py-1.5 text-right"
                        value={row.sale_value || ''}
                        onChange={(e) => onPatch(idx, { sale_value: e.target.value })}
                        placeholder="0.00"
                    />
                ),
        },
    ];

    return (
        <>
            <h2 className="mt-8 mb-2 text-lg font-semibold">উৎপাদিত পণ্য </h2>
            <TableComponent
                columns={tableColumns}
                data={rows}
                actions={(row, idx) => (
                    <button type="button" onClick={() => onRemove(idx)} className="font-bold text-red-600">
                        ✕
                    </button>
                )}
                noDataMessage="কোনো পণ্য নেই"
            />
            <button type="button" onClick={onAdd} className="mt-1 text-sm text-blue-600">
                + আরো পণ্য যুক্ত করুন
            </button>
        </>
    );
});

export default GeneratedPartyTable;
