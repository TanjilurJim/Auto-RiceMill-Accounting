import React from 'react';
import Select from 'react-select';

export type Basis = 'per_bosta' | 'per_kg_main' | 'fixed';

export type Preset = {
    id: string;
    label: string;
    rate: number;
    basis: Basis;
};

export type ProductionCostRow = {
    id: string;
    label: string;
    amount: number | '';
    // optional preset metadata if chosen
    preset_id?: string;
    basis?: Basis;
    rate?: number;
    qty?: number | '';
};

interface Props {
    value: ProductionCostRow[];
    presets: Preset[];
    // live drivers for auto-calculation:
    dhaanBostaCount: number; // total bosta (from consumed)
    mainKg: number; // main rice total kg
    onChange: (rows: ProductionCostRow[]) => void;
}

// ---- Utils ----
const uid = () => Math.random().toString(36).slice(2, 10);
const basisText = (b: Basis) => (b === 'per_bosta' ? 'Per Bosta' : b === 'per_kg_main' ? 'Per kg (Main Rice)' : 'Fixed');

// ---- React-Select compact, Tailwind-like styles ----
// put near the top of the file
const inputCtrl =
    'w-full h-10 px-3 rounded-md border border-gray-300 text-sm leading-5 ' +
    'outline-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600';

const compactSelectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: 40,
        height: 40,
        borderRadius: 8,
        borderColor: state.isFocused ? '#4f46e5' : '#d1d5db', // indigo-600 / gray-300
        boxShadow: state.isFocused ? '0 0 0 3px rgba(79,70,229,0.15)' : 'none',
        '&:hover': { borderColor: state.isFocused ? '#4f46e5' : '#9ca3af' }, // gray-400
        backgroundColor: '#fff',
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: '0 10px',
    }),
    input: (base: any) => ({
        ...base,
        margin: 0,
        padding: 0,
    }),
    indicatorsContainer: (base: any) => ({
        ...base,
        height: 40,
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        padding: 8,
    }),
    clearIndicator: (base: any) => ({
        ...base,
        padding: 8,
    }),
    menu: (base: any) => ({
        ...base,
        zIndex: 50,
    }),
    option: (base: any, state: any) => ({
        ...base,
        padding: '8px 10px',
        backgroundColor: state.isFocused ? 'rgba(79,70,229,0.08)' : state.isSelected ? 'rgba(79,70,229,0.14)' : 'white',
        color: '#111827', // gray-900
    }),
};

