// resources/js/pages/stock-moves/create.tsx
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

interface Godown {
    id: number;
    name: string;
}
interface Item {
    id: number;
    item_name: string;
}

interface AllProps {
    godowns: Godown[];
    items: Item[];
}

export default function StockMoveCreate({ godowns, items }: AllProps) {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        godown_id: '',
        lines: [{ item_id: '', lot_no: '', type: 'in', qty: '', unit_cost: '', reason: '' }] as LineInput[],
    });

    type LineInput = {
        item_id: string;
        lot_no: string;
        type: 'in' | 'out' | 'adjust';
        qty: string;
        unit_cost: string;
        reason: string;
    };

    /* helpers --------------------------------------------------------*/
    const addLine = () =>
        setData('lines', [
            ...data.lines,
            {
                item_id: '',
                lot_no: '',
                type: 'in',
                qty: '',
                unit_cost: '',
                reason: '',
            },
        ]);

    const removeLine = (idx: number) =>
        setData(
            'lines',
            data.lines.filter((_, i) => i !== idx),
        );

    const updateLine = (idx: number, key: keyof LineInput, value: any) =>
        setData(
            'lines',
            data.lines.map((l, i) => (i === idx ? { ...l, [key]: value } : l)),
        );

    /* submit ---------------------------------------------------------*/
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-moves', { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title={t('addStockTitle')} />
            <div className="bg-background h-full p-6">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('addStockHeader')} addLinkHref="/stock-moves" addLinkText={t('backButton')} />
                    <form onSubmit={handleSubmit} className="space-y-4 p-6">
                        <h1 className="text-xl font-semibold">{t('addStockFormTitle')}</h1>

                        <div className="bg-background space-y-4 rounded border p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Godown select */}
                                <div>
                                    <label className="mb-1 block font-medium">{t('godownSelectLabel')}</label>
                                    <Select value={data.godown_id} onValueChange={(v) => setData('godown_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('godownSelectPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {godowns.map((g) => (
                                                <SelectItem key={g.id} value={String(g.id)}>
                                                    {g.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.godown_id && <p className="text-xs text-red-600">{errors.godown_id}</p>}
                                </div>
                            </div>

                            {/* Lines table -----------------------------------*/}
                            <div className="space-y-2">
                                {data.lines.map((line, idx) => (
                                    <div key={idx} className="grid grid-cols-11 items-end gap-2">
                                        {/* Item */}
                                        <div className="col-span-3">
                                            <label className="mb-0.5 block text-xs">{t('itemSelectLabel')}</label>
                                            <select
                                                className="w-full rounded border p-1"
                                                value={line.item_id}
                                                onChange={(e) => updateLine(idx, 'item_id', e.target.value)}
                                            >
                                                <option value="">{t('itemSelectPlaceholder')}</option>
                                                {items?.map((i) => (
                                                    <option key={i.id} value={i.id}>
                                                        {i.item_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Lot */}
                                        <div className="col-span-2">
                                            <label className="mb-0.5 block text-xs">{t('lotLabel')}</label>
                                            <Input value={line.lot_no} onChange={(e) => updateLine(idx, 'lot_no', e.target.value)} />
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <label className="mb-0.5 block text-xs">{t('typeLabel')}</label>
                                            <select
                                                className="w-full rounded border p-1"
                                                value={line.type}
                                                onChange={(e) => updateLine(idx, 'type', e.target.value as any)}
                                            >
                                                <option value="in">{t('typeInOption')}</option>
                                                <option value="out">{t('typeOutOption')}</option>
                                                <option value="adjust">{t('typeAdjustOption')}</option>
                                            </select>
                                        </div>

                                        {/* Qty */}
                                        <div>
                                            <label className="mb-0.5 block text-xs">{t('qtyBostaLabel')}</label>
                                            <Input
                                                type="number"
                                                step="0.001"
                                                value={line.qty}
                                                onChange={(e) => updateLine(idx, 'qty', e.target.value)}
                                            />
                                        </div>

                                        {/* Cost */}
                                        <div>
                                            <label className="mb-0.5 block text-xs">{t('rateLabel')}</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={line.unit_cost}
                                                onChange={(e) => updateLine(idx, 'unit_cost', e.target.value)}
                                            />
                                        </div>

                                        {/* Reason */}
                                        <div className="col-span-2">
                                            <label className="mb-0.5 block text-xs">{t('reasonLabel')}</label>
                                            <Input value={line.reason} onChange={(e) => updateLine(idx, 'reason', e.target.value)} />
                                        </div>

                                        {/* remove btn */}
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(idx)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button type="button" variant="outline" onClick={addLine} className="mt-2">
                                    <Plus className="mr-1 h-4 w-4" /> {t('addLineButton')}
                                </Button>
                            </div>

                            <div className="pt-4">
                                <Button disabled={processing}>{t('saveStockMovesButton')}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
