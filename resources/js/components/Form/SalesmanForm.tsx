import ActionFooter from '@/components/ActionFooter';
import { useTranslation } from '@/components/useTranslation';
import React from 'react';

interface SalesmanFormProps {
    data: {
        name: string;
        phone_number: string;
        email?: string;
        address?: string;
    };
    setData: (key: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    submitText: string;
    cancelHref: string;
    salesmanCode?: string; // Optional for edit form
}

const SalesmanForm: React.FC<SalesmanFormProps> = ({ data, setData, handleSubmit, processing, errors, submitText, cancelHref, salesmanCode }) => {
    const t = useTranslation();

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-4 dark:bg-neutral-900">
            {/* Salesman Code (Readonly for Edit Form) */}
            {salesmanCode && (
                <div>
                    <label className="mb-1 block font-medium">{t('salesmanCodeLabel')}</label>
                    <input
                        type="text"
                        value={salesmanCode}
                        disabled
                        className="w-full rounded border bg-gray-100 p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    />
                </div>
            )}

            {/* Salesman Name */}
            <div>
                <label className="mb-1 block font-medium">{t('salesmanNameRequired')}</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('enterNamePlaceholder')}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
                <label className="mb-1 block font-medium">{t('phoneNumberRequired')}</label>
                <input
                    type="text"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('enterPhoneNumberPlaceholder')}
                />
                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="mb-1 block font-medium">{t('emailLabelForm')}</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('optionalEmailPlaceholder')}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
                <label className="mb-1 block font-medium">{t('addressLabel')}</label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('optionalAddressPlaceholder')}
                ></textarea>
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Action Footer */}
            <ActionFooter
                onSubmit={handleSubmit}
                cancelHref={cancelHref}
                processing={processing}
                submitText={submitText}
                cancelText={t('cancelText')}
            />
        </form>
    );
};

export default SalesmanForm;
