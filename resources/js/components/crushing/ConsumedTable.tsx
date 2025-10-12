// ConsumedTable.tsx
import TableComponent from '@/components/TableComponent';
import React from 'react';
import RS from 'react-select';
import { ConsumedRow, ErrorsBag, Owner, RSOption, UnitLite } from './types';

/* --- helper: react-select in a table cell, menu escaped to portal --- */
function RSInCell(props: any) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState<number>();

  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    setW(el.offsetWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      <RS
        {...props}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        menuPosition="fixed"
        menuShouldBlockScroll
        styles={{
          control: (base: any, state: any) => ({
            ...base,
            backgroundColor: 'var(--input)',
            borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
            boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
            minHeight: '2.25rem',
            borderRadius: 'var(--radius-md)',
          }),
          singleValue: (b: any) => ({ ...b, color: 'var(--foreground)' }),
          input: (b: any) => ({ ...b, color: 'var(--foreground)' }),
          placeholder: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
          container: (b: any) => ({ ...b, width: '100%' }),
          menuPortal: (b: any) => ({ ...b, zIndex: 70 }),
          // match dropdown width to trigger width
          menu: (b: any) => ({
            ...b,
            width: w ?? b.width,
            minWidth: w ?? b.minWidth,
          }),
          option: (b: any, s: any) => ({
            ...b,
            backgroundColor: s.isSelected
              ? 'var(--primary)'
              : s.isFocused
              ? 'var(--accent)'
              : 'transparent',
            color: s.isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)',
          }),
        }}
      />
    </div>
  );
}

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
  companyItemOpts: CompanyItemOpt[];
  consumedOptsForParty: PartyOpt[];
  lotOptionsForItem: (itemId: string | number) => RSOption<number>[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onPatch: (idx: number, patch: Partial<ConsumedRow>) => void;
}

const rsStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'var(--input)',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
    boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
    color: 'var(--foreground)',
    minHeight: '2.25rem',
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
    zIndex: 60,
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
  dropdownIndicator: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
  clearIndicator: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
  menuPortal: (base: any) => ({ ...base, zIndex: 60 }),
};

