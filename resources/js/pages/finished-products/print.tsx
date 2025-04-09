import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface CompanySetting {
    company_name: string;
    address: string;
    mobile: string;
}

interface FinishedProductItem {
    id: number;
    quantity: number;
    unit_price: number;
    total: number;
    product: {
        item_name: string;
        unit: string;
    };
    godown: {
        name: string;
    };
}

interface FinishedProductData {
    id: number;
    production_date: string;
    production_voucher_no: string;
    reference_no: string;
    remarks: string;
    items: FinishedProductItem[];
    working_order: {
        voucher_no: string;
    };
}

interface Props {
    finishedProduct: FinishedProductData;
    company: CompanySetting;
    amountInWords: string; // ✅ include this!
}

const formatMoney = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? '—' : num.toFixed(2);
};

export default function Print({ finishedProduct, company, amountInWords }: Props) {
    useEffect(() => {
        window.print();
    }, []);
    const totalAmount = finishedProduct.items.reduce((acc, item) => acc + Number(item.total || 0), 0);
    const totalQty = finishedProduct.items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

    return (
        <div className="p-8 font-sans text-sm text-black">
            <Head title="Production Sheet" />
            {/* Company Info */}
            <div className="mb-4 text-center">
                <h1 className="text-xl font-bold uppercase">{company.company_name}</h1>
                <p>{company.address}</p>
                <p>Phone: {company.mobile}</p>
            </div>

            {/* Heading */}
            <div className="my-6 text-center text-lg font-semibold uppercase underline">Production Sheet</div>

            {/* Basic Info */}
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div>Ref/Batch: {finishedProduct.reference_no || 'N/A'}</div>
                <div className="text-right">Voucher No: {finishedProduct.production_voucher_no}</div>
                <div>Date: {finishedProduct.production_date}</div>
            </div>

            {/* Production Table */}
            <table className="mb-6 w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border px-2 py-1">Sl</th>
                        <th className="border px-2 py-1">Production Description</th>
                        <th className="border px-2 py-1">Qty</th>
                        <th className="border px-2 py-1">Per</th>
                        <th className="border px-2 py-1">Rate</th>
                        <th className="border px-2 py-1">Per</th>
                        <th className="border px-2 py-1">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {finishedProduct.items.map((item, index) => (
                        <tr key={item.id}>
                            <td className="border px-2 py-1">{index + 1}</td>
                            <td className="border px-2 py-1">{item.product.item_name}</td>
                            <td className="border px-2 py-1">{formatMoney(item.quantity)}</td>
                            <td className="border px-2 py-1">{item.product.unit}</td>
                            <td className="border px-2 py-1">{formatMoney(item.unit_price)}</td>
                            <td className="border px-2 py-1">{item.product.unit}</td>
                            <td className="border px-2 py-1 text-right">{formatMoney(item.total)}</td>
                        </tr>
                    ))}

                    {/* Totals */}
                    <tr className="font-semibold">
                        <td className="border px-2 py-1" colSpan={2}>
                            Total
                        </td>
                        <td className="border px-2 py-1">{formatMoney(totalQty)}</td>
                        <td className="border px-2 py-1"></td>
                        <td className="border px-2 py-1"></td>
                        <td className="border px-2 py-1"></td>
                        <td className="border px-2 py-1 text-right">{formatMoney(totalAmount)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div className="mb-4 font-semibold">
                Amount In Words: <span className="italic">{amountInWords}</span>
            </div>

            {/* Signature */}
            <div className="mt-12 pr-10 text-right">
                <p className="font-semibold">Authorised Signatory</p>
            </div>
        </div>
    );
}
