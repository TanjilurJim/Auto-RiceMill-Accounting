import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import ActionFooter from '@/components/ActionFooter';

export default function JournalPrint(props: any) {
    const { company, journal } = props;

    useEffect(() => {
        window.print();
    }, []);

    const logo = company?.logo_url ?? company?.logo_thumb_url;
    const debits = journal.entries.filter((e: any) => e.type === 'debit');
    const credits = journal.entries.filter((e: any) => e.type === 'credit');
    const totalDebit = debits.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
    const totalCredit = credits.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);

    return (
        <div className="max-w-full bg-white p-6 print:p-0">
            <Head title={`Journal Voucher ${journal.voucher_no}`} />

            {/* Back button (screen-only) */}
            <div className="mb-4 print:hidden">
                <button
                    onClick={() => history.back()}
                    className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400"
                >
                    ← Back
                </button>
            </div>

            {/* Company header */}
            <div className="mb-6 text-center print:text-xs">
                {logo && <img src={logo} alt="logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />}
                <h1 className="text-2xl font-bold uppercase">{company?.company_name}</h1>
                {company?.address && <p>{company?.address}</p>}
                {company?.phone && <p>Phone: {company?.phone}</p>}
            </div>

            <div className="text-center underline font-semibold">JOURNAL VOUCHER</div>

            {/* Voucher meta */}
            <div className="mb-4 flex justify-between text-sm">
                <div>
                    <p><strong>Date:</strong> {journal.date}</p>
                    <p><strong>Voucher No:</strong> {journal.voucher_no}</p>
                    {journal.entries[0]?.note && (
                        <p className="mb-2 text-sm"><strong>Description:</strong> {journal.entries[0].note}</p>
                    )}
                </div>
            </div>

            {/* Entries table */}
            <table className="mb-4 w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-1 text-left">Type</th>
                        <th className="border px-3 py-1 text-left">Ledger</th>
                        <th className="border px-3 py-1 text-right">Amount</th>
                        <th className="border px-3 py-1 text-left">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {journal.entries.map((entry: any, idx: number) => (
                        <tr key={idx}>
                            <td className="border px-3 py-1 capitalize">{entry.type}</td>
                            <td className="border px-3 py-1">{entry.ledger?.account_ledger_name ?? '—'}</td>
                            <td className="border px-3 py-1 text-right">{parseFloat(entry.amount).toFixed(2)}</td>
                            <td className="border px-3 py-1">{entry.note ?? '—'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-semibold">
                        <td className="border px-3 py-1" colSpan={2}>Total Debit</td>
                        <td className="border px-3 py-1 text-right">{totalDebit.toFixed(2)}</td>
                        <td className="border px-3 py-1"></td>
                    </tr>
                    <tr className="font-semibold">
                        <td className="border px-3 py-1" colSpan={2}>Total Credit</td>
                        <td className="border px-3 py-1 text-right">{totalCredit.toFixed(2)}</td>
                        <td className="border px-3 py-1"></td>
                    </tr>
                </tfoot>
            </table>

            {/* In-words + note */}
            {journal.amount_in_words && (
                <p className="mb-2 text-sm"><strong>In Words:</strong> {journal.amount_in_words}</p>
            )}
            {journal.entries[0]?.note && (
                <p className="mb-2 text-sm"><strong>Description:</strong> {journal.entries[0].note}</p>
            )}

            {/* Signatures */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center text-sm">
                {['Prepared By', 'Verified By', 'Authorised Signatory'].map((t) => (
                    <p key={t} className="border-t pt-2">{t}</p>
                ))}
            </div>

            {/* Action buttons (screen-only) */}
            <ActionFooter
                className="justify-center print:hidden"
                cancelHref="/journal-add"
                cancelText="Back"
                onSubmit={() => window.print()}
                submitText="Print"
            />
        </div>
    );
}