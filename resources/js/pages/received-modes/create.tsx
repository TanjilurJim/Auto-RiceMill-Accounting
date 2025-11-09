import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import React from 'react';

export default function Create() {
  const t = useTranslation();

  const { data, setData, post, processing, errors } = useForm({
    mode_name: '',
    phone_number: '',
    mode_kind: 'cash_in_hand' as 'cash_in_hand' | 'bank_account',
    opening_balance: '0',
    opening_date: new Date().toISOString().slice(0,10), // YYYY-MM-DD
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/received-modes'); // backend will auto-create ledger + opening
  };

  return (
    <AppLayout>
      <Head title={t('createReceivedModeTitle')} />

      <div className="h-full w-screen p-4 md:p-12 lg:w-full">
        <div className="h-full rounded-lg">
          <PageHeader title={t('createReceivedModeTitle')} addLinkHref="/received-modes" addLinkText={t('backText')} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow">
              <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">
                {t('modeInformationHeader')}
              </h2>

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
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    placeholder={t('modeNamePlaceholder')}
                  />
                  {errors.mode_name && <p className="mt-1 text-xs text-red-500">{errors.mode_name}</p>}
                </div>

                {/* Phone Number (optional) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('phoneNumberLabel')}
                  </label>
                  <input
                    type="text"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    placeholder={t('optionalPlaceholder')}
                  />
                  {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
                </div>

                {/* Mode Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Mode Type')}
                  </label>
                  <select
                    value={data.mode_kind}
                    onChange={(e) => setData('mode_kind', e.target.value as any)}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="cash_in_hand">{t('Cash in hand')}</option>
                    <option value="bank_account">{t('Bank account')}</option>
                  </select>
                  {errors.mode_kind && <p className="mt-1 text-xs text-red-500">{errors.mode_kind}</p>}
                </div>

                {/* Opening Balance */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Opening Balance')}
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={data.opening_balance}
                    onChange={(e) => setData('opening_balance', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    placeholder="0"
                  />
                  {errors.opening_balance && <p className="mt-1 text-xs text-red-500">{errors.opening_balance}</p>}
                </div>

                {/* Opening Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Opening Date')}
                  </label>
                  <input
                    type="date"
                    value={data.opening_date}
                    onChange={(e) => setData('opening_date', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  {errors.opening_date && <p className="mt-1 text-xs text-red-500">{errors.opening_date}</p>}
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
