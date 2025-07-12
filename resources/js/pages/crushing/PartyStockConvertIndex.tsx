import ActionButtons from '@/components/ActionButtons';
import Pagination from '@/components/Pagination';
import { confirmDialog } from '@/components/confirmDialog';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/PageHeader';
import { Head, Link, router } from '@inertiajs/react';

export default function PartyStockConvertIndex({ conversions, pagination }) {
    /* ---------- delete helper ---------- */
    const handleDelete = (id: number) => {
        confirmDialog({ message: 'Are you sure you want to delete this conversion?' }, () => {
            router.delete(route('party-stock.transfer.destroy', id), { preserveScroll: true });
        });
    };

    return (
        <AppLayout>
            <Head title="Conversion Adjustment List" />
            <PageHeader title='' addLinkHref='/party-stock/convert' addLinkText='+ Add New' />

            <div className="p-6">
                {/* title bar */}
                <div className="rounded-t bg-purple-600 px-4 py-2 text-white">
                    <h1 className="text-lg font-semibold">Party Item Adjustment/Conversion List</h1>
                </div>

                {/* table */}
                <table className="mb-6 w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">#</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Ref No</th>
                            <th className="border p-2">Party Name</th>
                            <th className="border p-2">Consumed Qty</th>
                            <th className="border p-2">Consumed Unit</th>
                            <th className="border p-2">Generated Qty</th>
                            <th className="border p-2">Generated Unit</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {conversions.map((conv, idx) => {
                            /* split lines */
                            const consumed = conv.items.filter((i) => i.move_type === 'convert-out');
                            const generated = conv.items.filter((i) => i.move_type === 'convert-in');

                            const consumedQty = consumed.reduce((s, l) => s + (+l.qty || 0), 0);
                            const generatedQty = generated.reduce((s, l) => s + (+l.qty || 0), 0);

                            const consumedUnit = [...new Set(consumed.map((l) => l.unit_name).filter(Boolean))].join(', ') || '–';
                            const generatedUnit = [...new Set(generated.map((l) => l.unit_name).filter(Boolean))].join(', ') || '–';

                            return (
                                <tr key={idx}>
                                    <td className="border p-2 text-center">{idx + 1}</td>
                                    <td className="border p-2">{conv.date}</td>
                                    <td className="border p-2">{conv.ref_no}</td>
                                    <td className="border p-2">{conv.party_ledger_name}</td>

                                    <td className="border p-2 text-right">{consumedQty}</td>
                                    <td className="border p-2 text-center">{consumedUnit}</td>

                                    <td className="border p-2 text-right">{generatedQty}</td>
                                    <td className="border p-2 text-center">{generatedUnit}</td>

                                    <td className="border p-2 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={route('party-stock.transfer.show', conv.id)}
                                                className="inline-flex items-center rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
                                            >
                                                View
                                            </Link>

                                            <ActionButtons
                                                editHref={route('party-stock.transfer.edit', conv.id)}
                                                onDelete={() => handleDelete(conv.id)}
                                                editText="Edit"
                                                deleteText="Delete"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* pagination */}
                <Pagination links={pagination.links} currentPage={pagination.currentPage} lastPage={pagination.lastPage} total={pagination.total} />
            </div>
        </AppLayout>
    );
}
