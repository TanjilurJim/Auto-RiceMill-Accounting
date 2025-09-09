import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { ErrorsBag, GeneratedRow, UnitLite } from './types';

interface Props {
    rows: GeneratedRow[];
    units: UnitLite[];
    errors: ErrorsBag;
    allItemOpts: Array<{ value: number; label: string; unit_name?: string }>;
    godownSelected: boolean;
    onAdd: () => void;
    onRemove: (idx: number) => void;
    onPatch: (idx: number, patch: Partial<GeneratedRow>) => void;
    flashMain?: boolean; // NEW: for visual feedback on main row
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
  input:       (base: any) => ({ ...base, color: 'var(--foreground)' }),
  placeholder: (base: any) => ({ ...base, color: 'var(--muted-foreground)' }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: 'var(--popover)',
    color: 'var(--popover-foreground)',
    border: '1px solid var(--border)',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'var(--primary)'
      : state.isFocused
      ? 'var(--accent)'
      : 'transparent',
    color: state.isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)',
  }),

  indicatorSeparator: (b: any) => ({ ...b, backgroundColor: 'var(--border)' }),
  dropdownIndicator:  (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
  clearIndicator:     (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),

  // if you render into a portal (recommended to avoid overflow issues)
  menuPortal: (base: any) => ({ ...base, zIndex: 60 }), // adjust to your stack
};

const GeneratedCompanyTable: React.FC<Props> = React.memo(
    ({ rows, units, errors, allItemOpts, godownSelected, onAdd, onRemove, onPatch, flashMain }) => {
        const err = (p: string) => (errors?.[p] as string) || undefined;

        return (
            <>
                <h2 className="mt-8 mb-2 text-lg font-semibold">উৎপাদিত পণ্য </h2>
                <table className="w-full border text-sm">
                    <thead className="bg-background">
                        <tr>
                            <th className="border p-1">মেইন</th>
                            <th className="border p-1">পণ্যের নাম</th>
                            <th className="border p-1">নতুন লট নং</th>
                            <th className="border p-1">পরিমাণ</th>
                            <th className="border p-1">একক</th>
                            <th className="border p-1">বস্তার ওজন (kg)</th> {/* ⬅ NEW */} 
                            <th className="border p-1">প্রতি কেজি পরতা </th>
                            <th className="border p-1">ওজন (kg)</th>
                            <th className="border p-1">বাই প্রোডাক্ট রেট (৳/একক)</th>
                            <th className="border p-1">বাই প্রোডাক্ট ভ্যালু (৳)</th>
                            <th className="w-6 border p-1">✕</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={row.id || idx}>
                                {/* Main selector */}
                                <td className="border p-1 text-center">
                                    <input
                                        type="radio"
                                        name="mainGenerated"
                                        checked={!!row.is_main}
                                        onChange={() => onPatch(idx, { is_main: true })}
                                        title="Mark as main product"
                                    />
                                </td>

                                {/* Item */}
                                <td className="border p-1">
                                    <CreatableSelect
                                        className="w-full"
                                        classNamePrefix="rs" // <-- fixed
                                        placeholder="Item"
                                        options={allItemOpts}
                                        value={
                                            allItemOpts.find((o) => o.value === Number(row.item_id)) ||
                                            (row.item_name ? ({ value: 0, label: row.item_name } as any) : null)
                                        }
                                        onChange={(sel: any) => {
                                            const match = allItemOpts.find((o) => o.value === Number(sel?.value));
                                            onPatch(idx, {
                                                item_id: sel?.value || '',
                                                item_name: '',
                                                unit_name: match?.unit_name || row.unit_name || '',
                                            });
                                        }}
                                        onCreateOption={(name: string) => onPatch(idx, { item_id: '', item_name: name })}
                                        isDisabled={!godownSelected}
                                        styles={selectStyles}
                                    />

                                    {err(`generated.${idx}.item_id`) && <p className="text-xs text-red-500">{err(`generated.${idx}.item_id`)}</p>}
                                    {err(`generated.${idx}.item_name`) && <p className="text-xs text-red-500">{err(`generated.${idx}.item_name`)}</p>}
                                </td>

                                {/* Lot */}
                                <td className="border p-1">
                                    <input
                                        className="w-full rounded border px-2 py-1.5"
                                        value={row.lot_no || ''}
                                        onChange={(e) => onPatch(idx, { lot_no: e.target.value })}
                                        placeholder="e.g. A-15"
                                    />
                                    {err(`generated.${idx}.lot_no`) && <p className="text-xs text-red-500">{err(`generated.${idx}.lot_no`)}</p>}
                                </td>

                                {/* Qty */}
                                <td className="border p-1">
                                    <input
                                        type="number"
                                        className="w-full rounded border px-1 py-1.5 text-right"
                                        value={row.qty || ''}
                                        onChange={(e) => onPatch(idx, { qty: e.target.value })}
                                    />
                                    {err(`generated.${idx}.qty`) && <p className="text-xs text-red-500">{err(`generated.${idx}.qty`)}</p>}
                                </td>

                                {/* Unit */}
                                <td className="border p-1">
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
                                </td>

                                {/* ⬇ NEW: Bosta weight selector */}
                                <td className="border p-1">
                                    {String(row.unit_name || '').toLowerCase() === 'bosta' ? (
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
                                    )}
                                </td>

                                {/* Per-kg rate (main only) */}
                                <td className="border p-1">
                                    {row.is_main ? (
                                        <input
                                            readOnly
                                            className={`w-full cursor-not-allowed rounded border bg-background px-1 text-right transition ${row._justComputed ? 'animate-pulse ring-2 ring-green-500' : ''}`}
                                            value={(row as any).per_kg_rate || ''}
                                            placeholder="—"
                                            title="Computed from total cost ÷ main weight"
                                        />
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>

                                {/* Weight */}
                                <td className="border p-1">
                                    <input
                                        type="number"
                                        step="0.001"
                                        className="w-full rounded border px-1 py-1.5 text-right"
                                        value={row.weight || ''}
                                        onChange={(e) => onPatch(idx, { weight: e.target.value })}
                                    />
                                    {String(row.unit_name || '').toLowerCase() === 'bosta' && row.bosta_weight ? (
                                        <div className="mt-1 text-[8px] text-[tomato]">
                                            1 <b>Bosta</b> = <b>{row.bosta_weight}</b> kg
                                        </div>
                                    ) : null}
                                </td>
                                {/* By-product rate (৳/unit) */}
                                <td className="border p-1">
                                    {row.is_main ? (
                                        <span className="text-gray-400">—</span>
                                    ) : (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full rounded border px-1 py-1.5 text-right"
                                            value={(row as any).byproduct_unit_rate || ''}
                                            onChange={(e) => onPatch(idx, { byproduct_unit_rate: e.target.value })}
                                            placeholder="0.00"
                                            title="৳ per selected unit (e.g., per kg or per bosta)"
                                        />
                                    )}
                                </td>

                                {/* By-product total (৳) – auto computed */}
                                <td className="border p-1">
                                    {row.is_main ? (
                                        <span className="text-gray-400">—</span>
                                    ) : (
                                        <input
                                            readOnly
                                            className="w-full cursor-not-allowed rounded border bg-background px-1 py-1.5 text-right"
                                            value={row.sale_value || ''}
                                            placeholder="0.00"
                                            title="Auto: qty × rate"
                                        />
                                    )}
                                </td>

                                {/* Remove */}
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

export default GeneratedCompanyTable;
