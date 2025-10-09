import AccountLedgerForm from '@/components/Form/AccountLedgerForm';
import LedgerTypeCheatSheet from '@/components/LedgerTypeCheatSheet';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

type DataShape = {
    account_ledger_name: string;
    phone_number: string;
    email: string;
    opening_balance: string | number;
    ledger_type: string;
    debit_credit: string;
    status: 'active' | 'inactive';
    account_group_id: string | number;
    address: string;
    for_transition_mode: boolean;
    mark_for_user: boolean;
    reference_number: string;
    account_group_input?: string; // comes from the form’s select
};

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const bangladeshMobileRegex = /^0[0-9]{10}$/; // lenient, adjust if you want

// Frontend validator: only show user-friendly messages; match controller rules.
function validateForm(data: Partial<DataShape>, t: (key: string) => string) {
    const errs: Record<string, string> = {};

    // Required fields
    if (!data.account_ledger_name?.trim()) errs.account_ledger_name = t('pleaseEnterLedgerName');
    if (!data.ledger_type) errs.ledger_type = t('pleaseSelectLedgerType');
    if (!data.debit_credit) errs.debit_credit = t('pleaseChooseDebitCredit');
    if (!data.status) errs.status = t('pleaseSelectStatus');
    if (!data.account_group_input) errs.account_group_input = t('pleaseSelectAccountGroup');

    // Optional, but validate if provided
    if (data.email && !emailRegex.test(data.email)) errs.email = t('pleaseEnterValidEmail');
    if (data.phone_number && !bangladeshMobileRegex.test(data.phone_number)) {
        errs.phone_number = t('useValidBDMobile');
    }

    // Opening balance: optional; if provided, must be >= 0
    if (data.opening_balance !== '' && data.opening_balance !== undefined) {
        const n = Number(data.opening_balance);
        if (Number.isNaN(n)) errs.opening_balance = t('openingBalanceMustBeNumber');
        else if (n < 0) errs.opening_balance = t('openingBalanceCannotBeNegative');
    }

    // Account group input shape guard (matches controller expectation)
    if (data.account_group_input && !/^group_under-\d+$|^account_group-\d+$/.test(data.account_group_input)) {
        errs.account_group_input = t('invalidAccountGroupSelection');
    }

    return errs;
}

const scrollToFirstError = (errors: Record<string, string>) => {
    const firstField = Object.keys(errors)[0];
    if (firstField) {
        const el = document.querySelector(`[name="${firstField}"]`);
        if (el && (el as any).scrollIntoView) {
            (el as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus?.();
        }
    }
};

export default function CreateAccountLedger({
    groupUnders,
    accountGroups,
    isAdmin,
    reference_number,
}: {
    groupUnders: { id: number; name: string }[];
    accountGroups: { id: number; name: string; nature: { name: string } | null }[];
    isAdmin: boolean;
    reference_number: string;
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
    } = useForm<DataShape>({
        account_ledger_name: '',
        phone_number: '',
        email: '',
        opening_balance: '', // ← optional; we’ll default to 0 before submit
        ledger_type: '',
        debit_credit: '',
        status: 'active',
        account_group_id: '',
        address: '',
        for_transition_mode: false,
        mark_for_user: false,
        reference_number: reference_number,
    });

    // Local (client) errors that never hit the server
    const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({});
    const mergedErrors = { ...clientErrors, ...serverErrors };
    const t = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Sensible fallback if user didn’t pick a type
        if (!data.ledger_type) {
            setData('ledger_type', 'cash_bank');
            setData('debit_credit', 'debit');
        }

        // If opening balance empty, default to 0 (keeps UI simple, matches controller leniency)
        if (data.opening_balance === '' || data.opening_balance === undefined) {
            setData('opening_balance', 0);
        }

        // Run client validation
        const errs = validateForm(data, t);
        if (Object.keys(errs).length) {
            setClientErrors(errs);
            scrollToFirstError(errs);
            return;
        }
        setClientErrors({});

        // Proceed with Inertia post; keep errors human-friendly
        post('/account-ledgers', {
            onError: () => {
                // If the backend returns validation errors, scroll to the first
                scrollToFirstError({ ...serverErrors });
            },
        });
    };

    return (
        <AppLayout>
            <Head title={t('addAccountLedgerHeader')} />
            <div className="bg-background min-h-svh">
                <div className="p-4 md:p-12">
                    <PageHeader title={t('addAccountLedgerHeader')} addLinkHref="/account-ledgers" addLinkText={t('back')} />

                    <div className="mt-4 mb-2">
                        <LedgerTypeCheatSheet />
                    </div>

                    <AccountLedgerForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={mergedErrors}
                        groupUnders={groupUnders}
                        accountGroups={accountGroups}
                        isAdmin={isAdmin}
                        submitText={t('create')}
                        cancelHref="/account-ledgers"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
