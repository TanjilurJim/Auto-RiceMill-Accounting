import TableComponent from '@/components/TableComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
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
                                value={row.party_item_id ? String(row.party_item_id) : ''}
                                onValueChange={(value) => {
                                    const selectedItem = consumedOptsForParty.find((o) => o.value === value);
                                    const unit = selectedItem?.unit_name || '';
                                    const puk = selectedItem?.per_unit_kg;
                                    const qtyNum = parseFloat(String(row.qty || '0')) || 0;
                                    const perKg = typeof puk === 'number' ? puk : unit.toLowerCase() === 'kg' ? 1 : undefined;
                                    const nextWeight = qtyNum > 0 && perKg ? String((qtyNum * perKg).toFixed(3)) : row.weight || '';
                                    onPatch(idx, {
                                        party_item_id: value || '',
                                        unit_name: unit,
                                        per_unit_kg: perKg,
                                        weight: nextWeight,
                                    });
                                }}
                            >
                                {consumedOptsForParty && consumedOptsForParty.length === 0 ? (
                                    <div className="mb-1 rounded bg-yellow-100 p-2 text-sm text-yellow-800">No items found for this party.</div>
                                ) : (
                                    <div>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select item" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="z-[100]" side="bottom" sideOffset={4}>
                                            {consumedOptsForParty.map((option) => (
                                                <SelectItem key={option.value} value={String(option.value)}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </div>
                                )}
                            </Select>
                            {err(`consumed.${idx}.party_item_id`) && <p className="text-xs text-red-500">{err(`consumed.${idx}.party_item_id`)}</p>}
                        </>
                    ) : (
                        <Select
                            value={row.item_id ? String(row.item_id) : ''}
                            onValueChange={(value) => onPatch(idx, { item_id: value || '', lot_id: '' })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Item" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-[100]" side="bottom" sideOffset={4}>
                                {companyItemOpts.map((option) => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ),
            },
            owner === 'company' && {
                header: 'লট/ব্যাচ নং',
                accessor: (row: ConsumedRow, idx: number) => (
                    <Select
                        value={row.lot_id ? String(row.lot_id) : ''}
                        onValueChange={(value) => onPatch(idx, { lot_id: value || '' })}
                        disabled={!row.item_id}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Lot" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[100]" side="bottom" sideOffset={4}>
                            {lotOptionsForItem(row.item_id!).map((option) => (
                                <SelectItem key={option.value} value={String(option.value)}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
