import ActionFooter from '@/components/ActionFooter';
import { Link } from '@inertiajs/react';

interface Company {
    company_name?: string;
    name?: string; // fallback
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    logo_thumb_url?: string;
}

interface SaleItem {
    item: { item_name: string; unit?: { name: string } } | null;
    qty: number;
    main_price: number;
    subtotal: number;
}

export default function SaleInvoice({ sale, company }: { sale: any; company: any }) {
    const handlePrint = () => {
        window.print(); // Trigger the print dialog
    };

    return (
        <div className="container mx-auto bg-white p-8 shadow-md">
            {/* Header */}
            <Link href="/sales" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                Back
            </Link>

            {/* Company heading */}
            <div className="mb-6 text-center print:text-xs">
                {company?.logo_url && <img src={company?.logo_url} alt="Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />}

                <h1 className="text-2xl font-bold uppercase">{company?.company_name ?? company?.name}</h1>

                {company?.address && <div>{company?.address}</div>}
                {company?.phone && <div>Phone: +88 {company?.phone}</div>}
                {company?.email && <div>Email: {company?.email}</div>}

                <h2 className="mt-3 text-xl font-semibold">Sale Invoice</h2>
            </div>

            {/* Invoice Info */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                    <p>
                        <strong>Account:</strong> {sale.account_ledger.account_ledger_name}
                    </p>
                    <p>
                        <strong>Date:</strong> {sale.date}
                    </p>
                    <p>
                        <strong>Voucher No:</strong> {sale.voucher_no}
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Delivery To:</strong> {sale.delivered_to}
                    </p>
                </div>
            </div>

            {/* Item Details Table */}
            <div className="mb-6">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-2">SL</th>
                            <th className="border px-3 py-2">Description</th>
                            <th className="border px-3 py-2">Qty</th>
                            <th className="border px-3 py-2">Unit</th>
                            <th className="border px-3 py-2">Rate</th>
                            <th className="border px-3 py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.sale_items.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-3 py-2 text-center">{index + 1}</td>
                                <td className="border px-3 py-2">{item.item?.item_name || 'N/A'}</td>
                                <td className="border px-3 py-2">{item.qty}</td>
                                <td className="border px-3 py-2">{item.item?.unit?.name ?? ''}</td>

                                <td className="border px-3 py-2">{item.main_price}</td>
                                <td className="border px-3 py-2">{item.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                    <p>
                        <strong>Total Items:</strong> {sale.total_qty}
                    </p>
                    <p>
                        <strong>Grand Total:</strong> {sale.grand_total} Tk
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Amount in Words:</strong> {/* Convert the number to words here */}
                    </p>
                </div>
            </div>

            {/* Balance Information */}
            <div className="mb-6">
                <p>
                    <strong>Previous Balance:</strong> {/* Fetch from sale model if available */}
                </p>
                <p>
                    <strong>Current Balance:</strong> {sale.grand_total}
                </p>
                <p>
                    <strong>Closing Balance:</strong> {/* Calculate closing balance */}
                </p>
            </div>

            {/* Signatures */}
            <div className="mt-8 flex justify-between">
                <div className="text-center">
                    <p>Received By</p>
                    <p className="mx-auto mt-2 w-1/2 border-t-2"></p>
                </div>
                <div className="text-center">
                    <p>Verified By</p>
                    <p className="mx-auto mt-2 w-1/2 border-t-2"></p>
                </div>
                <div className="text-center">
                    <p>Authorized Signatory</p>
                    <p className="mx-auto mt-2 w-1/2 border-t-2"></p>
                </div>
            </div>

            {/* Print Button */}
            {/* <div className="text-center mt-8">
                <button onClick={handlePrint} className="rounded bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700">
                    Print Invoice
                </button>
            </div> */}
            <ActionFooter
                className="justify-center"
                cancelHref="/sales" // URL for the cancel/back action
                cancelText="Back" // Text for the cancel button
                onSubmit={handlePrint} // Function to handle the print action
                submitText="Print Invoice" // Text for the print button
            />
        </div>
    );
}
