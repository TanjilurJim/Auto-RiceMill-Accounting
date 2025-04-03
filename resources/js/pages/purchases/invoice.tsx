import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

export default function Invoice({ purchase }: { purchase: PurchaseData }) {
    useEffect(() => {
        // Trigger print dialog as soon as the page loads
        if (window.print) {
            window.print();
        }
    }, []);

    return (
        <AppLayout>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                {/* Invoice Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">Invoice</h1>
                        <p className="text-sm text-gray-600">Voucher No: {purchase.voucher_no}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-semibold text-gray-800">{purchase.date}</p>
                        <p className="text-sm text-gray-600">Date</p>
                    </div>
                </div>

                {/* Seller and Buyer Info */}
                <div className="flex justify-between mb-8">
                    <div className="w-1/2">
                        <h2 className="text-lg font-semibold text-gray-700">Seller</h2>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-sm text-gray-600">Phone</p>
                    </div>
                    <div className="w-1/2 text-right">
                        <h2 className="text-lg font-semibold text-gray-700">Buyer</h2>
                        <p className="text-sm text-gray-600">Name: {purchase.delivered_to}</p>
                        <p className="text-sm text-gray-600">Address: {purchase.address}</p>
                        <p className="text-sm text-gray-600">Phone: {purchase.phone}</p>
                    </div>
                </div>

                {/* Table for Product List */}
                <div className="overflow-x-auto mb-8">
                    <table className="min-w-full text-sm table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600">Product</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600">Qty</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600">Unit Price</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600">Discount</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase.purchase_items?.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">{item.product_id}</td>
                                    <td className="px-4 py-2">{item.qty}</td>
                                    <td className="px-4 py-2">{item.price}</td>
                                    <td className="px-4 py-2">{item.discount}</td>
                                    <td className="px-4 py-2">{item.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end space-x-8 text-lg font-semibold text-gray-700">
                    <div className="w-1/3">
                        <div className="flex justify-between mb-2">
                            <span>Total Qty:</span>
                            <span>{purchase.total_qty}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Total Discount:</span>
                            <span>{purchase.total_discount}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-xl">Grand Total:</span>
                            <span className="text-xl">{purchase.grand_total}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-6 border-t pt-4 text-center text-sm text-gray-600">
                    <p>Thank you for your business!</p>
                    <p className="mt-2">Company Name | Address | Phone</p>
                </div>
            </div>
        </AppLayout>
    );
}
