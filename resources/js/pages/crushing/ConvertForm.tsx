/*  resources/js/pages/crushing/ConvertForm.tsx  */
import ConsumedTable from '@/components/crushing/ConsumedTable';
import GeneratedCompanyTable from '@/components/crushing/GeneratedCompanyTable';
import GeneratedPartyTable from '@/components/crushing/GeneratedPartyTable';
import type { ConsumedRow, GeneratedRow, Owner } from '@/components/crushing/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';
import Select from 'react-select';

type ProductionCostRow = { id: string; label: string; amount: number | '' };
type NewCosting = {
    market_rate: string | number | '';
    production_costs: ProductionCostRow[];
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
        // already in new shape
        return {
            market_rate: c.market_rate ?? '',
            production_costs: c.production_costs.map((r: any) => ({
                id: r.id ?? uid(),
                label: r.label ?? '',
                amount: r.amount ?? '',
            })),
        };
    }
    // legacy → migrate everything except market_rate into rows
    const rows: ProductionCostRow[] = Object.entries(c)
        .filter(([k]) => k !== 'market_rate')
        .map(([k, v]) => ({
            id: uid(),
            label: k.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()), // load_unload → Load Unload
            amount: v === undefined || v === null ? '' : Number(v),
        }));

    return {
        market_rate: c.market_rate ?? '',
        production_costs: rows,
    };
};

