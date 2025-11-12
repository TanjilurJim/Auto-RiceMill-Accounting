/*  resources/js/pages/crushing/ConvertForm.tsx  */
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import ConsumedTable from '@/components/crushing/ConsumedTable';
import CostingSection from '@/components/crushing/CostingSection';
import GeneratedCompanyTable from '@/components/crushing/GeneratedCompanyTable';
import GeneratedPartyTable from '@/components/crushing/GeneratedPartyTable';
import type { ConsumedRow, GeneratedRow, Owner } from '@/components/crushing/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect } from 'react';
import Select from 'react-select';

type Basis = 'per_bosta' | 'per_kg_main' | 'fixed';
type ProductionCostRow = {
    id: string;
    label: string;
    amount: number | '';
    // ⬇ optional metadata if the row came from a preset
    preset_id?: string;
    basis?: Basis;
    rate?: number;
};
type NewCosting = {
    market_rate: string | number | '';
    production_costs: ProductionCostRow[];
};

type PageProps = {
    available_stock: any; // tighten types if you have them
    preset?: any;
    // ...other props
};

type PartyItemOpt = {
    value: string;
    label: string;
    unit_name: string;
    per_unit_kg?: number; // <-- NEW
};

type CostingPreset = {
    id: string;
    label: string;
    rate: number;
    basis: Basis;
};

// simple id generator
const uid = () => Math.random().toString(36).slice(2, 10);
interface Party {
    id: number;
    account_ledger_name: string;
}
interface ItemLite {
    id: number;
    item_name: string;
    unit_id: number | null;
    unit?: { name: string };
}

interface Godown {
    id: number;
    name: string;
}
interface Unit {
    id: number;
    name: string;
}
interface Dryer {
    id: number;
    dryer_name: string;
    capacity: number | string;
}

interface Stock {
    [partyId: string]: {
        [godownId: string]: {
            godown_name: string;
            items: { party_item_id: number; item_name: string; qty: number; unit_name: string }[];
        };
    };
}

interface Props {
    parties: Party[];
    godowns: Godown[];
    costing_presets: CostingPreset[];
    units: Unit[];
    dryers: Dryer[]; // ✅ keep!
    today: string;
    generated_ref_no: string;
    available_stock: Stock;
    running_job_id?: number | null; // ✅ keep!
    items: ItemLite[];
    preset?: Partial<FormState> & { job_id?: number };
}

const defaultCosting: NewCosting = {
    market_rate: '',
    production_costs: [],
};

interface FormState {
    date: string;
    ref_no: string;
    owner: Owner;
    party_ledger_id: string | number;
    godown_id: string | number;
    dryer_id: string | number; // ✅ keep!
    consumed: ConsumedRow[];
    generated: GeneratedRow[];
    remarks: string;
    job_id?: number | string;
    costing: NewCosting;
}

// --- migrate legacy costing object (load_unload, bag_repair, ...) to new array shape ---
const normalizeCosting = (c: any | undefined): NewCosting => {
    if (!c) return { market_rate: '', production_costs: [] };
    if (Array.isArray(c.production_costs)) {
        return {
            market_rate: c.market_rate ?? '',
            production_costs: c.production_costs.map((r: any) => ({
                id: r.id ?? uid(),
                label: r.label ?? '',
                amount: r.amount ?? '',
                // preserve optional preset metadata if they exist
                preset_id: r.preset_id,
                basis: r.basis,
                rate: typeof r.rate === 'number' ? r.rate : r.rate ? Number(r.rate) : undefined,
            })),
        };
    }
    // legacy shape: turn keys into rows
    const rows: ProductionCostRow[] = Object.entries(c)
        .filter(([k]) => k !== 'market_rate')
        .map(([k, v]) => ({
            id: uid(),
            label: k.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
            amount: v === undefined || v === null ? '' : Number(v),
        }));

    return { market_rate: c.market_rate ?? '', production_costs: rows };
};