const ConsumedTable: React.FC<Props> = React.memo(
  ({ owner, rows, units, errors, consumedOptsForParty, companyItemOpts, lotOptionsForItem, onAdd, onRemove, onPatch }) => {
    const err = (p: string) => (errors?.[p] as string) || undefined;

    // --- merge helpers to ensure saved values always show ---
    const mergedPartyOpts = React.useMemo(() => {
      const live = (consumedOptsForParty ?? []).map(o => ({
        value: String(o.value),
        label: o.label,
        unit_name: o.unit_name,
        per_unit_kg: o.per_unit_kg,
      }));
      const saved = rows
        .filter(r => r.party_item_id)
        .map(r => ({
          value: String(r.party_item_id),
          label: live.find(b => b.value === String(r.party_item_id))?.label ?? `Item #${r.party_item_id}`,
          unit_name: r.unit_name || '',
          per_unit_kg: (r as any).per_unit_kg,
        }));
      const seen = new Set<string>();
      return [...saved, ...live].filter(o => !seen.has(o.value) && seen.add(o.value));
    }, [consumedOptsForParty, rows]);

    const mergedCompanyItemOpts = React.useMemo(() => {
      const live = (companyItemOpts ?? []).map(o => ({
        value: String(o.value),
        label: o.label,
        unit: o.unit,
        item_weight: o.item_weight,
      }));
      const saved = rows
        .filter(r => r.item_id)
        .map(r => ({
          value: String(r.item_id),
          label: live.find(b => b.value === String(r.item_id))?.label ?? `Item #${r.item_id}`,
          unit: r.unit_name || '',
        }));
      const seen = new Set<string>();
      return [...saved, ...live].filter(o => !seen.has(o.value) && seen.add(o.value));
    }, [companyItemOpts, rows]);

    const mergedLotOptionsForItem = React.useCallback(
      (itemId: string | number) => {
        const live = (lotOptionsForItem?.(itemId) ?? []).map(o => ({
          value: String(o.value),
          label: o.label,
        }));
        const saved = rows
          .filter(r => String(r.item_id) === String(itemId) && r.lot_id)
          .map(r => ({
            value: String(r.lot_id),
            label: live.find(b => b.value === String(r.lot_id))?.label ?? `Lot #${r.lot_id}`,
          }));
        const seen = new Set<string>();
        return [...saved, ...live].filter(o => !seen.has(o.value) && seen.add(o.value));
      },
      [lotOptionsForItem, rows]
    );

    const getSelected = <T extends { value: string; label: string }>(
      opts: T[],
      value?: string | number | null
    ): T | null => {
      if (!value && value !== 0) return null;
      const key = String(value);
      return opts.find(o => o.value === key) || ({ value: key, label: `#${key}` } as T);
    };

    const tableColumns = [
      {
        header: owner === 'company' ? 'পণ্যের নাম' : 'Item',
        accessor: (row: ConsumedRow, idx: number) =>
          owner === 'party' ? (
            <>
              <RSInCell
                classNamePrefix="rs"
                options={mergedPartyOpts}
                value={getSelected(mergedPartyOpts, row.party_item_id)}
                onChange={(sel: any) => {
                  const value = sel?.value ?? '';
                  const selected = mergedPartyOpts.find(o => o.value === value);
                  const unit = selected?.unit_name || '';
                  const puk = selected?.per_unit_kg;
                  const qtyNum = parseFloat(String(row.qty || '0')) || 0;
                  const perKg = typeof puk === 'number' ? puk : unit.toLowerCase() === 'kg' ? 1 : undefined;
                  const nextWeight = qtyNum > 0 && perKg ? String((qtyNum * perKg).toFixed(3)) : row.weight || '';
                  onPatch(idx, { party_item_id: value, unit_name: unit, per_unit_kg: perKg, weight: nextWeight });
                }}
                placeholder="Select item…"
                isClearable
                styles={rsStyles as any}
              />
              {err(`consumed.${idx}.party_item_id`) && (
                <p className="text-xs text-red-500">{err(`consumed.${idx}.party_item_id`)}</p>
              )}
            </>
          ) : (
            <RSInCell
              classNamePrefix="rs"
              options={mergedCompanyItemOpts}
              value={getSelected(mergedCompanyItemOpts, row.item_id)}
              onChange={(sel: any) => onPatch(idx, { item_id: sel?.value ?? '', lot_id: '' })}
              placeholder="Item…"
              isClearable
              styles={rsStyles as any}
            />
          ),
      },
      owner === 'company' && {
        header: 'লট/ব্যাচ নং',
        accessor: (row: ConsumedRow, idx: number) => {
          const lotOpts = mergedLotOptionsForItem(row.item_id!);
          return (
            <RSInCell
              classNamePrefix="rs"
              options={lotOpts}
              value={getSelected(lotOpts, row.lot_id)}
              onChange={(sel: any) => onPatch(idx, { lot_id: sel?.value ?? '' })}
              placeholder="Lot…"
              isClearable
              isDisabled={!row.item_id}
              styles={rsStyles as any}
            />
          );
        },
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
              const perKg =
                typeof (row as any).per_unit_kg === 'number'
                  ? (row as any).per_unit_kg
                  : unitNm === 'kg'
                  ? 1
                  : undefined;
              const nextWeight =
                qtyNum > 0 && perKg ? String((qtyNum * perKg).toFixed(3)) : row.weight || '';
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
                const itm = companyItemOpts.find((o) => String(o.value) === String(row.item_id));
                const lot = itm?.lots?.find((l) => String(l.lot_id) === String(row.lot_id));
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
  }
);

export default ConsumedTable;
