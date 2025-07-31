import ActionFooter from '@/components/ActionFooter';
import React, { FormEvent } from 'react';

interface Props {
    data: {
        dryer_name: string;
        dryer_type: string;
        capacity: string | number;
        batch_time: string | number;
        manufacturer: string;
        model_number: string;
        power_kw: string | number;
        fuel_type: string;
        length_mm: string | number;
        width_mm: string | number;
        height_mm: string | number;
    };
    setData: (key: string, value: any) => void;
    onSubmit: (e: FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    submitText?: string;
    cancelHref: string;
}

const Form: React.FC<Props> = ({ data, setData, onSubmit, processing, errors, submitText = 'Save', cancelHref }) => {
    const handleChange = (key: string, value: any) => setData(key, value);

    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded border bg-white p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Dryer Name (Required) */}
                <div>
                    <label htmlFor="dryer_name" className="mb-1 block font-medium">
                        Dryer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="dryer_name"
                        type="text"
                        value={data.dryer_name}
                        onChange={(e) => handleChange('dryer_name', e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                    {errors.dryer_name && <p className="text-sm text-red-500">{errors.dryer_name}</p>}
                </div>

                {/* Dryer Type (Optional) */}
                <div>
                    <label htmlFor="dryer_type" className="mb-1 block font-medium">
                        Dryer Type <span className="text-sm text-gray-500">(optional)</span>
                    </label>
                    <input
                        id="dryer_type"
                        type="text"
                        value={data.dryer_type}
                        onChange={(e) => handleChange('dryer_type', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.dryer_type && <p className="text-sm text-red-500">{errors.dryer_type}</p>}
                </div>

                {/* Capacity (Required) */}
                <div>
                    <label htmlFor="capacity" className="mb-1 block font-medium">
                        Capacity (tonnes) <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="capacity"
                        type="number"
                        value={data.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                    {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
                </div>

                {/* Batch Time (Optional) */}
                <div>
                    <label htmlFor="batch_time" className="mb-1 block font-medium">
                        Batch Time (minutes) <span className="text-sm text-gray-500">(optional)</span>
                    </label>
                    <input
                        id="batch_time"
                        type="number"
                        value={data.batch_time}
                        onChange={(e) => handleChange('batch_time', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.batch_time && <p className="text-sm text-red-500">{errors.batch_time}</p>}
                </div>
            </div>

            {/* Technical Specs */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                    { id: 'manufacturer', label: 'Manufacturer' },
                    { id: 'model_number', label: 'Model Number' },
                    { id: 'power_kw', label: 'Power (kW)', type: 'number' },
                    { id: 'fuel_type', label: 'Fuel Type' },
                ].map((field) => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="mb-1 block font-medium">
                            {field.label} <span className="text-sm text-gray-500">(optional)</span>
                        </label>
                        <input
                            id={field.id}
                            type={field.type || 'text'}
                            value={(data as any)[field.id]}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
                    </div>
                ))}
            </div>

            {/* Physical Dimensions */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                    { id: 'length_mm', label: 'Length (mm)' },
                    { id: 'width_mm', label: 'Width (mm)' },
                    { id: 'height_mm', label: 'Height (mm)' },
                ].map((field) => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="mb-1 block font-medium">
                            {field.label} <span className="text-sm text-gray-500">(optional)</span>
                        </label>
                        <input
                            id={field.id}
                            type="number"
                            value={(data as any)[field.id]}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
                    </div>
                ))}
            </div>

            <ActionFooter onSubmit={onSubmit} cancelHref={cancelHref} processing={processing} submitText={submitText} cancelText="Cancel" />
        </form>
    );
};

export default Form;