export default function ConvertForm({
    parties,
    godowns,
    costing_presets,
    units,
    dryers,
    today,
    generated_ref_no,
    available_stock,
    items,
    running_job_id,
    preset,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormState>({
        date: today,
        ref_no: generated_ref_no,
        owner: 'party',
        party_ledger_id: '',
        godown_id: '',
        dryer_id: '', //
        consumed: [{ party_item_id: '', item_id: '', lot_id: '', qty: '', unit_name: '', weight: '' } as any],
        generated: [{ id: uid(), item_name: '', qty: '', unit_name: '', weight: '', is_main: false, per_kg_rate: '', sale_value: '' }],
        remarks: '',
        job_id: '',
        costing: defaultCosting,
    });
    // --- job state flags (UI gating) ---
    const hasRunning = !!running_job_id; // there is a running job
    const hasStoppedJob = !!(preset && preset.job_id) && !hasRunning; // came from Stop redirect
    const canStart = !hasRunning && !hasStoppedJob;
    const canStop = hasRunning;
    const canSave = hasStoppedJob && !processing;

    const [paddyTotalTk, setPaddyTotalTk] = React.useState<string>('');
    const [flashMain, setFlashMain] = React.useState(false);
    const [paddyBusy, setPaddyBusy] = React.useState(false);
    const [flashPaddy, setFlashPaddy] = React.useState(false);
    // helpers
    const mainIdx = data.generated.findIndex((r) => r.is_main);
    const mainRow = mainIdx >= 0 ? data.generated[mainIdx] : undefined;

    const byProductTotal = data.generated.filter((r) => !r.is_main).reduce((sum, r) => sum + (parseFloat(r.sale_value || '0') || 0), 0);

    const productionCostTotal = (data.costing?.production_costs ?? []).reduce((sum, r) => {
        const n = typeof r.amount === 'string' ? parseFloat(r.amount) : r.amount;
        return sum + (isNaN(n as number) ? 0 : (n as number));
    }, 0);

    // --- Yield helpers (bosta & weights) ---
    const [dhanKgPerBosta, setDhanKgPerBosta] = React.useState<string>('75'); // typical default

    // 1) How many বস্তা ধান? (try to read from consumed.qty if unit is 'bosta')
    const dhaanBostaFromQty = React.useMemo(() => {
        return (data.consumed ?? []).reduce((sum, r) => {
            const u = (r.unit_name || '').toLowerCase().trim();
            const qty = parseFloat(r.qty || '0') || 0;
            return sum + (u === 'bosta' ? qty : 0);
        }, 0);
    }, [data.consumed]);

    // 2) Total consumed weight (kg) – if weight filled on lines
    const totalConsumedWeightKg = React.useMemo(() => {
        return (data.consumed ?? []).reduce((sum, r) => {
            const w = parseFloat((r as any).weight || '0') || 0;
            return sum + w;
        }, 0);
    }, [data.consumed]);

    // 3) Final bosta count: prefer explicit বস্তা qty; if absent, derive from weight ÷ kg/bosta
    const dhaanBostaCount = React.useMemo(() => {
        if (dhaanBostaFromQty > 0) return dhaanBostaFromQty;
        const kgPerBosta = parseFloat(dhanKgPerBosta || '0') || 0;
        if (kgPerBosta > 0 && totalConsumedWeightKg > 0) {
            return totalConsumedWeightKg / kgPerBosta;
        }
        return 0;
    }, [dhaanBostaFromQty, totalConsumedWeightKg, dhanKgPerBosta]);

    // --- compute paddy total from main row and production costs ---
    const computePaddyTotal = async () => {
        setPaddyBusy(true);
        try {
            const consumed = (data.consumed ?? []).map((r) => ({
                ...r,
                qty: r.qty === '' ? 0 : Number(r.qty),
                weight: (r as any).weight === '' ? 0 : Number((r as any).weight),
                item_id: r.item_id ? Number(r.item_id) : undefined,
                party_item_id: (r as any).party_item_id ? Number((r as any).party_item_id) : undefined,
                lot_id: r.lot_id ? Number(r.lot_id) : undefined,
            }));
            const payload = {
                owner: data.owner,
                godown_id: Number(data.godown_id),

                party_ledger_id: data.owner === 'party' ? Number(data.party_ledger_id || 0) : undefined,
                consumed,
            };
            const res = await axios.post(route('crushing.compute-paddy-total'), payload);
            const t = res.data?.total ?? 0;
            setPaddyTotalTk(String(Number(t).toFixed(2)));
            setFlashPaddy(true);
            setTimeout(() => setFlashPaddy(false), 1000);
        } finally {
            setPaddyBusy(false);
        }
    };

    const computeMainPerKg = () => {
        if (mainIdx < 0) return;

        const mainWeight = parseFloat(mainRow?.weight || '0'); // total চাল (kg)
        const paddyTotal = parseFloat(paddyTotalTk || '0'); // total ধান cost (all বস্তা)
        const bostaCount = dhaanBostaCount;

        if (!mainWeight || mainWeight <= 0) {
            alert('মেইন আইটেমের মোট কেজি (kg) দিন—এটা ছাড়া হিসাব হবে না।');
            return;
        }
        if (!bostaCount || bostaCount <= 0) {
            alert('ধানের মোট বস্তা সংখ্যা পাওয়া যায়নি। Consumed-এ unit=bosta দিয়ে qty দিন; না হলে নিচের kg/বস্তা দিয়ে weight থেকে বস্তা হিসাব করুন।');
            return;
        }

        // 1) ধানের বস্তা-পিছু খরচ
        const costPerBosta = paddyTotal / bostaCount; // tk / বস্তা ধান

        // 2) ধান→চাল yield: প্রতি বস্তা ধান থেকে আসল চাল (kg)
        const yieldKgPerBosta = mainWeight / bostaCount; // kg চাল / বস্তা ধান

        if (!yieldKgPerBosta || yieldKgPerBosta <= 0) {
            alert('Yield (kg/বস্তা) শূন্য পাওয়া গেছে। মেইন weight বা ধানের বস্তা সংখ্যা ঠিক করুন।');
            return;
        }

        // 3) Base porta (tk/kg) = ধানের বস্তা খরচ ÷ ওই বস্তা থেকে পাওয়া চাল (kg)
        const basePerKg = costPerBosta / yieldKgPerBosta; // tk / kg

        // 4) মোট চালের মূল্য (base porta × মোট চাল kg)
        const mainValue = basePerKg * mainWeight;

        // 5) ফাইনাল: (base চাল-মূল্য + প্রোডাকশন কস্ট − বাইপ্রোডাক্ট) ÷ চাল kg
        const netCost = mainValue + productionCostTotal - byProductTotal;
        const finalPerKg = netCost / mainWeight;

        // set & flash (value will persist; just a one-time highlight)
        patchGenerated(mainIdx, { per_kg_rate: finalPerKg.toFixed(2), _justComputed: true } as any);
    };

    // ConvertForm.tsx
    const patchConsumed = (idx: number, patch: Partial<ConsumedRow>) => {
        setData(
            'consumed',
            data.consumed.map((r, i) => {
                if (i !== idx) return r;
                let next: ConsumedRow = { ...r, ...patch };

                const changed = 'qty' in patch || 'unit_name' in patch || 'party_item_id' in patch;

                if (data.owner === 'party' && changed) {
                    const qtyNum = parseFloat(String(next.qty || '0')) || 0;
                    const unitNm = String(next.unit_name || '').toLowerCase();

                    let perKg = typeof next.per_unit_kg === 'number' ? next.per_unit_kg : unitNm === 'kg' ? 1 : undefined;

                    if (qtyNum > 0 && perKg) {
                        next.weight = String((qtyNum * perKg).toFixed(3));
                    }
                }

                // company recompute (your existing code) stays as-is
                if (data.owner === 'company' && changed) {
                    const itemId = Number(next.item_id || 0);
                    const lotId = Number(next.lot_id || 0);
                    const qtyNum = parseFloat(String(next.qty || '0')) || 0;
                    const unitNm = (next.unit_name || '').toLowerCase();
                    const itm = companyItemOpts.find((o) => o.value === itemId);
                    const lot = itm?.lots?.find((l: any) => Number(l.lot_id) === lotId);

                    let perUnitKg = 0;
                    if (unitNm === 'kg') perUnitKg = 1;
                    else if ((itm?.item_weight ?? 0) > 0) perUnitKg = Number(itm!.item_weight);
                    else if ((lot?.unit_weight ?? 0) > 0) perUnitKg = Number(lot!.unit_weight);

                    if (qtyNum > 0 && perUnitKg > 0) {
                        next.weight = String((qtyNum * perUnitKg).toFixed(3));
                    }
                }

                return next;
            }),
        );
    };

    const patchGenerated = (idx: number, patch: Partial<GeneratedRow>) => {
        setData(
            'generated',
            data.generated.map((r, i) => {
                // keep the "only one main" behavior
                if (patch.is_main === true) {
                    return { ...r, is_main: i === idx, ...(i === idx ? patch : {}) };
                }
                if (i !== idx) return r;

                let next = { ...r, ...patch };

                // If unit changed away from Bosta, clear bosta_weight (optional)
                if ('unit_name' in patch) {
                    const u = (patch.unit_name || '').toLowerCase();
                    if (u !== 'bosta') next.bosta_weight = '';
                }

                // ---- Auto compute WEIGHT (kg) ----
                const qtyNum = parseFloat(String(next.qty || '0')) || 0;
                const weightNum = parseFloat(String(next.weight || '0')) || 0;

                const unitNm = (next.unit_name || '').toLowerCase();
                const bw = parseFloat(String((next as any).bosta_weight || '0')) || 0;

                if (qtyNum > 0) {
                    if (unitNm === 'kg') {
                        next.weight = String(qtyNum.toFixed(3));
                    } else if (unitNm === 'bosta' && bw > 0) {
                        next.weight = String((qtyNum * bw).toFixed(3));
                    }
                }

                // ---- Auto compute BY-PRODUCT TOTAL (৳) = qty × per-unit rate ----
                const rate = parseFloat(String(next.byproduct_unit_rate || '0')) || 0;
                if (!next.is_main) {
                    if (weightNum > 0 && rate > 0) {
                        next.sale_value = (weightNum * rate).toFixed(2);
                    } else if ('byproduct_unit_rate' in patch || 'qty' in patch) {
                        // if user cleared qty or rate, clear total to avoid stale numbers
                        next.sale_value = '';
                    }
                }

                return next;
            }),
        );
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

    const unitMap = new Map(units.map((u) => [u.id, u.name]));
    const itemOptions = items.map((i) => ({
        value: i.id,
        label: i.item_name,
        unit_name: i.unit?.name ?? unitMap.get(i.unit_id) ?? '',
    }));
    const unitNameById = React.useMemo(() => new Map(units.map((u) => [u.id, u.name])), [units]);
    const allItemOpts = React.useMemo(
        () =>
            (items ?? []).map((i) => ({
                value: i.id,
                label: i.item_name,
                unit_name: i.unit?.name ?? (i.unit_id ? unitNameById.get(i.unit_id) : '') ?? '',
            })),
        [items, unitNameById],
    );

    const [lotStock, setLotStock] = React.useState<any[]>([]);
    const [stockBusy, setStockBusy] = React.useState(false);

    React.useEffect(() => {
        if (preset) {
            setData({
                date: preset.date ?? today,
                ref_no: preset.ref_no ?? generated_ref_no,
                owner: (preset.owner as Owner) ?? 'party',
                party_ledger_id: preset.party_ledger_id ?? '',
                godown_id: preset.godown_id ?? '',
                dryer_id: preset.dryer_id ?? '',
                consumed: (preset.consumed as any) ?? data.consumed,
                generated: (preset.generated as any) ?? data.generated,
                remarks: preset.remarks ?? '',
                job_id: preset.job_id ?? '',
                costing: normalizeCosting(preset.costing), // ⬅ include job_id
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (data.owner !== 'company' || !data.godown_id) {
            setLotStock([]);
            return;
        }
        setStockBusy(true);
        axios
            .get(route('godown.stocks-with-lots', data.godown_id))
            .then((res) => setLotStock(res.data))
            .finally(() => setStockBusy(false));
    }, [data.owner, data.godown_id]);

    // React.useEffect(() => {
    //     if (lotStock?.length) {
    //         console.log('lotStock payload →', lotStock);
    //     }
    // }, [lotStock]);

    const addLine = (sec: 'consumed' | 'generated') => {
        if (sec === 'generated') {
            const base = {
                id: uid(),
                item_name: '',
                qty: '',
                unit_name: '',
                weight: '',
                is_main: false,
                per_kg_rate: '',
                sale_value: '',
            } as GeneratedRow;

            if (data.owner === 'party') {
                setData('generated', [...data.generated, base]);
            } else {
                setData('generated', [...data.generated, { ...base, item_id: '', lot_no: '' }]);
            }
        } else {
            setData('consumed', [...data.consumed, { party_item_id: '', item_id: '', lot_id: '', qty: '', unit_name: '', weight: '' } as any]);
        }
    };

    const removeLine = (sec: 'consumed' | 'generated', idx: number) =>
        setData(
            sec,
            data[sec].filter((_, i) => i !== idx),
        );

    // --- Production Cost handlers (add inside component) ---
    const addCostRow = () => {
        const next = [...(data.costing?.production_costs ?? []), { id: uid(), label: '', amount: '' } as ProductionCostRow];
        setData('costing', { ...(data.costing ?? { market_rate: '' }), production_costs: next });
    };

    const updateRow = (id: string, patch: Partial<ProductionCostRow>) => {
        const next = (data.costing?.production_costs ?? []).map((r) => (r.id === id ? { ...r, ...patch } : r));
        setData('costing', { ...(data.costing ?? { market_rate: '' }), production_costs: next });
    };

    const removeRow = (id: string) => {
        const next = (data.costing?.production_costs ?? []).filter((r) => r.id !== id);
        setData('costing', { ...(data.costing ?? { market_rate: '' }), production_costs: next });
    };

    const totalProductionCost = (data.costing?.production_costs ?? []).reduce((sum, r) => {
        const n = typeof r.amount === 'string' ? parseFloat(r.amount) : r.amount;
        return sum + (isNaN(n as number) ? 0 : (n as number));
    }, 0);

    const companyItemOpts = lotStock.map((itm: any) => ({
        value: itm.id,
        label: itm.item_name,
        unit: itm.unit,
        item_weight: itm.item_weight ?? 0,
        lots: itm.lots,
    }));

    const lotOptionsForItem = (itemId: string | number) => {
        const itm = companyItemOpts.find((o) => o.value === Number(itemId));
        if (!itm) return [];
        return itm.lots.map((l: any) => ({
            value: l.lot_id,
            label: `${l.lot_no} – ${l.stock_qty} ${itm.unit}`,
            // carry meta so we can read unit_weight if you want inside the table as well
            ...l,
        }));
    };

    const partyItemOptions = (partyId: string | number): PartyItemOpt[] => {
        if (data.owner === 'company') return [];
        const pId = String(partyId || '');
        const gId = String(data.godown_id || '');
        if (!pId || !gId) return [];
        if (!available_stock[pId] || !available_stock[pId][gId]) return [];

        const { items } = available_stock[pId][gId];
        return items.map((itm: any) => ({
            value: String(itm.party_item_id ?? itm.item_id),
            label: `${itm.item_name}  (in stock: ${itm.qty} ${itm.unit_name})`,
            unit_name: itm.unit_name, // <-- include unit
            per_unit_kg: itm.per_unit_kg ?? (String(itm.unit_name).toLowerCase() === 'kg' ? 1 : undefined), // safe fallback
        }));
    };

    const consumedOpts = partyItemOptions(data.party_ledger_id);

    const partyGeneratedItemOpts = React.useMemo(() => {
        // reuse partyItemOptions which is already scoped to selected party+godown
        return partyItemOptions(data.party_ledger_id || '').map((o: PartyItemOpt) => ({
            value: String(o.value),
            label: String(o.label),
            unit_name: o.unit_name,
            per_unit_kg: o.per_unit_kg,
        }));
    }, [data.party_ledger_id, data.godown_id, available_stock]); // rebuild when party/godown/stock changes

    useEffect(() => {
        if (!__DEV__) return;
        console.log('[ConvertForm] consumedOpts:', consumedOpts);
    }, [consumedOpts]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return; // ⬅️ block save unless stopped state

        if (data.owner === 'company') {
            post(route('crushing.company.convert.store'), { onSuccess: () => reset() });
        } else {
            post(route('party-stock.transfer.store'), { onSuccess: () => reset() });
        }
    };

    // ---- Pricing preview (yield-based) ----
    const paddy = parseFloat(paddyTotalTk || '0'); // ধানের মোট দাম (৳)
    const mainKg = parseFloat(mainRow?.weight || '0'); // মোট উৎপাদিত চাল (kg)
    const prod = productionCostTotal; // প্রোডাকশন কস্ট
    const byp = byProductTotal; // বাই-প্রোডাক্ট মোট

    const yieldKgPerBosta =
        dhaanBostaCount > 0 && mainKg > 0
            ? mainKg / dhaanBostaCount // প্রতি বস্তায় পাওয়া চাল (kg)
            : 0;

    const costPerBosta =
        dhaanBostaCount > 0
            ? paddy / dhaanBostaCount // ধানের বস্তা-পিছু খরচ (৳/বস্তা)
            : 0;

    const basePerKg =
        yieldKgPerBosta > 0
            ? costPerBosta / yieldKgPerBosta // বেস পোর্টা (৳/kg) = বস্তা খরচ ÷ yield/kg
            : 0;

    const mainValue = basePerKg * (mainKg || 0); // চালের বেস মূল্য (৳)
    const netCost = mainValue + prod - byp; // মোট খরচ (৳)
    const perKgPreview = mainKg > 0 ? netCost / mainKg : 0; // ফাইনাল প্রিভিউ (৳/kg)

    // per-kg rate নিতে প্রথমে mainRow.per_kg_rate, না থাকলে preview
    const perKgFromMain = parseFloat(String(mainRow?.per_kg_rate ?? ''));
    const perKgToUse = Number.isFinite(perKgFromMain) && perKgFromMain > 0 ? perKgFromMain : perKgPreview;

    // টোটাল চালের মূল্য = perKgToUse × mainKg
    const totalByPerKg = mainKg > 0 ? perKgToUse * mainKg : 0;

    const __DEV__ = process.env.NODE_ENV !== 'production';

    useEffect(() => {
        if (!__DEV__) return;

        console.log('[ConvertForm] props.available_stock (raw):', available_stock);

        const pId = String(data.party_ledger_id || '');
        const gId = String(data.godown_id || '');
        const itemsForSelection = available_stock?.[pId]?.[gId]?.items || [];

        console.log('[ConvertForm] items for selected party+godown:', itemsForSelection);
        // If your controller had passed last_rate, you’d see it on each item here.
        // With your current controller, there is NO rate in page props – by design.
    }, [available_stock, data.party_ledger_id, data.godown_id]);

    return (
        <AppLayout>
            <Head title="Conversion / Transfer" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background rounded-lg">
                    <div className="flex items-center justify-between">
                        <h1 className="mb-4 text-xl font-bold">পণ্য রূপান্তর (Crushing → Output)</h1>
                        <Link href={route('party-stock.transfer.index')} className="text-blue-600 hover:underline">
                            ← Back to list
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Header grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* date */}
                            <div>
                                <InputCalendar label="তারিখ" value={data.date} onChange={(val) => setData('date', val)} required />
                                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                            </div>

                            {/* owner */}
                            <div className="flex gap-6 rounded-md border-b border-gray-300 p-1.5">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="company"
                                        checked={data.owner === 'company'}
                                        onChange={() => {
                                            setData('owner', 'company');
                                            setData('party_ledger_id', '');
                                        }}
                                    />
                                    আমার স্টক
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" value="party" checked={data.owner === 'party'} onChange={() => setData('owner', 'party')} />
                                    পার্টি স্টক
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* party (conditional) */}
                            {data.owner === 'party' && (
                                <div>
                                    <label className="mb-1 block font-medium">পার্টি</label>
                                    <Select
                                        classNamePrefix="rs"
                                        options={parties.map((p) => ({ value: p.id, label: p.account_ledger_name }))}
                                        value={parties
                                            .map((p) => ({ value: p.id, label: p.account_ledger_name }))
                                            .find((o) => o.value === Number(data.party_ledger_id))}
                                        onChange={(sel) => setData('party_ledger_id', sel?.value || '')}
                                        placeholder="পার্টি নির্বাচন…"
                                        isClearable
                                        styles={selectStyles}
                                    />
                                    {errors.party_ledger_id && <p className="text-xs text-red-500">{errors.party_ledger_id}</p>}
                                </div>
                            )}

                            {/* godown */}
                            <div>
                                <label className="mb-1 block font-medium">গুদাম (মিল)</label>
                                <Select
                                    classNamePrefix="rs"
                                    options={godowns.map((g) => ({ value: g.id, label: g.name }))}
                                    value={godowns.map((g) => ({ value: g.id, label: g.name })).find((o) => o.value === Number(data.godown_id))}
                                    onChange={(sel) => setData('godown_id', sel?.value || '')}
                                    placeholder="গুদাম নির্বাচন…"
                                    isClearable
                                    styles={selectStyles}
                                />
                                {errors.godown_id && <p className="text-xs text-red-500">{errors.godown_id}</p>}
                            </div>

                            {/* ref no */}
                            <div>
                                <label className="mb-1 block font-medium">রেফারেন্স</label>
                                <input readOnly className="bg-background w-full rounded border p-2" value={data.ref_no} />
                            </div>

                            {/* dryer — header-level, not per row */}
                            <div>
                                <label className="mb-1 block font-medium">ড্রায়ার</label>
                                <Select
                                    classNamePrefix="rs"
                                    options={dryers.map((d) => ({ value: d.id, label: `${d.dryer_name} (${d.capacity ?? '—'})` }))}
                                    value={dryers
                                        .map((d) => ({ value: d.id, label: `${d.dryer_name} (${d.capacity ?? '—'}) TON` }))
                                        .find((o) => o.value === Number(data.dryer_id))}
                                    onChange={(sel) => setData('dryer_id', sel?.value || '')}
                                    placeholder="ড্রায়ার নির্বাচন…"
                                    isClearable
                                    isDisabled={!data.godown_id}
                                    styles={selectStyles}
                                />
                                {errors.dryer_id && <p className="text-xs text-red-500">{errors.dryer_id}</p>}
                            </div>
                        </div>

                        {/* দর নির্ধারণ */}
                        <div className="bg-background mt-4 rounded-xl border p-4 shadow-sm">
                            {/* Header */}
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-foreground font-semibold">দর নির্ধারণ</h3>
                                <span className="bg-background text-foreground rounded-md px-2 py-1 text-[12px] font-medium">
                                    ফর্মুলা: <b>(বেস চালমূল্য + প্রোডাকশন কস্ট − বাই-প্রোডাক্ট)</b> ÷ <b>মোট চাল (কেজি)</b>
                                </span>
                            </div>

                            {/* Compact stats row */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                {/* Paddy total */}
                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-background text-[11px]">ধানের মোট দাম (৳)</div>
                                    <div
                                        className={`mt-1 text-lg font-semibold tabular-nums ${
                                            flashPaddy ? 'animate-pulse rounded px-1 ring-2 ring-green-500' : ''
                                        }`}
                                        title="Consumed রেট থেকে অটো-ক্যালকুলেটেড"
                                    >
                                        {paddy.toFixed(2)}
                                    </div>
                                    <div className="text-foreground mt-1 text-[11px]">
                                        মোট ধান: <b>{dhaanBostaCount > 0 ? dhaanBostaCount.toFixed(2) : '—'}</b> বস্তা
                                    </div>
                                </div>

                                {/* Ratio & base porta */}
                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-foreground text-[11px]">ধান→চাল রেশিও ও বেস দর</div>

                                    <div className="mt-1 text-sm tabular-nums">
                                        ধান→চাল রেশিও:{' '}
                                        <b className="bg-background rounded px-1 text-emerald-700">
                                            {yieldKgPerBosta > 0 ? yieldKgPerBosta.toFixed(2) : '—'}
                                        </b>{' '}
                                        <span className="text-foreground">কেজি/বস্তা</span>
                                    </div>

                                    <div className="mt-1 text-sm tabular-nums">
                                        বস্তা-পিছু ধানের দাম: <b>{costPerBosta.toFixed(2)}</b> <span className="text-foreground">৳/বস্তা</span>
                                    </div>

                                    <div className="mt-1 text-sm tabular-nums">
                                        ভিত্তি দর (৳/কেজি):{' '}
                                        <b className="rounded bg-indigo-50 px-1 text-indigo-700">{basePerKg > 0 ? basePerKg.toFixed(2) : '—'}</b>{' '}
                                        <span className="text-foreground">৳/কেজি</span>
                                    </div>
                                </div>

                                {/* Production cost */}
                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-[11px] text-gray-500">প্রোডাকশন কস্ট (৳)</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">{prod.toFixed(2)}</div>
                                </div>

                                {/* By-product total */}
                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-[11px] text-gray-500">বাই-প্রোডাক্ট (৳)</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">{byp.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Main kg & final preview */}
                            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-[11px] text-gray-500">উৎপাদিত চাল (মেইন) – মোট ওজন</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">
                                        {mainKg || 0} <span className="text-sm">কেজি</span>
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-500">মেইন রো-তে weight দিন</div>
                                </div>

                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-[11px] text-gray-500">বেস চালমূল্য (৳)</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">{mainValue.toFixed(2)}</div>
                                    <div className="mt-1 text-[11px] text-gray-500">= ভিত্তি দর (৳/কেজি) × মোট চাল (কেজি)</div>
                                </div>

                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-[11px] text-gray-500">প্রতি কেজি (ফাইনাল প্রিভিউ)</div>
                                    <div className="mt-1 tabular-nums">
                                        <span className="text-foreground text-sm">
                                            ({mainValue.toFixed(2)} + {prod.toFixed(2)} − {byp.toFixed(2)}) ÷ {mainKg || 0} ={' '}
                                        </span>
                                        <span className="rounded bg-emerald-50 px-2 py-[2px] text-lg font-semibold text-emerald-700">
                                            {mainKg > 0 ? perKgPreview.toFixed(2) : '—'}
                                        </span>
                                        <span className="text-foreground text-sm"> ৳/কেজি</span>
                                    </div>
                                </div>
                                <div className="bg-background rounded-lg border p-3">
                                    <div className="text-[11px] text-gray-500">টোটাল চালের মূল্য</div>
                                    <div className="mt-1 tabular-nums">
                                        <span className="text-foreground text-sm">
                                            {Number.isFinite(perKgToUse) && mainKg > 0 ? `${perKgToUse.toFixed(2)} × ${mainKg} = ` : '—'}
                                        </span>
                                        <span className="bg-background text-foreground rounded px-2 py-[2px] text-lg font-semibold">
                                            {mainKg > 0 ? totalByPerKg.toFixed(2) : '—'}
                                        </span>
                                        <span className="text-foreground text-sm"> টাকার চাল স্টকে ঢুকবে </span>
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-500">
                                        (পরতা × মোট ওজন)
                                        {Number.isFinite(perKgFromMain) && perKgFromMain > 0
                                            ? ' — মেইন রো-এর পরতা ব্যবহার করা হয়েছে'
                                            : ' — প্রিভিউ রেট ব্যবহৃত'}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-3 flex flex-col gap-2 md:flex-row md:justify-between lg:justify-start">
                                <div>
                                    <button
                                        type="button"
                                        onClick={computePaddyTotal}
                                        className="w-full rounded-sm bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                                        disabled={paddyBusy || !data.consumed.length || !data.godown_id}
                                        title="Consumed লাইন থেকে ধানের মোট দাম বের করবে"
                                    >
                                        {paddyBusy ? 'হিসাব হচ্ছে…' : 'ধানের মোট দাম বের করুন'}
                                    </button>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={computeMainPerKg}
                                        className="w-full rounded-sm bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
                                        disabled={mainIdx < 0}
                                        title="মেইন রো-তে প্রতি কেজির দর বসাবে"
                                    >
                                        মেইন আইটেমে প্রতি কেজি সেট করুন
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* প্রোডাকশন খরচ */}
                        <CostingSection
                            value={data.costing.production_costs}
                            presets={costing_presets}
                            dhaanBostaCount={dhaanBostaCount}
                            mainKg={parseFloat(mainRow?.weight || '0')}
                            onChange={(rows) => setData('costing', { ...(data.costing ?? { market_rate: '' }), production_costs: rows })}
                        />

                        {/* কনজিউমড পণ্য */}
                        <ConsumedTable
                            owner={data.owner}
                            rows={data.consumed}
                            units={units}
                            errors={errors as any}
                            consumedOptsForParty={consumedOpts}
                            companyItemOpts={companyItemOpts}
                            lotOptionsForItem={lotOptionsForItem}
                            onAdd={() => addLine('consumed')}
                            onRemove={(i) => removeLine('consumed', i)}
                            onPatch={patchConsumed}
                        />

                        {data.owner === 'party' ? (
                            <GeneratedPartyTable
                                rows={data.generated}
                                units={units}
                                errors={errors as any}
                                onAdd={() => addLine('generated')}
                                onRemove={(i) => removeLine('generated', i)}
                                onPatch={patchGenerated}
                                flashMain={flashMain}
                                partySelected={!!data.party_ledger_id}
                                partyItemOpts={partyGeneratedItemOpts} // <-- NEW prop
                            />
                        ) : (
                            <GeneratedCompanyTable
                                rows={data.generated}
                                units={units}
                                errors={errors as any}
                                allItemOpts={allItemOpts}
                                godownSelected={!!data.godown_id}
                                onAdd={() => addLine('generated')}
                                onRemove={(i) => removeLine('generated', i)}
                                onPatch={patchGenerated}
                                flashMain={flashMain}
                            />
                        )}
                        {/* Production Cost (preset‑aware) */}

                        {/* remarks + footer buttons */}
                        <div>
                            <label className="mt-6 block font-medium">মন্তব্য</label>
                            <textarea
                                className="w-full rounded border p-2"
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                {data.dryer_id &&
                                    (() => {
                                        const d = dryers.find((x) => x.id === Number(data.dryer_id));
                                        return d ? <span>Capacity: {d.capacity}</span> : null;
                                    })()}
                            </div>

                            <div className="space-x-2">
                                {/* Start vs Stop */}
                                {!hasRunning ? (
                                    <button
                                        type="button"
                                        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                                        disabled={
                                            !canStart || // ⬅️ disabled if a stopped job is awaiting save
                                            processing ||
                                            !data.dryer_id ||
                                            !data.godown_id ||
                                            data.consumed.length === 0
                                        }
                                        onClick={() => post(route('crushing.jobs.start'), { preserveScroll: true })}
                                    >
                                        Start
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="rounded bg-orange-600 px-4 py-2 text-white disabled:opacity-50"
                                        disabled={!canStop || processing}
                                        onClick={() => post(route('crushing.jobs.stop', running_job_id), { preserveScroll: true })}
                                    >
                                        Stop
                                    </button>
                                )}

                                {/* Save */}
                                <button className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50" disabled={!canSave}>
                                    {processing ? 'সেভ হচ্ছে…' : 'রূপান্তর সেভ করুন'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