export default function ConvertForm({
    parties,
    godowns,
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
            const payload = {
                owner: data.owner,
                godown_id: Number(data.godown_id),
                consumed: data.consumed, // needs item_id/lot_id (company) OR party_item_id (party) + qty/weight
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

    const patchConsumed = (idx: number, patch: Partial<ConsumedRow>) =>
        setData(
            'consumed',
            data.consumed.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
        );

    const patchGenerated = (idx: number, patch: Partial<GeneratedRow>) => {
        setData(
            'generated',
            data.generated.map((r, i) => {
                // If this patch makes a row "main", clear it on all others
                if (patch.is_main === true) {
                    return { ...r, is_main: i === idx, ...(i === idx ? patch : {}) };
                }
                return i === idx ? { ...r, ...patch } : r;
            }),
        );
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
        lots: itm.lots,
    }));

    const lotOptionsForItem = (itemId: string | number) => {
        const itm = companyItemOpts.find((o) => o.value === Number(itemId));
        if (!itm) return [];
        return itm.lots.map((l: any) => ({ value: l.lot_id, label: `${l.lot_no} – ${l.stock_qty} ${itm.unit}` }));
    };

    const partyItemOptions = (partyId: string | number) => {
        if (data.owner === 'company') return [];
        const pId = String(partyId || '');
        const gId = String(data.godown_id || '');
        if (!pId || !gId) return [];
        if (!available_stock[pId] || !available_stock[pId][gId]) return [];
        const { items } = available_stock[pId][gId];
        return items.map((itm: any) => ({
            value: String(itm.party_item_id ?? itm.item_id),
            label: `${itm.item_name}  (in stock: ${itm.qty} ${itm.unit_name})`,
        }));
    };

    const consumedOpts = partyItemOptions(data.party_ledger_id);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.owner === 'company') {
            // ⬇️ use your actual route name for storeCompany()
            post(route('crushing.company.convert.store'), { onSuccess: () => reset() });
        } else {
            post(route('party-stock.transfer.store'), { onSuccess: () => reset() });
        }
    };

    // ⬅️ put these just above the `return (...)` in ConvertForm.tsx
    // const paddy = parseFloat(paddyTotalTk || '0');
    // const prod = productionCostTotal;
    // const byp = byProductTotal;
    // const netCost = paddy + prod - byp; // মোট খরচ
    // const mainKg = parseFloat(mainRow?.weight || '0');
    // const perKgPreview = mainKg > 0 ? netCost / mainKg : 0;

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

    return (
        <AppLayout>
            <Head title="Conversion / Transfer" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="mb-4">
                    <Link href={route('party-stock.transfer.index')} className="text-blue-600 hover:underline">
                        ← Back to list
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6">
                    <h1 className="mb-4 text-xl font-bold">পণ্য রূপান্তর (Crushing → Output)</h1>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Header grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* date */}
                            <div>
                                <label className="mb-1 block font-medium">তারিখ</label>
                                <input
                                    type="date"
                                    className="w-full rounded border p-2"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                            </div>

                            {/* owner */}
                            <div className="col-span-2 flex gap-6">
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
                                />
                                {errors.godown_id && <p className="text-xs text-red-500">{errors.godown_id}</p>}
                            </div>

                            {/* ref no */}
                            <div>
                                <label className="mb-1 block font-medium">রেফারেন্স</label>
                                <input readOnly className="w-full rounded border bg-gray-50 p-2" value={data.ref_no} />
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
                                />
                                {errors.dryer_id && <p className="text-xs text-red-500">{errors.dryer_id}</p>}
                            </div>
                        </div>

                        {/* Consumed */}
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

                        <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
                            {/* Header */}
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-semibold">দর নির্ধারণ</h3>
                                <span className="rounded-md bg-amber-50 px-2 py-1 text-[12px] font-medium text-black">
                                    ফর্মুলা: <b>(বেস চালমূল্য + প্রোডাকশন কস্ট − বাই-প্রোডাক্ট)</b> ÷ <b>মোট চাল (কেজি)</b>
                                </span>
                            </div>

                            {/* Compact stats row */}
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                {/* Paddy total */}
                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">ধানের মোট দাম (৳)</div>
                                    <div
                                        className={`mt-1 text-lg font-semibold tabular-nums ${
                                            flashPaddy ? 'animate-pulse rounded px-1 ring-2 ring-green-500' : ''
                                        }`}
                                        title="Consumed রেট থেকে অটো-ক্যালকুলেটেড"
                                    >
                                        {paddy.toFixed(2)}
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-500">
                                        মোট ধান: <b>{dhaanBostaCount > 0 ? dhaanBostaCount.toFixed(2) : '—'}</b> বস্তা
                                    </div>
                                </div>

                                {/* Ratio & base porta */}
                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">ধান→চাল রেশিও ও বেস দর</div>

                                    <div className="mt-1 text-sm tabular-nums">
                                        ধান→চাল রেশিও:{' '}
                                        <b className="rounded bg-emerald-50 px-1 text-emerald-700">
                                            {yieldKgPerBosta > 0 ? yieldKgPerBosta.toFixed(2) : '—'}
                                        </b>{' '}
                                        <span className="text-gray-600">কেজি/বস্তা</span>
                                    </div>

                                    <div className="mt-1 text-sm tabular-nums">
                                        বস্তা-পিছু ধানের দাম: <b>{costPerBosta.toFixed(2)}</b> <span className="text-gray-600">৳/বস্তা</span>
                                    </div>

                                    <div className="mt-1 text-sm tabular-nums">
                                        ভিত্তি দর (৳/কেজি):{' '}
                                        <b className="rounded bg-indigo-50 px-1 text-indigo-700">{basePerKg > 0 ? basePerKg.toFixed(2) : '—'}</b>{' '}
                                        <span className="text-gray-600">৳/কেজি</span>
                                    </div>
                                </div>

                                {/* Production cost */}
                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">প্রোডাকশন কস্ট (৳)</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">{prod.toFixed(2)}</div>
                                </div>

                                {/* By-product total */}
                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">বাই-প্রোডাক্ট (৳)</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">{byp.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Main kg & final preview */}
                            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">উৎপাদিত চাল (মেইন) – মোট ওজন</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">
                                        {mainKg || 0} <span className="text-sm">কেজি</span>
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-500">মেইন রো-তে weight দিন</div>
                                </div>

                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">বেস চালমূল্য (৳)</div>
                                    <div className="mt-1 text-lg font-semibold tabular-nums">{mainValue.toFixed(2)}</div>
                                    <div className="mt-1 text-[11px] text-gray-500">= ভিত্তি দর (৳/কেজি) × মোট চাল (কেজি)</div>
                                </div>

                                <div className="rounded-lg border bg-gray-50 p-3">
                                    <div className="text-[11px] text-gray-500">প্রতি কেজি (ফাইনাল প্রিভিউ)</div>
                                    <div className="mt-1 tabular-nums">
                                        <span className="text-sm text-gray-600">
                                            ({mainValue.toFixed(2)} + {prod.toFixed(2)} − {byp.toFixed(2)}) ÷ {mainKg || 0} ={' '}
                                        </span>
                                        <span className="rounded bg-emerald-50 px-2 py-[2px] text-lg font-semibold text-emerald-700">
                                            {mainKg > 0 ? perKgPreview.toFixed(2) : '—'}
                                        </span>
                                        <span className="text-sm text-gray-600"> ৳/কেজি</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={computePaddyTotal}
                                    className="rounded-sm bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                                    disabled={paddyBusy || !data.consumed.length || !data.godown_id}
                                    title="Consumed লাইন থেকে ধানের মোট দাম বের করবে"
                                >
                                    {paddyBusy ? 'হিসাব হচ্ছে…' : 'ধানের মোট দাম বের করুন'}
                                </button>

                                <button
                                    type="button"
                                    onClick={computeMainPerKg}
                                    className="rounded-sm bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
                                    disabled={mainIdx < 0}
                                    title="মেইন রো-তে প্রতি কেজির দর বসাবে"
                                >
                                    মেইন আইটেমে প্রতি কেজি সেট করুন
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 rounded border bg-slate-50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Production Cost</h3>
                                <button
                                    type="button"
                                    onClick={addCostRow}
                                    className="rounded bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700"
                                    title="Add row"
                                >
                                    + Add row
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(data.costing?.production_costs ?? []).map((row) => (
                                    <div key={row.id} className="grid grid-cols-12 items-end gap-3">
                                        <label className="col-span-6 block">
                                            <span className="mb-1 block text-sm">Header</span>
                                            <input
                                                type="text"
                                                className="w-full rounded border p-2"
                                                placeholder="e.g., Load–Unload"
                                                value={row.label}
                                                onChange={(e) => updateRow(row.id, { label: e.target.value })}
                                            />
                                        </label>

                                        <label className="col-span-4 block">
                                            <span className="mb-1 block text-sm">Costing (৳)</span>
                                            <input
                                                type="number"
                                                className="w-full rounded border p-2"
                                                placeholder="0.00"
                                                value={row.amount}
                                                onChange={(e) => updateRow(row.id, { amount: e.target.value === '' ? '' : Number(e.target.value) })}
                                            />
                                        </label>

                                        <div className="col-span-2">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="w-full rounded border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                title="Remove"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Market rate (optional) */}
                                {/* <label className="block">
                                    <span className="mb-1 block text-sm">Market rate (৳ / unit, optional)</span>
                                    <input
                                        type="number"
                                        className="w-full rounded border p-2"
                                        value={data.costing?.market_rate ?? ''}
                                        onChange={(e) =>
                                            setData('costing', {
                                                ...(data.costing ?? { production_costs: [] }),
                                                market_rate: e.target.value,
                                            })
                                        }
                                    />
                                </label> */}

                                {/* Total */}
                                <div className="mt-2 flex items-center justify-end">
                                    <div className="text-sm">
                                        <span className="font-medium">Total Production Cost:</span>{' '}
                                        <span>
                                            ৳ {totalProductionCost.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                {!running_job_id ? (
                                    <button
                                        type="button"
                                        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                                        disabled={processing || !data.dryer_id || !data.godown_id || data.consumed.length === 0}
                                        onClick={() => post(route('crushing.jobs.start'), { preserveScroll: true })}
                                    >
                                        Start
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="rounded bg-orange-600 px-4 py-2 text-white disabled:opacity-50"
                                        disabled={processing}
                                        onClick={() => post(route('crushing.jobs.stop', running_job_id), { preserveScroll: true })}
                                    >
                                        Stop
                                    </button>
                                )}

                                <button className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50" disabled={processing}>
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
