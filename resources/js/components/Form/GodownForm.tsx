import React from 'react';
import ActionFooter from '@/components/ActionFooter';

interface GodownFormProps {
    data: {
        name: string;
        address: string;
    };
    setData: (key: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    submitText: string;
    cancelHref: string;
}

const GodownForm: React.FC<GodownFormProps> = ({
    data,
    setData,
    handleSubmit,
    processing,
    errors,
    submitText,
    cancelHref,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">
            {/* Godown Name */}
            <div>
                <label htmlFor="name" className="mb-1 block font-medium">
                    Godown Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder="Godown Name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="address" className="mb-1 block font-medium">
                    Description
                </label>
                <textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                    placeholder="Description"
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Action Footer */}
            <ActionFooter
                onSubmit={handleSubmit}
                cancelHref={cancelHref}
                processing={processing}
                submitText={submitText}
                cancelText="Cancel"
            />
        </form>
    );
};

export default GodownForm;