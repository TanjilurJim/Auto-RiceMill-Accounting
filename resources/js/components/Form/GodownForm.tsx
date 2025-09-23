import ActionFooter from '@/components/ActionFooter';
import { useTranslation } from '@/components/useTranslation';
import React from 'react';

interface GodownFormProps {
    data: {
        name: string;
        address: string;
        khamal_count?: number | '';
    };
    setData: (key: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    submitText: string;
    cancelHref: string;
}

const GodownForm: React.FC<GodownFormProps> = ({ data, setData, handleSubmit, processing, errors, submitText, cancelHref }) => {
    const t = useTranslation();
    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded border bg-white p-4 shadow dark:bg-neutral-900">
            {/* Godown Name */}
            <div>
                <label htmlFor="name" className="mb-1 block font-medium">
                    {t('godownNameLabel')}
                </label>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('godownNamePlaceholder')}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
                <label htmlFor="khamal_count" className="mb-1 block font-medium">
                    {t('khamalCountLabel')} <span className="text-xs text-gray-500">{t('khamalCountOptional')}</span>
                </label>
                <input
                    type="number"
                    min={0}
                    id="khamal_count"
                    value={data.khamal_count ?? ''}
                    onChange={(e) => setData('khamal_count', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('khamalCountPlaceholder')}
                />
                {errors.khamal_count && <p className="mt-1 text-sm text-red-500">{errors.khamal_count}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="address" className="mb-1 block font-medium">
                    {t('descriptionLabel')}
                </label>
                <textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder={t('descriptionPlaceholder')}
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
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

export default GodownForm;
