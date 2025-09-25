import AppLayout from '@/layouts/app-layout';
import { AccountLedger, PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import React from 'react';

export default function Create() {
    const t = useTranslation();

    // Form data initialization
    const { data, setData, post, processing, errors } = useForm({
        mode_name: '',

        phone_number: '',
        ledger_id: '',
    });

    // Fetch available ledgers
    const { ledgers } = usePage<PageProps<{ ledgers: AccountLedger[] }>>().props;

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/received-modes');
    };

    return (
        <AppLayout>
            <Head title={t('createReceivedModeTitle')} />

            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg">
                    <PageHeader title={t('createReceivedModeTitle')} addLinkHref="/received-modes" addLinkText={t('backText')} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border bg-white p-6 shadow">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">{t('modeInformationHeader')}</h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Mode Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {t('modeNameLabel')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mode_name}
                                        onChange={(e) => setData('mode_name', e.target.value)}
                                        className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        placeholder={t('modeNamePlaceholder')}
                                    />
                                    {errors.mode_name && <p className="mt-1 text-xs text-red-500">{errors.mode_name}</p>}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">{t('phoneNumberLabel')}</label>
                                    <input
                                        type="text"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        placeholder={t('optionalPlaceholder')}
                                    />
                                    {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
                                </div>

                                {/* Ledger Selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">{t('ledgerLabel')}</label>
                                    <select
                                        value={data.ledger_id}
                                        onChange={(e) => setData('ledger_id', e.target.value)}
                                        // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        className="focus:ring-opacity-50 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    >
                                        <option value="">{t('selectLedgerOption')}</option>
                                        {ledgers.map((ledger) => (
                                            <option key={ledger.id} value={ledger.id}>
                                                {ledger.account_ledger_name} ({ledger.reference_number})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ledger_id && <p className="mt-1 text-xs text-red-500">{errors.ledger_id}</p>}
                                </div>
                            </div>
                        </div>

                        <ActionFooter
                            className="justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/received-modes"
                            processing={processing}
                            submitText={processing ? t('savingText') : t('saveReceivedModeText')}
                            cancelText={t('cancelText')}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
