import TableComponent from '@/components/TableComponent';
import React from 'react';
import Select from 'react-select';
import { ConsumedRow, ErrorsBag, Owner, RSOption, UnitLite } from './types';

type CompanyItemOpt = {
    value: number;
    label: string;
    unit: string;
    item_weight?: number;
    lots: Array<{ lot_id: number; lot_no: string; stock_qty: number; unit_weight?: number }>;
};

type PartyOpt = {
    value: string;
    label: string;
    unit_name: string;
    per_unit_kg?: number;
};

interface Props {
    owner: Owner;
    rows: ConsumedRow[];
    units: UnitLite[];
    errors: ErrorsBag;
    // consumedOptsForParty: RSOption<string>[];
    companyItemOpts: CompanyItemOpt[];
    consumedOptsForParty: PartyOpt[];
    lotOptionsForItem: (itemId: string | number) => RSOption<number>[];
    onAdd: () => void;
    onRemove: (idx: number) => void;
    onPatch: (idx: number, patch: Partial<ConsumedRow>) => void;
}
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
const ConsumedTable: React.FC<Props> = React.memo(
    ({ owner, rows, units, errors, consumedOptsForParty, companyItemOpts, lotOptionsForItem, onAdd, onRemove, onPatch }) => {
        const err = (p: string) => (errors?.[p] as string) || undefined;

        // Define table columns for TableComponent
        const tableColumns = [
            {
                header: owner === 'company' ? 'পণ্যের নাম' : 'Item',
                accessor: (row: ConsumedRow, idx: number) =>
                    owner === 'party' ? (
                        <>
                            <Select
                                classNamePrefix="rs"
                                placeholder="Item"
                                options={consumedOptsForParty}
                                value={consumedOptsForParty.find((o) => o.value === String(row.party_item_id))}
                                onChange={(sel) => {
                                    const unit = (sel as PartyOpt | null)?.unit_name || '';
                                    const puk = (sel as PartyOpt | null)?.per_unit_kg;
                                    const qtyNum = parseFloat(String(row.qty || '0')) || 0;
                                    const perKg = typeof puk === 'number' ? puk : unit.toLowerCase() === 'kg' ? 1 : undefined;
                                    const nextWeight = qtyNum > 0 && perKg ? String((qtyNum * perKg).toFixed(3)) : row.weight || '';
                                    onPatch(idx, {
                                        party_item_id: sel?.value || '',
                                        unit_name: unit,
                                        per_unit_kg: perKg,
                                        weight: nextWeight,
                                    });
                                }}
                                isClearable
                                styles={selectStyles}
                            />
                            {err(`consumed.${idx}.party_item_id`) && <p className="text-xs text-red-500">{err(`consumed.${idx}.party_item_id`)}</p>}
                        </>
                    ) : (
                        <Select
                            classNamePrefix="rs"
                            placeholder="Item"
                            options={companyItemOpts}
                            value={companyItemOpts.find((o) => o.value === Number(row.item_id))}
                            onChange={(sel) => onPatch(idx, { item_id: (sel?.value as any) || '', lot_id: '' })}
                            styles={selectStyles}
                        />
                    ),
            },
            owner === 'company' && {
                header: 'লট/ব্যাচ নং',
                accessor: (row: ConsumedRow, idx: number) => (
                    <Select
                        classNamePrefix="rs"
                        placeholder="Lot"
                        options={lotOptionsForItem(row.item_id!)}
                        value={lotOptionsForItem(row.item_id!).find((o) => o.value === Number(row.lot_id))}
                        isDisabled={!row.item_id}
                        onChange={(sel) => onPatch(idx, { lot_id: (sel?.value as any) || '' })}
                        styles={selectStyles}
                    />
                ),
            },
            {
                header: 'পরিমাণ',
                accessor: (row: ConsumedRow, idx: number) => (
                    <input
                        type="number"
                        className="w-full rounded border px-1 py-1.5 text-right"
                        value={row.qty}
                        onChange={(e) => {
                            const qty = e.target.value;
                            const qtyNum = parseFloat(qty || '0') || 0;
                            const unitNm = String(row.unit_name || '').toLowerCase();
                            const perKg = typeof row.per_unit_kg === 'number' ? row.per_unit_kg : unitNm === 'kg' ? 1 : undefined;
                            const nextWeight = qtyNum > 0 && perKg ? String((qtyNum * perKg).toFixed(3)) : row.weight || '';
                            onPatch(idx, { qty, weight: nextWeight });
                        }}
                    />
                ),
            },
            {
                header: 'একক',
                accessor: (row: ConsumedRow, idx: number) => (
                    <select
                        className="w-full rounded border py-1.5"
                        value={row.unit_name}
                        onChange={(e) => onPatch(idx, { unit_name: e.target.value })}
                    >
                        <option value=""></option>
                        {units.map((u) => (
                            <option key={u.id} value={u.name}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                ),
            },
            {
                header: 'ওজন (kg)',
                accessor: (row: ConsumedRow, idx: number) => (
                    <>
                        <input
                            type="number"
                            step="0.001"
                            className="w-full rounded border px-1 py-1.5 text-right"
                            value={row.weight || ''}
                            onChange={(e) => onPatch(idx, { weight: e.target.value })}
                        />
                        {owner === 'company' &&
                            row.item_id &&
                            (() => {
                                const itm = companyItemOpts.find((o) => o.value === Number(row.item_id));
                                const lot = itm?.lots?.find((l) => Number(l.lot_id) === Number(row.lot_id));
                                const unitNm = (row.unit_name || itm?.unit || '').trim();
                                let perUnitKg = 0;
                                if (unitNm.toLowerCase() === 'kg') perUnitKg = 1;
                                else if ((itm?.item_weight ?? 0) > 0) perUnitKg = Number(itm!.item_weight);
                                else if ((lot?.unit_weight ?? 0) > 0) perUnitKg = Number(lot!.unit_weight);
                                return perUnitKg > 0 && unitNm ? (
                                    <span className="mt-1 block text-[11px] text-red-800">
                                        1 <b>{unitNm}</b> = <b>{perUnitKg}</b> kg
                                    </span>
                                ) : null;
                            })()}
                    </>
                ),
            },
        ].filter(Boolean);

        return (
            <>
                <h2 className="mt-6 mb-2 text-lg font-semibold">কনজিউমড পণ্য</h2>
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
    },
);

export default ConsumedTable;
