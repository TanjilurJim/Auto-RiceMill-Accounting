import React from 'react';
import ActionFooter from '../ActionFooter';
import InputCheckbox from '../Btn&Link/InputCheckbox';

interface AccountLedgerFormProps {
    accountGroups: { id: number; name: string; nature?: { name: string } | null }[]; // Allow null for nature
    groupUnders: { id: number; name: string }[];
    data: any;
    setData: (key: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    isAdmin?: boolean;
    submitText: string;
    cancelHref: string;
}

// top of AccountLedgerForm.tsx
const LEDGER_TYPES = [
    { value: 'accounts_receivable', label: 'Customer (Accounts Receivable)', nature: 'asset', defaultDc: 'debit' },
    { value: 'accounts_payable', label: 'Supplier (Accounts Payable)', nature: 'liability', defaultDc: 'credit' },
    { value: 'cash_bank', label: 'Cash / Bank', nature: 'asset', defaultDc: 'debit' },
    { value: 'inventory', label: 'Inventory', nature: 'asset', defaultDc: 'debit' },
    { value: 'sales_income', label: 'Sales Income', nature: 'income', defaultDc: 'credit' },
    { value: 'other_income', label: 'Other Income', nature: 'income', defaultDc: 'credit' },
    { value: 'cogs', label: 'COGS (Cost of Goods Sold)', nature: 'expense', defaultDc: 'debit' },
    { value: 'operating_expense', label: 'Operating Expense', nature: 'expense', defaultDc: 'debit' },
    { value: 'liability', label: 'Liability (General)', nature: 'liability', defaultDc: 'credit' },
    { value: 'equity', label: 'Equity / Capital', nature: 'equity', defaultDc: 'credit' },
] as const;

function applyTypePreset(nextType: string, setData: (k: string, v: any) => void) {
    const meta = LEDGER_TYPES.find((t) => t.value === nextType);
    if (!meta) return;
    setData('ledger_type', nextType);
    setData('account_nature', meta.nature); // optional: store for reporting
    setData('debit_credit', meta.defaultDc); // sane default
}

const AccountLedgerForm: React.FC<AccountLedgerFormProps> = ({
    data,
    setData,
    handleSubmit,
    processing,
    errors,
    groupUnders,
    accountGroups,
    isAdmin = false,
    submitText,
    cancelHref,
}) => {
    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 rounded border bg-white p-4 shadow md:grid-cols-2 lg:grid-cols-2 dark:bg-neutral-900"
        >
            {/* Reference Number (Readonly for Non-admins) */}
            {isAdmin && (
                <div className="col-span-1">
                    <label className="mb-1 block font-medium">Reference Number</label>
                    <input
                        type="text"
                        value={data.reference_number}
                        onChange={(e) => setData('reference_number', e.target.value)}
                        className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                        disabled={!isAdmin}
                    />
                    {errors.reference_number && <p className="text-sm text-red-500">{errors.reference_number}</p>}
                </div>
            )}

            {/* Account Ledger Name */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium">Account Ledger Name*</label>
                <input
                    type="text"
                    value={data.account_ledger_name}
                    onChange={(e) => setData('account_ledger_name', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                />
                {errors.account_ledger_name && <p className="text-sm text-red-500">{errors.account_ledger_name}</p>}
            </div>

            {/* Ledger Type */}
            {/* Ledger Type (updated) */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium">Ledger Type</label>
                <select
                    value={data.ledger_type || ''}
                    onChange={(e) => applyTypePreset(e.target.value, setData)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    disabled={data.mark_for_user === true} // lock when customer
                >
                    <optgroup label="Assets">
                        <option value="accounts_receivable">Customer (Accounts Receivable)</option>
                        <option value="cash_bank">Cash / Bank</option>
                        <option value="inventory">Inventory</option>
                    </optgroup>
                    <optgroup label="Liabilities & Equity">
                        <option value="accounts_payable">Supplier (Accounts Payable)</option>
                        <option value="liability">Liability (General)</option>
                        <option value="equity">Equity / Capital</option>
                    </optgroup>
                    <optgroup label="Income">
                        <option value="sales_income">Sales Income</option>
                        <option value="other_income">Other Income</option>
                    </optgroup>
                    <optgroup label="Expenses">
                        <option value="cogs">COGS (Cost of Goods Sold)</option>
                        <option value="operating_expense">Operating Expense</option>
                    </optgroup>
                </select>
                {errors.ledger_type && <p className="text-sm text-red-500">{errors.ledger_type}</p>}
            </div>

            {/* Account Group */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium">Account Group*</label>
                <select
                    value={data.account_group_input}
                    onChange={(e) => setData('account_group_input', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                >
                    <option value="">Select Account Group</option>
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
                                {group.name} {group.nature?.name ? `(${group.nature.name})` : ''}
                            </option>
                        ))}
                    </optgroup>
                </select>
                {errors.account_group_input && <p className="text-sm text-red-500">{errors.account_group_input}</p>}
            </div>

            {/* Phone Number */}
            <div className="col-span-1">
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
            <div className="col-span-1">
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
            <div className="col-span-1">
                <label className="mb-1 block font-medium">Opening Balance*</label>
                <input
                    type="number"
                    value={data.opening_balance}
                    onChange={(e) => setData('opening_balance', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                />
                {errors.opening_balance && <p className="text-sm text-red-500">{errors.opening_balance}</p>}
            </div>

            {/* Debit/Credit */}
            <div className="col-span-1">
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
            <div className="col-span-1">
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
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="mb-1 block font-medium">Address</label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Checkboxes */}
            <div className="col-span-1 flex flex-col gap-2 md:col-span-2 lg:col-span-3">
                <InputCheckbox
                    label="Mark for customer"
                    checked={data.mark_for_user}
                    onChange={(checked) => {
                        setData('mark_for_user', checked);
                        if (checked) {
                            applyTypePreset('accounts_receivable', setData); // force A/R
                        }
                    }}
                />
            </div>

            {/* Action Footer */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <ActionFooter onSubmit={handleSubmit} cancelHref={cancelHref} processing={processing} submitText={submitText} cancelText="Cancel" />
            </div>
        </form>
    );
};

export default AccountLedgerForm;
