import ActionFooter from '@/components/ActionFooter';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Company {
    company_name?: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    logo_thumb_url?: string;
}

interface ReturnItem {
    id: number;
    qty: number;
    price: number | string;
    subtotal: number | string;
    item?: {
        item_name: string;
        unit?: { name: string };
    };
}

interface PurchaseReturn {
    return_voucher_no: string;
    date: string;
    godown: { name: string };
    account_ledger: { account_ledger_name: string };
    reason?: string;
    creator?: { name: string };
    total_qty: number;
    return_items: ReturnItem[];
}

export default function PurchaseReturnInvoice({
    purchase_return,
    company,
}: {
    purchase_return: PurchaseReturn;
    company: Company;
}) {
    const totalAmount = purchase_return.return_items.reduce(
        (sum: number, item: ReturnItem) => sum + (parseFloat(item.subtotal as string) || 0),
        0
    );

    const handlePrint = () => window.print();

    return (
        <AppLayout>
            <Head title={`Purchase Return Invoice #${purchase_return.return_voucher_no}`} />

            <div className="container mx-auto bg-white p-8 shadow-md ">
                {/* Back link */}
                <Link href="/purchase-returns" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                    Back
                </Link>

                {/* Company heading */}
                <div className="mb-6 text-center print:text-xs">
                    {company?.logo_url && <img src={company?.logo_url} alt="Company Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />}
                    <h1 className="text-2xl font-bold uppercase">{company?.company_name ?? company?.name}</h1>
                    {company?.address && <div>{company?.address}</div>}
                    {company?.phone && <div>Phone: +88 {company?.phone}</div>}
                    {company?.email && <div>Email: {company?.email}</div>}

                    <h2 className="mt-3 text-xl font-semibold">Purchase Return Invoice</h2>
                </div>

                {/* Invoice meta */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <p>
                            <strong>Return Voucher:</strong> {purchase_return.return_voucher_no}
                        </p>
                        <p>
                            <strong>Godown:</strong> {purchase_return.godown.name}
                        </p>
                        <p>
                            <strong>Party:</strong> {purchase_return.account_ledger.account_ledger_name}
                        </p>
                        <p>
                            <strong>Reason:</strong> {purchase_return.reason || 'N/A'}
                        </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p>
                            <strong>Date:</strong> {purchase_return.date}
                        </p>
                        <p>
                            <strong>Prepared By:</strong> {purchase_return.creator?.name}
                        </p>
                        <p>
                            <strong>Prepared On:</strong> {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Return Items Table */}
                <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Product</th>
                                <th className="border px-3 py-2">Qty</th>
                                <th className="border px-3 py-2">Unit</th>
                                <th className="border px-3 py-2">Unit Price</th>
                                <th className="border px-3 py-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase_return.return_items.map((item, idx) => (
                                <tr key={item.id ?? idx}>
                                    <td className="border px-3 py-2 text-center">{idx + 1}</td>
                                    <td className="border px-3 py-2">{item.item?.item_name ?? 'N/A'}</td>
                                    <td className="border px-3 py-2">{item.qty}</td>
                                    <td className="border px-3 py-2">{item.item?.unit?.name ?? ''}</td>
                                    <td className="border px-3 py-2">{parseFloat(item.price as string).toFixed(2)} Tk</td>
                                    <td className="border px-3 py-2">{parseFloat(item.subtotal as string).toFixed(2)} Tk</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <p>
                            <strong>Total Qty:</strong> {purchase_return.total_qty}
                        </p>
                        <p>
                            <strong>Grand Total:</strong> {totalAmount.toFixed(2)} Tk
                        </p>
                    </div>
                    <div>{/* Optional: amount in words, remarks, etc. */}</div>
                </div>

                {/* Signatures */}
                <div className="mt-8 flex justify-between print:mt-16">
                    {['Received By', 'Verified By', 'Authorised Signatory'].map((t) => (
                        <div key={t} className="w-1/3 text-center">
                            <p>{t}</p>
                            <p className="mx-auto mt-2 w-1/2 border-t-2"></p>
                        </div>
                    ))}
                </div>

                {/* Action buttons (Back / Print) */}
                <ActionFooter
                    className="justify-center"
                    cancelHref="/purchase-returns"
                    cancelText="Back"
                    onSubmit={handlePrint}
                    submitText="Print Invoice"
                />
            </div>
        </AppLayout>
    );
}