const CostingSection: React.FC<Props> = React.memo(({ value, presets, dhaanBostaCount, mainKg, onChange }) => {
    const presetOptions = (presets ?? []).map((p) => ({
        value: p.id,
        label: `${p.label} — ${basisText(p.basis)} @ ${p.rate}`,
        meta: p,
    }));

    const computePresetAmount = (
        basis?: Basis,
        rate?: number,
        qty?: number | '',
        drivers?: { bosta: number; kg: number }, // live fallbacks
    ) => {
        if (!basis || !rate || rate <= 0) return 0;

        // prefer explicit row qty; otherwise fall back to live drivers
        const q =
            basis === 'per_bosta'
                ? qty !== '' && qty != null
                    ? Number(qty)
                    : drivers?.bosta || 0
                : basis === 'per_kg_main'
                  ? qty !== '' && qty != null
                      ? Number(qty)
                      : drivers?.kg || 0
                  : 1;

        if (basis === 'fixed') return rate;
        return q * rate;
    };

    const setRows = (rows: ProductionCostRow[]) => onChange(rows);

    const addRow = () => setRows([...(value ?? []), { id: uid(), label: '', amount: '' }]);

    const patchRow = (rowId: string, patch: Partial<ProductionCostRow>) => {
        setRows((value ?? []).map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
    };

    const removeRow = (rowId: string) => setRows((value ?? []).filter((r) => r.id !== rowId));

    const applyPresetToRow = (rowId: string, preset: Preset | null) => {
        if (!preset) {
            patchRow(rowId, { preset_id: undefined, basis: undefined, rate: undefined, qty: undefined });
            return;
        }
        const amount = computePresetAmount(
            preset.basis,
            preset.rate,
            '', // 👈 empty = follow live totals
            { bosta: dhaanBostaCount || 0, kg: mainKg || 0 },
        );
        patchRow(rowId, {
            label: preset.label,
            preset_id: preset.id,
            basis: preset.basis,
            rate: preset.rate,
            qty: '', // 👈 user can override later
            amount: Number(amount.toFixed(2)),
        });
    };

    // Live recompute preset rows whenever drivers change
    React.useEffect(() => {
        const rows = value ?? [];
        let changed = false;

        const next = rows.map((r) => {
            if (!r.preset_id || !r.basis || typeof r.rate !== 'number') return r;

            const amount = computePresetAmount(r.basis, r.rate, r.qty, { bosta: dhaanBostaCount || 0, kg: mainKg || 0 });
            const amt = Number(amount.toFixed(2));

            if (r.amount !== amt) {
                changed = true;
                return { ...r, amount: amt };
            }
            return r;
        });

        if (changed) setRows(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dhaanBostaCount, mainKg, value]); // 👈 includes value so qty edits update amount

    const total = (value ?? []).reduce((sum, r) => {
        const n = typeof r.amount === 'string' ? parseFloat(r.amount) : r.amount;
        return sum + (isNaN(n as number) ? 0 : (n as number));
    }, 0);

    // Avoid SSR issues with menuPortalTarget
    const menuPortalTarget = typeof window !== 'undefined' ? document.body : undefined;

    return (
        <div className="mt-8 rounded border bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Production Cost</h3>
                <button
                    type="button"
                    onClick={addRow}
                    className="rounded-md bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700"
                    title="Add row"
                >
                    + Add row
                </button>
            </div>

            <div className="space-y-3">
                {(value ?? []).map((row) => {
                    const selectedPreset = row.preset_id ? presetOptions.find((o) => o.value === row.preset_id) : null;

                    return (
                        <div key={row.id} className="grid grid-cols-12 gap-3">
                            {/* Preset picker */}
                            <div className="col-span-4 flex flex-col">
                                <span className="mb-1 text-sm">Preset</span>
                                <Select
                                    className="flex-1"
                                    classNamePrefix="rs"
                                    styles={compactSelectStyles}
                                    options={presetOptions}
                                    value={selectedPreset || null}
                                    onChange={(opt) => applyPresetToRow(row.id, (opt as any)?.meta ?? null)}
                                    placeholder="Choose preset…"
                                    isClearable
                                    menuPortalTarget={menuPortalTarget}
                                    menuPosition="fixed"
                                />
                            </div>

                            {/* Label (editable; prefilled by preset) */}
                            <div className="col-span-4 flex flex-col">
                                <span className="mb-1 text-sm">Header</span>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className={inputCtrl}
                                        placeholder="e.g., Load–Unload"
                                        value={row.label}
                                        onChange={(e) => patchRow(row.id, { label: e.target.value })}
                                    />
                                    {row.basis && (
                                        <div className="mt-1 text-[11px] leading-4 text-gray-500">
                                            Basis: {basisText(row.basis)}
                                            {typeof row.rate === 'number' ? ` @ ${row.rate}` : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 flex flex-col">
                                <span className="mb-1 text-sm">Qty</span>
                                <input
                                    type="number"
                                    className={inputCtrl}
                                    placeholder={
                                        row.basis === 'per_bosta'
                                            ? String(dhaanBostaCount || 0)
                                            : row.basis === 'per_kg_main'
                                              ? String(mainKg || 0)
                                              : '—'
                                    }
                                    value={row.qty ?? ''}
                                    onChange={(e) =>
                                        patchRow(row.id, {
                                            qty: e.target.value === '' ? '' : Number(e.target.value),
                                        })
                                    }
                                    disabled={!row.basis || row.basis === 'fixed'}
                                />
                                {row.basis && row.basis !== 'fixed' && (
                                    <div className="mt-1 text-[11px] leading-4 text-gray-500">
                                        {row.qty === '' || row.qty == null ? 'Using live total' : 'Custom qty'}
                                    </div>
                                )}
                            </div>

                            {/* Amount (auto if preset, editable otherwise) */}
                            <div className="col-span-3 flex flex-col">
                                <span className="mb-1 text-sm">Costing (৳)</span>
                                <input
                                    type="number"
                                    className="h-10 w-full rounded-md border px-3"
                                    placeholder="0.00"
                                    value={row.amount}
                                    onChange={(e) =>
                                        patchRow(row.id, {
                                            amount: e.target.value === '' ? '' : Number(e.target.value),
                                        })
                                    }
                                    readOnly={!!row.preset_id}
                                />
                            </div>

                            {/* Remove button */}
                            <div className="col-span-1 flex flex-col">
                                <span className="invisible mb-1 text-sm">Action</span>
                                <button
                                    type="button"
                                    onClick={() => removeRow(row.id)}
                                    className="h-10 w-full rounded-md border border-red-300 px-3 text-sm text-red-600 hover:bg-red-50"
                                    title="Remove"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Total */}
                <div className="mt-2 flex items-center justify-end">
                    <div className="text-sm">
                        <span className="font-medium">Total Production Cost:</span>{' '}
                        <span>
                            ৳{' '}
                            {total.toLocaleString('en-BD', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CostingSection; 
