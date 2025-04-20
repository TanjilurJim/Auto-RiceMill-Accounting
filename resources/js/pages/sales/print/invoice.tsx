import { Head, Link } from '@inertiajs/react';

export default function SaleInvoice({ sale, company }: { sale: any; company: any }) {
    const handlePrint = () => {
        window.print(); // Trigger the print dialog
    };

    return (
        <div className="container mx-auto p-8 bg-white shadow-md">
            {/* Header */}
            <Link href="/sales" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                        Back
                    </Link>
            
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold uppercase">{company.name}</h1>
                <p className="text-lg">{company.address}</p>
                <p className="text-lg">+88 {company.phone}</p>
                <h2 className="text-xl font-semibold mt-3">Sale Invoice</h2>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p><strong>Account:</strong> {sale.account_ledger.account_ledger_name}</p>
                    <p><strong>Date:</strong> {sale.date}</p>
                    <p><strong>Voucher No:</strong> {sale.voucher_no}</p>
                </div>
                <div>
                    <p><strong>Delivery To:</strong> {sale.delivered_to}</p>
                </div>
            </div>

            {/* Item Details Table */}
            <div className="mb-6">
                <table className="w-full text-sm text-left border-collapse">
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
                                <td className="border px-3 py-2">{item.item?.unit}</td>
                                <td className="border px-3 py-2">{item.main_price}</td>
                                <td className="border px-3 py-2">{item.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p><strong>Total Items:</strong> {sale.total_qty}</p>
                    <p><strong>Grand Total:</strong> {sale.grand_total} Tk</p>
                </div>
                <div>
                    <p><strong>Amount in Words:</strong> {/* Convert the number to words here */}</p>
                </div>
            </div>

            {/* Balance Information */}
            <div className="mb-6">
                <p><strong>Previous Balance:</strong> {/* Fetch from sale model if available */}</p>
                <p><strong>Current Balance:</strong> {sale.grand_total}</p>
                <p><strong>Closing Balance:</strong> {/* Calculate closing balance */}</p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-8">
                <div className="text-center">
                    <p>Received By</p>
                    <p className="border-t-2 w-1/2 mx-auto mt-2"></p>
                </div>
                <div className="text-center">
                    <p>Verified By</p>
                    <p className="border-t-2 w-1/2 mx-auto mt-2"></p>
                </div>
                <div className="text-center">
                    <p>Authorized Signatory</p>
                    <p className="border-t-2 w-1/2 mx-auto mt-2"></p>
                </div>
            </div>

            {/* Print Button */}
            <div className="text-center mt-8">
                <button onClick={handlePrint} className="rounded bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700">
                    Print Invoice
                </button>
            </div>
        </div>
    );
}
