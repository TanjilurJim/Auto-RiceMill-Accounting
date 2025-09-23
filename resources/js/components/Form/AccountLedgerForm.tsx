import React from 'react';
import ActionFooter from '../ActionFooter';
import InputCheckbox from '../Btn&Link/InputCheckbox';
import { useTranslation } from '../useTranslation';

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

interface LedgerTypeMeta {
    value: string;
    label: string;
    nature: string;
    defaultDc: 'debit' | 'credit';
}

let LEDGER_TYPES: readonly LedgerTypeMeta[];

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
    const t = useTranslation();

    LEDGER_TYPES = [
        { value: 'accounts_receivable', label: t('formCustomerAccountsReceivable'), nature: 'asset', defaultDc: 'debit' },
        { value: 'accounts_payable', label: t('formSupplierAccountsPayable'), nature: 'liability', defaultDc: 'credit' },
        { value: 'cash_bank', label: t('formCashBank'), nature: 'asset', defaultDc: 'debit' },
        { value: 'inventory', label: t('formInventory'), nature: 'asset', defaultDc: 'debit' },
        { value: 'sales_income', label: t('formSalesIncome'), nature: 'income', defaultDc: 'credit' },
        { value: 'other_income', label: t('formOtherIncome'), nature: 'income', defaultDc: 'credit' },
        { value: 'cogs', label: t('formCogs'), nature: 'expense', defaultDc: 'debit' },
        { value: 'operating_expense', label: t('formOperatingExpense'), nature: 'expense', defaultDc: 'debit' },
        { value: 'liability', label: t('formLiabilityGeneral'), nature: 'liability', defaultDc: 'credit' },
        { value: 'equity', label: t('formEquityCapital'), nature: 'equity', defaultDc: 'credit' },
    ] as const;

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 rounded border bg-white p-4 shadow md:grid-cols-2 lg:grid-cols-2 dark:bg-neutral-900"
            noValidate
        >
            {/* Friendly banner */}
            {hasAnyError && (
                <div className="col-span-1 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 md:col-span-2 lg:col-span-3 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                    {t('pleaseFixFields')}
                </div>
            )}

            {/* Reference Number (Readonly for Non-admins) */}
            {isAdmin && (
                <div className="col-span-1">
                    <label className="mb-1 block font-medium" htmlFor="reference_number">
                        {t('referenceNumber')}
                    </label>
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
                <label className="mb-1 block font-medium" htmlFor="account_ledger_name">
                    {t('formAccountLedgerNameRequired')}
                </label>
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
                <label className="mb-1 block font-medium" htmlFor="ledger_type">
                    {t('formLedgerTypeRequired')}
                </label>
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
                    <option value="">{t('formSelectLedgerType')}</option>
                    <optgroup label={t('formAssets')}>
                        <option value="accounts_receivable">{t('formCustomerAccountsReceivable')}</option>
                        <option value="cash_bank">{t('formCashBank')}</option>
                        <option value="inventory">{t('formInventory')}</option>
                    </optgroup>
                    <optgroup label={t('formLiabilitiesEquity')}>
                        <option value="accounts_payable">{t('formSupplierAccountsPayable')}</option>
                        <option value="liability">{t('formLiabilityGeneral')}</option>
                        <option value="equity">{t('formEquityCapital')}</option>
                    </optgroup>
                    <optgroup label={t('formIncome')}>
                        <option value="sales_income">{t('formSalesIncome')}</option>
                        <option value="other_income">{t('formOtherIncome')}</option>
                    </optgroup>
                    <optgroup label={t('formExpenses')}>
                        <option value="cogs">{t('formCogs')}</option>
                        <option value="operating_expense">{t('formOperatingExpense')}</option>
                    </optgroup>
                </select>
                {errors.ledger_type && <p className="text-sm text-red-500">{errors.ledger_type}</p>}
            </div>

            {/* Account Group (required) */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium" htmlFor="account_group_input">
                    {t('formAccountGroupRequired')}
                </label>
                <select
                    id="account_group_input"
                    name="account_group_input"
                    value={data.account_group_input || ''}
                    onChange={(e) => setData('account_group_input', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    required
                    aria-invalid={!!errors.account_group_input}
                >
                    <option value="">{t('formSelectAccountGroup')}</option>
                    <optgroup label={t('formGroupUnders')}>
                        {groupUnders.map((group) => (
                            <option key={`gu-${group.id}`} value={`group_under-${group.id}`}>
                                {group.name}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label={t('formAccountGroupsLabel')}>
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
                <label className="mb-1 block font-medium" htmlFor="phone_number">
                    {t('formPhoneNumber')}
                </label>
                <input
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    aria-invalid={!!errors.phone_number}
                    placeholder={t('formPhonePlaceholder')}
                />
                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
            </div>

            {/* Email (optional, validates if present) */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium" htmlFor="email">
                    {t('formEmail')}
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    aria-invalid={!!errors.email}
                    placeholder={t('formEmailPlaceholder')}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Opening Balance (optional – defaults to 0 if empty) */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium" htmlFor="opening_balance">
                    {t('openingBalance')}
                </label>
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
                    placeholder={t('formOpeningBalancePlaceholder')}
                />
                {errors.opening_balance && <p className="text-sm text-red-500">{errors.opening_balance}</p>}
            </div>

            {/* Debit/Credit (required, placeholder added) */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium" htmlFor="debit_credit">
                    {t('formDebitCreditRequired')}
                </label>
                <select
                    id="debit_credit"
                    name="debit_credit"
                    value={data.debit_credit || ''}
                    onChange={(e) => setData('debit_credit', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    required
                    aria-invalid={!!errors.debit_credit}
                >
                    <option value="">{t('formSelectDebitCredit')}</option>
                    <option value="debit">{t('formDebit')}</option>
                    <option value="credit">{t('formCredit')}</option>
                </select>
                {errors.debit_credit && <p className="text-sm text-red-500">{errors.debit_credit}</p>}
            </div>

            {/* Status (required) */}
            <div className="col-span-1">
                <label className="mb-1 block font-medium" htmlFor="status">
                    {t('formStatusRequired')}
                </label>
                <select
                    id="status"
                    name="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    required
                    aria-invalid={!!errors.status}
                >
                    <option value="active">{t('formActiveStatus')}</option>
                    <option value="inactive">{t('formInactiveStatus')}</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="mb-1 block font-medium" htmlFor="address">
                    {t('formAddress')}
                </label>
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
                    label={t('formMarkForCustomer')}
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
                    cancelText={t('formCancel')}
                />
            </div>
        </form>
    );
};

export default AccountLedgerForm;
