// resources/js/pages/stock-moves/index.tsx
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

interface Move {
    id: number;
    created_at: string;
    godown: { id: number; name: string };
    item: { id: number; item_name: string };
    lot: { lot_no: string | null };
    type: 'in' | 'out' | 'adjust';
    qty: string;
    unit_cost?: string | null;
    reason?: string | null;
    creator: { name: string };
}

export default function StockMoveIndex({ moves }: { moves: Paginated<Move[]> }) {
    return (
        <AppLayout>
            <Head title="Stock Movements" />
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Stock Movements</h1>
                    <Link href="/stock-moves/create">
                        <Button>Add Stock</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 text-left font-medium">
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Godown</th>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Lot #</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Qty</th>
                                <th className="px-4 py-2">Cost</th>
                                <th className="px-4 py-2">Reason</th>
                                <th className="px-4 py-2">By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moves.data.map((m) => (
                                <tr key={m.id} className="border-b last:border-0">
                                    <td className="px-4 py-1">{m.created_at.slice(0, 10)}</td>
                                    <td className="px-4 py-1">{m.godown?.name}</td>
                                    <td className="px-4 py-1">{m.item?.item_name}</td>
                                    <td className="px-4 py-1">{m.lot?.lot_no ?? '—'}</td>
                                    <td className="px-4 py-1 capitalize">{m.type}</td>
                                    <td className="px-4 py-1 text-right">{m.qty}</td>
                                    <td className="px-4 py-1 text-right">{m.unit_cost ?? '—'}</td>
                                    <td className="px-4 py-1">{m.reason ?? '—'}</td>
                                    <td className="px-4 py-1">{m.creator?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* simple pager */}
                <div className="flex gap-2 justify-end">
                    {moves.links.map((link) => (
                        <Button
                            key={link.label}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
