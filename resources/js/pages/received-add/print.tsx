import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { amountToWords } from '@/utils/amountToWords';

interface Props {
  receivedAdd: {
    date: string;
    voucher_no: string;
    amount: number;
    received_mode: { mode_name: string };
    account_ledger: { account_ledger_name: string };
    description?: string;
  };
  company?: {
    name: string;
    address: string;
    phone: string;
  };
}

export default function Print({ receivedAdd, company }: Props) {

    useEffect(() => {
        window.print();
      }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB');

  return (
    <div className="p-6 text-sm font-serif text-black max-w-3xl mx-auto bg-white">
      <Head title="Print Received Voucher" />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">{company?.company_name || 'Company Name'}</h1>
        <p>{company?.company_address || 'Company Address'}</p>
        <p>Phone: {company?.mobile || '000-000-0000'}</p>
      </div>

      {/* Title */}
      <h2 className="text-center text-lg font-semibold underline mb-4">Received Voucher</h2>

      {/* Voucher Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p><strong>Voucher No:</strong> {receivedAdd.voucher_no}</p>
          <p><strong>Account Mode:</strong> {receivedAdd.received_mode?.mode_name}</p>
        </div>
        <div className="text-right">
          <p><strong>Date:</strong> {formatDate(receivedAdd.date)}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-collapse text-sm mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-1 text-left">Particulars</th>
            <th className="border px-3 py-1 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-1">{receivedAdd.account_ledger?.account_ledger_name}</td>
            <td className="border px-3 py-1 text-right">{Number(receivedAdd.amount).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Note */}
      <div className="mb-4">
        <p><strong>Note:</strong> {receivedAdd.description || '—'}</p>
      </div>

      {/* Totals */}
      <div className="text-right mb-2">
        <p className="text-base"><strong>Grand Total:</strong> {Number(receivedAdd.amount).toFixed(2)}</p>
        <p><strong>Amount in Words:</strong> {amountToWords(receivedAdd.amount)}</p> {/* Replace with dynamic word converter if needed */}
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-6 text-center pt-8 mt-8 text-sm">
        <p className="border-t pt-2">Received By</p>
        <p className="border-t pt-2">Verified By</p>
        <p className="border-t pt-2">Authorised Signatory</p>
      </div>
    </div>
  );
}
