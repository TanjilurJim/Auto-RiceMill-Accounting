import ActionFooter from '@/components/ActionFooter';
import InputCheckbox from '@/components/Btn&Link/InputCheckbox';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EditAccountLedger({
    ledger,
    accountGroups,
    groupUnders,
    isAdmin, // Receive isAdmin prop from the backend
}: {
    ledger: any;
    accountGroups: { id: number; name: string; nature?: { name: string } }[];
    groupUnders: { id: number; name: string }[];
    isAdmin: boolean; // Admin status passed from backend
}) {
    const { data, setData, put, processing, errors } = useForm({
        account_ledger_name: ledger.account_ledger_name || '',
        phone_number: ledger.phone_number || '',
        email: ledger.email || '',
        opening_balance: ledger.opening_balance || '',
        debit_credit: ledger.debit_credit || 'debit',
        status: ledger.status || 'active',
        account_group_input: ledger.group_under_id
            ? `group_under-${ledger.group_under_id}`
            : ledger.account_group_id
                ? `account_group-${ledger.account_group_id}`
                : '',
        address: ledger.address || '',
        for_transition_mode: ledger.for_transition_mode ? true : false,
        mark_for_user: ledger.mark_for_user ? true : false,
        reference_number: ledger.reference_number || '', // Include reference_number field
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data); // Inspect the data being sent
        put(`/account-ledgers/${ledger.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Account Ledger" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-4xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Edit Account Ledger</h1>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 space-y-4 rounded bg-white p-4 shadow md:grid-cols-2 dark:bg-neutral-900"
                    >
                        {/* Reference Number (Readonly for Non-admins) */}
                        <div>
                            <label className="mb-1 block font-medium">Reference Number</label>
                            <input
                                type="text"
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                disabled={!isAdmin} // Admins can edit, others cannot
                            />
                            {errors.reference_number && (
                                <p className="text-sm text-red-500">{errors.reference_number}</p>
                            )}
                        </div>

                        {/* Ledger Name */}
                        <div>
                            <label className="mb-1 block font-medium">Account Ledger Name*</label>
                            <input
                                type="text"
                                value={data.account_ledger_name}
                                onChange={(e) => setData('account_ledger_name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.account_ledger_name && (
                                <p className="text-sm text-red-500">{errors.account_ledger_name}</p>
                            )}
                        </div>

                        {/* Account Group Selector */}
                        <div>
                            <label className="mb-1 block font-medium">Group Under*</label>
                            <select
                                value={data.account_group_input}
                                onChange={(e) => setData('account_group_input', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">Select Group</option>

                                <optgroup label="Group Unders">
                                    {groupUnders.map((group) => (
                                        <option key={`gu-${group.id}`} value={`group_under-${group.id}`}>
                                            {group.name}
                                        </option>
                                    ))}
                                </optgroup>

                                <optgroup label="Account Groups">
                                    {accountGroups.map((group) => (
                                        <option key={`ag-${group.id}`} value={`account_group-${group.id}`}>
                                            {group.name} ({group.nature?.name})
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            {errors.account_group_input && (
                                <p className="text-sm text-red-500">{errors.account_group_input}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-1 block font-medium">Phone Number*</label>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1 block font-medium">E-mail</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Opening Balance */}
                        <div>
                            <label className="mb-1 block font-medium">Opening Balance*</label>
                            <input
                                type="number"
                                value={data.opening_balance}
                                onChange={(e) => setData('opening_balance', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.opening_balance && (
                                <p className="text-sm text-red-500">{errors.opening_balance}</p>
                            )}
                        </div>

                        {/* Debit/Credit */}
                        <div>
                            <label className="mb-1 block font-medium">Debit/Credit*</label>
                            <select
                                value={data.debit_credit}
                                onChange={(e) => setData('debit_credit', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </select>
                            {errors.debit_credit && <p className="text-sm text-red-500">{errors.debit_credit}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1 block font-medium">Status*</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-1 block font-medium">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        {/* Checkboxes */}
                        <div className="col-span-2 space-y-2">
                            <InputCheckbox
                                label="For Transition Mode"
                                checked={data.for_transition_mode}
                                onChange={(checked) => setData("for_transition_mode", checked)}
                            />
                            <InputCheckbox
                                label="Mark for User"
                                checked={data.mark_for_user}
                                onChange={(checked) => setData("mark_for_user", checked)}
                            />
                        </div>

                        {/* Buttons */}
                        {/* <div className="col-span-2 mt-4 flex justify-between">
                            <Link href="/account-ledgers" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <CancelLink href="/account-ledgers" />

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update'}
                            </button>
                            <Button processing={processing}>
                                {processing ? 'Updating...' : 'Update'}
                            </Button>
                        </div> */}
                        {/*Custom Action Buttons */}
                        <ActionFooter
                            className='w-full justify-end'
                            onSubmit={handleSubmit} // Function to handle form submission
                            cancelHref="/account-ledgers" // URL for the cancel action
                            processing={processing} // Indicates whether the form is processing
                            submitText={processing ? 'Updating...' : 'Update'} // Text for the submit button
                            cancelText="Cancel" // Text for the cancel button
                            // className="col-span-2 mt-4 flex justify-end gap-3" // Additional classes for styling
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
