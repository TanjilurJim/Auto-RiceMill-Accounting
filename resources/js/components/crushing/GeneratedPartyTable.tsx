import React from 'react';
import CreatableSelect from 'react-select/creatable';
import TableComponent from '@/components/TableComponent';
import type { ErrorsBag, GeneratedRow, UnitLite } from './types';

type PartyOpt = { value: string; label: string; unit_name?: string; per_unit_kg?: number };

interface Props {
  rows: GeneratedRow[];
  units: UnitLite[];
  errors: ErrorsBag;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onPatch: (idx: number, patch: Partial<GeneratedRow>) => void;
  flashMain?: boolean;
  partySelected?: boolean;
  partyItemOpts?: PartyOpt[]; // suggestions scoped to selected party+godown
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
  menu: (base: any) => ({ ...base, backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--accent)' : 'transparent',
    color: state.isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)',
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 60 }),
};

const stripStockSuffix = (label: string) => {
  // your labels look like: "Miniket  (in stock: 12 kg)"
  // keep only the left part before the two spaces + '(' marker, if present
  const idx = label.indexOf('  (in stock:');
  return idx >= 0 ? label.slice(0, idx).trim() : label.trim();
};

const GeneratedPartyTable: React.FC<Props> = React.memo(
  ({ rows, units, errors, onAdd, onRemove, onPatch, flashMain, partySelected = false, partyItemOpts = [] }) => {
    const err = (p: string) => (errors?.[p] as string) || undefined;

    return (
      <>
        <h2 className="mt-8 mb-2 text-lg font-semibold">উৎপাদিত পণ্য </h2>
        <TableComponent
          columns={[
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
              accessor: (row: GeneratedRow, idx: number) => {
                // derive a value for the select:
                // if row.party_item_id -> find matching option by value
                // else if item_name matches a stripped existing label -> show that option visually
                // else show a new-option with current item_name (if present)
                let value: any = null;

                if (row.party_item_id) {
                  value = partyItemOpts.find((o) => String(o.value) === String(row.party_item_id)) || null;
                } else if (row.item_name) {
                  const exact = partyItemOpts.find((o) => stripStockSuffix(o.label).toLowerCase() === row.item_name.trim().toLowerCase());
                  if (exact) value = exact;
                  else value = { value: `new:${row.item_name}`, label: row.item_name, __isNew__: true };
                }

                return (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-full">
                        <CreatableSelect
                          classNamePrefix="rs"
                          isClearable
                          isDisabled={!partySelected}
                          placeholder={partySelected ? 'Select or type item name…' : 'Select party & godown first'}
                          options={partyItemOpts}
                          value={value}
                          styles={selectStyles}
                          formatCreateLabel={(inputValue: string) => `Create "${inputValue}"`}
                          getNewOptionData={(inputValue: string) => ({ value: `new:${inputValue}`, label: inputValue, __isNew__: true })}
                          onChange={(sel: any) => {
                            if (!sel) {
                              // cleared
                              onPatch(idx, { party_item_id: '', item_name: '' });
                              return;
                            }

                            const isNew = sel.__isNew__ === true || String(sel.value).startsWith('new:');
                            if (!isNew) {
                              // existing option selected
                              const match = partyItemOpts.find((o) => String(o.value) === String(sel.value));
                              onPatch(idx, {
                                party_item_id: String(sel.value),
                                item_name: '',
                                unit_name: match?.unit_name ?? undefined,
                                // copy per_unit_kg if available so weight auto-calculation can work
                                // note: GeneratedRow may not have per_unit_kg typed; we still pass it
                                ...(match?.per_unit_kg !== undefined ? ({ per_unit_kg: match.per_unit_kg } as any) : {}),
                              } as any);
                            } else {
                              // new local item -> keep deferred-create behavior
                              const name = String(sel.label || sel.value || '').replace(/^new:/, '');
                              onPatch(idx, { party_item_id: '', item_name: name });
                            }
                          }}
                          onCreateOption={(name: string) => {
                            onPatch(idx, { party_item_id: '', item_name: name });
                          }}
                          menuPortalTarget={document.body}
                        />
                      </div>

                      {/* Badge for deferred new items */}
                      {!row.party_item_id && row.item_name ? (
                        <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          New — will be created on save
                        </span>
                      ) : null}
                    </div>

                    {!partySelected ? (
                      <p className="text-xs text-gray-500 mt-1">Select party & godown to pick or create items.</p>
                    ) : err(`generated.${idx}.item_name`) ? (
                      <p className="text-xs text-red-500">{err(`generated.${idx}.item_name`)}</p>
                    ) : null}
                  </>
                );
              },
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
                    className={`w-full cursor-not-allowed rounded border bg-background px-1 py-1.5 text-right transition ${
                      (row as any)._justComputed ? 'animate-pulse ring-2 ring-green-500' : ''
                    }`}
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
              header: 'বাই প্রোডাক্ট রেট (৳/একক)',
              accessor: (row: GeneratedRow, idx: number) =>
                row.is_main ? (
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
                ),
            },
            {
              header: 'বাই প্রোডাক্ট ভ্যালু (৳)',
              accessor: (row: GeneratedRow, idx: number) =>
                row.is_main ? (
                  <span className="text-gray-400">—</span>
                ) : (
                  <input
                    readOnly
                    className="w-full cursor-not-allowed rounded border bg-background px-1 py-1.5 text-right"
                    value={row.sale_value || ''}
                    placeholder="0.00"
                    title="Auto: qty × rate"
                  />
                ),
            },
          ]}
          data={rows}
          actions={(row, idx) => (
            <button type="button" onClick={() => onRemove(idx)} className="font-bold text-red-600">
              ✕
            </button>
          )}
          noDataMessage="কোনো পণ্য নেই"
        />

        <button
          type="button"
          onClick={onAdd}
          className="mt-1 text-sm text-blue-600"
          disabled={!partySelected}
          title={!partySelected ? 'Select party & godown first to add generated rows' : undefined}
        >
          + আরো পণ্য যুক্ত করুন
        </button>

        {!partySelected ? (
          <p className="text-xs text-gray-500 mt-2">Pick a party & godown first. New items are created for that party when you save.</p>
        ) : null}
      </>
    );
  },
);

export default GeneratedPartyTable;
