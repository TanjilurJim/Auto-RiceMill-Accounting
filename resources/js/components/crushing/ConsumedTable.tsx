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

interface Props {
    owner: Owner;
    rows: ConsumedRow[];
    units: UnitLite[];
    errors: ErrorsBag;
    consumedOptsForParty: RSOption<string>[];
    companyItemOpts: CompanyItemOpt[];
    lotOptionsForItem: (itemId: string | number) => RSOption<number>[];
    onAdd: () => void;
    onRemove: (idx: number) => void;
    onPatch: (idx: number, patch: Partial<ConsumedRow>) => void;
}

const ConsumedTable: React.FC<Props> = React.memo(
    ({ owner, rows, units, errors, consumedOptsForParty, companyItemOpts, lotOptionsForItem, onAdd, onRemove, onPatch }) => {
        const err = (p: string) => (errors?.[p] as string) || undefined;

        return (
            <>
                <h2 className="mt-6 mb-2 text-lg font-semibold">Consumed</h2>
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-1">{owner === 'company' ? 'Item / Lot' : 'Item'}</th>
                            {owner === 'company' && <th className="border p-1">Lot</th>}
                            <th className="border p-1">Qty</th>
                            <th className="border p-1">Unit</th>
                            <th className="border p-1">Weight (kg)</th>
                            <th className="w-6 border p-1">✕</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                {owner === 'party' ? (
                                    <td className="border p-1">
                                        <Select
                                            classNamePrefix="rs"
                                            placeholder="Item"
                                            options={consumedOptsForParty}
                                            value={consumedOptsForParty.find((o) => o.value === String(row.party_item_id))}
                                            onChange={(sel) => onPatch(idx, { party_item_id: sel?.value || '' })}
                                        />
                                        {err(`consumed.${idx}.party_item_id`) && (
                                            <p className="text-xs text-red-500">{err(`consumed.${idx}.party_item_id`)}</p>
                                        )}
                                    </td>
                                ) : (
                                    <>
                                        <td className="border p-1">
                                            <Select
                                                classNamePrefix="rs"
                                                placeholder="Item"
                                                options={companyItemOpts}
                                                value={companyItemOpts.find((o) => o.value === Number(row.item_id))}
                                                onChange={(sel) => onPatch(idx, { item_id: (sel?.value as any) || '', lot_id: '' })}
                                            />
                                        </td>
                                        <td className="border p-1">
                                            <Select
                                                classNamePrefix="rs"
                                                placeholder="Lot"
                                                options={lotOptionsForItem(row.item_id!)}
                                                value={lotOptionsForItem(row.item_id!).find((o) => o.value === Number(row.lot_id))}
                                                isDisabled={!row.item_id}
                                                onChange={(sel) => onPatch(idx, { lot_id: (sel?.value as any) || '' })}
                                            />
                                        </td>
                                    </>
                                )}

                                <td className="border p-1">
                                    <input
                                        type="number"
                                        className="w-full rounded border px-1 py-1.5 text-right"
                                        value={row.qty}
                                        onChange={(e) => onPatch(idx, { qty: e.target.value })}
                                    />
                                </td>

                                <td className="border p-1">
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
                                </td>

                                <td className="border p-1">
                                    <input
                                        type="number"
                                        step="0.001"
                                        className="w-full rounded border px-1 py-1.5 text-right"
                                        value={row.weight || ''}
                                        onChange={(e) => onPatch(idx, { weight: e.target.value })}
                                    />
                                    {/* hint: per-unit kg */}
                                    {owner === 'company' && row.item_id && (
                                        <div className="mt-1 text-[11px] text-gray-500">
                                            {(() => {
                                                const itm = companyItemOpts.find((o) => o.value === Number(row.item_id));
                                                const lot = itm?.lots?.find((l) => Number(l.lot_id) === Number(row.lot_id));
                                                const unitNm = (row.unit_name || itm?.unit || '').trim();
                                                let perUnitKg = 0;
                                                if (unitNm.toLowerCase() === 'kg') perUnitKg = 1;
                                                else if ((itm?.item_weight ?? 0) > 0) perUnitKg = Number(itm!.item_weight);
                                                else if ((lot?.unit_weight ?? 0) > 0) perUnitKg = Number(lot!.unit_weight);
                                                return perUnitKg > 0 && unitNm ? (
                                                    <span className="text-red-800">
                                                        1 <b>{unitNm}</b> = <b>{perUnitKg}</b> kg
                                                    </span>
                                                ) : null;
                                            })()}
                                        </div>
                                    )}
                                </td>

                                <td className="border text-center">
                                    <button type="button" onClick={() => onRemove(idx)} className="font-bold text-red-600">
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={onAdd} className="mt-1 text-sm text-blue-600">
                    + line
                </button>
            </>
        );
    },
);

export default ConsumedTable;
