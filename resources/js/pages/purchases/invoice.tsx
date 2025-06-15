// resources/js/pages/purchases/PurchaseInvoice.tsx
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

interface PurchaseItem {
    id: number;
    qty: number;
    price: number;
    discount: number;
    subtotal: number;
    item?: {
        // ← change “product” → “item”
        item_name: string;
        unit?: { name: string };
    };
}

interface Purchase {
    id: number;
    voucher_no: string;
    date: string; // ideally ISO string → format on server
    delivered_to: string; // e.g. supplier name
    total_qty: number;
    total_discount: number;
    grand_total: number;
    purchase_items: PurchaseItem[];
    // add previous_balance / current_balance if you track them
}

export default function PurchaseInvoice({ purchase, company }: { purchase: Purchase; company: Company }) {
    /** Optional: open print dialog automatically */
    // useEffect(() => window.print?.(), []);

    const handlePrint = () => window.print();

    return (
        <AppLayout>
            <Head title={`Purchase Invoice #${purchase.voucher_no}`} />

            <div className="container mx-auto bg-white p-8 shadow-md">
                {/* Back link */}
                <Link href="/purchases" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                    Back
                </Link>

                {/* Company heading */}
                {/* Company heading (with logo) */}
                <div className="mb-6 text-center print:text-xs">
                    {company?.logo_url && <img src={company.logo_url} alt="Company Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />}
                    <h1 className="text-2xl font-bold uppercase">{company?.company_name ?? company?.name}</h1>
                    {company?.address && <div>{company.address}</div>}
                    {company?.phone && <div>Phone: +88 {company.phone}</div>}
                    {company?.email && <div>Email: {company.email}</div>}

                    <h2 className="mt-3 text-xl font-semibold">Purchase Invoice</h2>
                </div>

                {/* Invoice meta */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <p>
                            <strong>Supplier:</strong> {purchase.delivered_to}
                        </p>
                        <p>
                            <strong>Date:</strong> {purchase.date}
                        </p>
                        <p>
                            <strong>Voucher No:</strong> {purchase.voucher_no}
                        </p>
                    </div>
                    <div>{/* Add any extra supplier / delivery info here */}</div>
                </div>

                {/* Items */}
                <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Description</th>
                                <th className="border px-3 py-2">Qty</th>
                                <th className="border px-3 py-2">Unit</th>
                                <th className="border px-3 py-2">Unit Price</th>
                                <th className="border px-3 py-2">Discount</th>
                                <th className="border px-3 py-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase.purchase_items.map((row, idx) => (
                                <tr key={row.id ?? idx}>
                                    <td className="border px-3 py-2 text-center">{idx + 1}</td>
                                    <td className="border px-3 py-2">{row.item?.item_name ?? 'N/A'}</td>
                                    <td className="border px-3 py-2">{row.qty}</td>
                                    <td className="border px-3 py-2">{row.item?.unit?.name ?? ''}</td>
                                    <td className="border px-3 py-2">{row.price}</td>
                                    <td className="border px-3 py-2">{row.discount}</td>
                                    <td className="border px-3 py-2">{row.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <p>
                            <strong>Total Items:</strong> {purchase.total_qty}
                        </p>
                        <p>
                            <strong>Total Discount:</strong> {purchase.total_discount} Tk
                        </p>
                        <p>
                            <strong>Grand Total:</strong> {purchase.grand_total} Tk
                        </p>
                    </div>
                    <div>{/* Optional: amount in words, balances, etc. */}</div>
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
                    cancelHref="/purchases"
                    cancelText="Back"
                    onSubmit={handlePrint}
                    submitText="Print Invoice"
                />
            </div>
        </AppLayout>
    );
}
