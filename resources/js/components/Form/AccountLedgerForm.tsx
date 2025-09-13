import React from 'react';
import ActionFooter from '../ActionFooter';
import InputCheckbox from '../Btn&Link/InputCheckbox';

interface AccountLedgerFormProps {
  accountGroups: { id: number; name: string; nature?: { name: string } | null }[];
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
  setData('account_nature', meta.nature);
  setData('debit_credit', meta.defaultDc);
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
  const hasAnyError = Object.keys(errors || {}).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded border bg-white p-4 shadow md:grid-cols-2 lg:grid-cols-2 dark:bg-neutral-900"
      noValidate
    >
      {/* Friendly banner */}
      {hasAnyError && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          Please fix the highlighted fields below.
        </div>
      )}

      {/* Reference Number (Readonly for Non-admins) */}
      {isAdmin && (
        <div className="col-span-1">
          <label className="mb-1 block font-medium" htmlFor="reference_number">Reference Number</label>
          <input
            id="reference_number"
            name="reference_number"
            type="text"
            value={data.reference_number}
            onChange={(e) => setData('reference_number', e.target.value)}
            className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
            disabled={!isAdmin}
            aria-invalid={!!errors.reference_number}
          />
          {errors.reference_number && <p className="text-sm text-red-500">{errors.reference_number}</p>}
        </div>
      )}

      {/* Account Ledger Name (required) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="account_ledger_name">Account Ledger Name*</label>
        <input
          id="account_ledger_name"
          name="account_ledger_name"
          type="text"
          value={data.account_ledger_name}
          onChange={(e) => setData('account_ledger_name', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          required
          aria-invalid={!!errors.account_ledger_name}
        />
        {errors.account_ledger_name && <p className="text-sm text-red-500">{errors.account_ledger_name}</p>}
      </div>

      {/* Ledger Type (required, placeholder added) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="ledger_type">Ledger Type*</label>
        <select
          id="ledger_type"
          name="ledger_type"
          value={data.ledger_type || ''}
          onChange={(e) => applyTypePreset(e.target.value, setData)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          disabled={data.mark_for_user === true}
          required
          aria-invalid={!!errors.ledger_type}
        >
          <option value="">Select a ledger type…</option>
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

      {/* Account Group (required) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="account_group_input">Account Group*</label>
        <select
          id="account_group_input"
          name="account_group_input"
          value={data.account_group_input || ''}
          onChange={(e) => setData('account_group_input', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          required
          aria-invalid={!!errors.account_group_input}
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

      {/* Phone Number (optional, validates if present) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="phone_number">Phone Number</label>
        <input
          id="phone_number"
          name="phone_number"
          type="text"
          value={data.phone_number}
          onChange={(e) => setData('phone_number', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          aria-invalid={!!errors.phone_number}
          placeholder="e.g., 01XXXXXXXXX"
        />
        {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
      </div>

      {/* Email (optional, validates if present) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          aria-invalid={!!errors.email}
          placeholder="name@example.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Opening Balance (optional – defaults to 0 if empty) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="opening_balance">Opening Balance</label>
        <input
          id="opening_balance"
          name="opening_balance"
          type="number"
          inputMode="decimal"
          value={data.opening_balance}
          onChange={(e) => setData('opening_balance', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          aria-invalid={!!errors.opening_balance}
          min={0}
          placeholder="0"
        />
        {errors.opening_balance && <p className="text-sm text-red-500">{errors.opening_balance}</p>}
      </div>

      {/* Debit/Credit (required, placeholder added) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="debit_credit">Debit/Credit*</label>
        <select
          id="debit_credit"
          name="debit_credit"
          value={data.debit_credit || ''}
          onChange={(e) => setData('debit_credit', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          required
          aria-invalid={!!errors.debit_credit}
        >
          <option value="">Select…</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
        {errors.debit_credit && <p className="text-sm text-red-500">{errors.debit_credit}</p>}
      </div>

      {/* Status (required) */}
      <div className="col-span-1">
        <label className="mb-1 block font-medium" htmlFor="status">Status*</label>
        <select
          id="status"
          name="status"
          value={data.status}
          onChange={(e) => setData('status', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          required
          aria-invalid={!!errors.status}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
      </div>

      {/* Address */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <label className="mb-1 block font-medium" htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={data.address}
          onChange={(e) => setData('address', e.target.value)}
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
          aria-invalid={!!errors.address}
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
            if (checked) applyTypePreset('accounts_receivable', setData);
          }}
        />
      </div>

      {/* Action Footer */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <ActionFooter
          onSubmit={handleSubmit}
          cancelHref={cancelHref}
          processing={processing}
          submitText={submitText}
          cancelText="Cancel"
        />
      </div>
    </form>
  );
};

export default AccountLedgerForm;
